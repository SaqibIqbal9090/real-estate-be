import { Injectable, UnauthorizedException, ConflictException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetTokenDto } from './dto/verify-reset-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from './email.service';
import { User } from '../users/user.model';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password before creating user
    const hashedPassword = await bcrypt.hash(password, 10);
    this.logger.debug(`Password hashed successfully. Hash length: ${hashedPassword.length}`);
    
    // Create user with hashed password
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      fullName,
    });
    
    this.logger.debug(`User created with ID: ${user.id}`);
    this.logger.debug(`Stored password is hashed: ${user.password.startsWith('$2a$') || user.password.startsWith('$2b$')}`);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.debug(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.debug(`User not found for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`User found: ${user.id}, has password: ${!!user.password}`);
    this.logger.debug(`Stored password is hashed: ${user.password.startsWith('$2a$') || user.password.startsWith('$2b$')}`);

    // Check if user has a password (should always have one, but safety check)
    if (!user.password) {
      this.logger.error(`User ${user.id} has no password stored`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    try {
      this.logger.debug(`Comparing passwords for user ${user.id}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.debug(`Password comparison result: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        this.logger.debug(`Invalid password for user: ${user.id}`);
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      this.logger.error(`bcrypt error for user ${user.id}:`, error.message);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`Login successful for user: ${user.id}`);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && await user.comparePassword(password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    this.logger.debug(`Forgot password request for email: ${email}`);

    // Find user by email
    const existingUser = await this.usersService.findByEmail(email);
    if (!existingUser) {
      throw new ConflictException('User with this email does not exist');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

    // Save token and expiry to user
    await existingUser.update({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    this.logger.debug(`Password reset token generated for user: ${existingUser.id}`);

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      this.logger.debug(`Password reset email sent to: ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error.message);
      // Clear the token if email sending failed
      await existingUser.update({
        passwordResetToken: null,
        passwordResetExpires: null,
      });
      throw new Error('Failed to send password reset email. Please try again.');
    }

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async verifyResetToken(verifyResetTokenDto: VerifyResetTokenDto): Promise<{ message: string; valid: boolean }> {
    const { token } = verifyResetTokenDto;

    this.logger.debug(`Token verification request for token: ${token.substring(0, 8)}...`);

    // Find user by reset token
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      this.logger.debug(`No user found with token: ${token.substring(0, 8)}...`);
      return {
        message: 'Invalid or expired reset token.',
        valid: false,
      };
    }

    // Check if token has expired
    if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
      this.logger.debug(`Token expired for user: ${user.id}`);
      // Clear expired token
      await user.update({
        passwordResetToken: null,
        passwordResetExpires: null,
      });
      return {
        message: 'Reset token has expired.',
        valid: false,
      };
    }

    this.logger.debug(`Token is valid for user: ${user.id}`);
    return {
      message: 'Reset token is valid.',
      valid: true,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    this.logger.debug(`Password reset request for token: ${token.substring(0, 8)}...`);

    // Find user by reset token
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
      },
    });

    if (!user) {
      this.logger.debug(`No user found with token: ${token.substring(0, 8)}...`);
      throw new BadRequestException('Invalid or expired reset token.');
    }

    // Check if token has expired
    if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
      this.logger.debug(`Token expired for user: ${user.id}`);
      // Clear expired token
      await user.update({
        passwordResetToken: null,
        passwordResetExpires: null,
      });
      throw new BadRequestException('Reset token has expired.');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    this.logger.debug(`New password hashed for user: ${user.id}`);

    // Update user password and clear reset token
    await user.update({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    this.logger.debug(`Password reset successful for user: ${user.id}`);

    return {
      message: 'Password has been reset successfully.',
    };
  }
} 