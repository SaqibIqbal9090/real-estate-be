import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT') || 587;
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true' || port === 465;

    // Check if SMTP is configured
    if (!host || !user || !pass) {
      this.logger.warn('SMTP configuration missing. Using default test configuration. Emails may be delayed.');
    }

    // Configure transporter with connection pooling and timeout settings
    const transportOptions: any = {
      host: host || 'smtp.ethereal.email',
      port: port,
      secure: secure, // true for 465, false for other ports
      auth: {
        user: user || 'test@ethereal.email',
        pass: pass || 'test-password',
      },
      // Connection pool settings for better performance
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 14, // Limit to 14 messages per second
      // Timeout settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
    };

    // Debug (only in development)
    if (this.configService.get<string>('NODE_ENV') === 'development') {
      transportOptions.debug = true;
      transportOptions.logger = true;
    }

    this.transporter = nodemailer.createTransport(transportOptions);

    // Verify connection
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP connection verification failed:', error.message);
      this.logger.warn('Email sending may be delayed or fail. Please check your SMTP configuration.');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: email,
        subject: 'Password Reset Request - Real Estate Marketplace App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        `,
        // Add priority for faster delivery
        priority: 'high' as const,
        // Message-ID for tracking
        messageId: `<${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      // Send email with timeout
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]) as nodemailer.SentMessageInfo;
      const duration = Date.now() - startTime;
      
      this.logger.log(`Password reset email sent to ${email} in ${duration}ms. Message ID: ${info.messageId}`);
      
      // Log the preview URL for development (Ethereal Email)
      if (info.previewUrl) {
        this.logger.warn(`Preview URL (Ethereal Email - for testing only): ${info.previewUrl}`);
        this.logger.warn('⚠️  Using Ethereal Email test service. For production, configure real SMTP settings.');
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Failed to send password reset email to ${email} after ${duration}ms:`, error.message);
      
      // Re-throw with more context
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}

