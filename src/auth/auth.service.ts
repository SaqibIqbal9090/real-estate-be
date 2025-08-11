import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
} 