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
      host: host || 'smtp.gmail.com',
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

  async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      const verificationUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: email,
        subject: 'Email Verification - Real Estate Marketplace App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Real Estate Marketplace!</h2>
            <p>Hello,</p>
            <p>Thank you for registering. Please click the button below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        `,
        priority: 'high' as const,
        messageId: `<verify-${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      // Send email with timeout
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]) as nodemailer.SentMessageInfo;
      const duration = Date.now() - startTime;
      
      this.logger.log(`Verification email sent to ${email} in ${duration}ms. Message ID: ${info.messageId}`);
      
      if (info.previewUrl) {
        this.logger.warn(`Preview URL (Ethereal Email): ${info.previewUrl}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Failed to send verification email to ${email} after ${duration}ms:`, error.message);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  async sendBuyRequestNotificationToAdmin(
    buyRequestData: {
      id: string;
      bedrooms?: string;
      budget?: number;
      city?: string;
      neighborhoods?: string[];
      workLocation?: string;
      commuteRadius?: number;
      features?: string[];
      pets?: string[];
      priority?: string;
      moveDate?: Date;
      moveUrgency?: string;
      duration?: number;
      roommates?: string;
      creditScore?: string | number;
      createdAt: Date;
    },
    userData: {
      fullName: string;
      email: string;
    },
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || this.configService.get<string>('SMTP_USER') || 'realestatemarketplaceintl@gmail.com';
      
      if (!adminEmail || adminEmail.trim() === '') {
        this.logger.warn('No admin email configured. Skipping email notification.');
        return;
      }
      
      // Format the buy request data for email
      const formatValue = (value: any): string => {
        if (value === null || value === undefined || value === '') {
          return 'Not specified';
        }
        if (Array.isArray(value)) {
          return value.length > 0 ? value.join(', ') : 'Not specified';
        }
        if (value instanceof Date) {
          return value.toLocaleString();
        }
        return String(value);
      };

      const formatCurrency = (value: number | undefined): string => {
        if (!value) return 'Not specified';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      };

      const mailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: adminEmail,
        subject: `New Buy Request from ${userData.fullName} - Real Estate Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Buy Request Received
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">User Information</h3>
              <p><strong>Name:</strong> ${userData.fullName}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
            </div>

            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Buy Request Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Request ID:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${buyRequestData.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Bedrooms:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.bedrooms)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Budget:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatCurrency(buyRequestData.budget)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>City:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.city)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Neighborhoods:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.neighborhoods)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Work Location:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.workLocation)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Commute Radius:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.commuteRadius)} miles</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Features:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.features)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Pets:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.pets)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Priority:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.priority)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Move Date:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.moveDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Move Urgency:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.moveUrgency)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Duration:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.duration)} months</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Roommates:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.roommates)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Credit Score:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(buyRequestData.creditScore)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px;"><strong>Request Date:</strong></td>
                  <td style="padding: 8px;">${formatValue(buyRequestData.createdAt)}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
              <p>This is an automated notification from the Real Estate Marketplace system.</p>
              <p>Please contact the user at <a href="mailto:${userData.email}">${userData.email}</a> to follow up on this buy request.</p>
            </div>
          </div>
        `,
        priority: 'high' as const,
        messageId: `<buy-request-${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      // Send email with timeout
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]) as nodemailer.SentMessageInfo;
      const duration = Date.now() - startTime;
      
      this.logger.log(`Buy request notification email sent to admin (${adminEmail}) in ${duration}ms. Message ID: ${info.messageId}`);
      
      // Log the preview URL for development (Ethereal Email)
      if (info.previewUrl) {
        this.logger.warn(`Preview URL (Ethereal Email - for testing only): ${info.previewUrl}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Failed to send buy request notification email to admin after ${duration}ms:`, error.message);
      
      // Don't throw error - we don't want email failures to break the buy request creation
      // Just log the error
      this.logger.warn('Buy request was created successfully, but admin notification email failed.');
    }
  }

  async sendContactFormEmail(
    contactData: {
      fullName: string;
      email: string;
      phoneNumber?: string;
      subject: string;
      message: string;
    },
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || this.configService.get<string>('SMTP_USER') || 'realestatemarketplaceintl@gmail.com';
      
      if (!adminEmail || adminEmail.trim() === '') {
        this.logger.warn('No admin email configured. Skipping contact form email notification.');
        return;
      }

      const mailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: adminEmail,
        replyTo: contactData.email,
        subject: `Contact Form: ${contactData.subject} - Real Estate Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Contact Information</h3>
              <p><strong>Full Name:</strong> ${contactData.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
              ${contactData.phoneNumber ? `<p><strong>Phone Number:</strong> <a href="tel:${contactData.phoneNumber}">${contactData.phoneNumber}</a></p>` : ''}
            </div>

            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Message Details</h3>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <div style="margin-top: 15px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
              <p>This is an automated notification from the Real Estate Marketplace contact form.</p>
              <p>You can reply directly to this email to respond to <strong>${contactData.fullName}</strong> at <a href="mailto:${contactData.email}">${contactData.email}</a>.</p>
            </div>
          </div>
        `,
        priority: 'high' as const,
        messageId: `<contact-${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      // Send email with timeout
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]) as nodemailer.SentMessageInfo;
      const duration = Date.now() - startTime;
      
      this.logger.log(`Contact form email sent to admin (${adminEmail}) in ${duration}ms. Message ID: ${info.messageId}`);
      
      // Log the preview URL for development (Ethereal Email)
      if (info.previewUrl) {
        this.logger.warn(`Preview URL (Ethereal Email - for testing only): ${info.previewUrl}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Failed to send contact form email to admin after ${duration}ms:`, error.message);
      
      // Re-throw error so the controller can handle it
      throw new Error(`Failed to send contact form email: ${error.message}`);
    }
  }

  async sendSellRequestNotificationToAdmin(
    sellRequestData: {
      id: string;
      homeAddress: string;
      sellTimeline: string;
      estimatedPrice: string;
      propertyType: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      createdAt: Date;
      // Catalog property claimed by this request; null/undefined when the
      // seller typed an address we don't have in the database.
      propertyId?: string | null;
    },
    userData: {
      fullName: string;
      email: string;
    },
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || this.configService.get<string>('SMTP_USER') || 'realestatemarketplaceintl@gmail.com';
      
      if (!adminEmail || adminEmail.trim() === '') {
        this.logger.warn('No admin email configured. Skipping email notification.');
        return;
      }
      
      // Format the sell request data for email
      const formatValue = (value: any): string => {
        if (value === null || value === undefined || value === '') {
          return 'Not specified';
        }
        if (value instanceof Date) {
          return value.toLocaleString();
        }
        return String(value);
      };

      const mailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: adminEmail,
        subject: `New Sell Request from ${userData.fullName} - Real Estate Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Sell Request Received
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">User Information</h3>
              <p><strong>Name:</strong> ${userData.fullName}</p>
              <p><strong>Email:</strong> ${userData.email}</p>
            </div>

            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Sell Request Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Request ID:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${sellRequestData.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Catalog Property:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${
                    sellRequestData.propertyId
                      ? `Matched — ID ${sellRequestData.propertyId} (ownership claim pending verification)`
                      : 'No match — address entered manually by the seller'
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Home Address:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(sellRequestData.homeAddress)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Sell Timeline:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(sellRequestData.sellTimeline)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Estimated Price:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(sellRequestData.estimatedPrice)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Property Type:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(sellRequestData.propertyType)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Full Name:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatValue(sellRequestData.fullName)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Email:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><a href="mailto:${sellRequestData.email}">${sellRequestData.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>Phone Number:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><a href="tel:${sellRequestData.phoneNumber}">${sellRequestData.phoneNumber}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px;"><strong>Request Date:</strong></td>
                  <td style="padding: 8px;">${formatValue(sellRequestData.createdAt)}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
              <p>This is an automated notification from the Real Estate Marketplace system.</p>
              <p>Please contact the user at <a href="mailto:${userData.email}">${userData.email}</a> to follow up on this sell request.</p>
            </div>
          </div>
        `,
        priority: 'high' as const,
        messageId: `<sell-request-${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      // Send email with timeout
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]) as nodemailer.SentMessageInfo;
      const duration = Date.now() - startTime;
      
      this.logger.log(`Sell request notification email sent to admin (${adminEmail}) in ${duration}ms. Message ID: ${info.messageId}`);
      
      // Log the preview URL for development (Ethereal Email)
      if (info.previewUrl) {
        this.logger.warn(`Preview URL (Ethereal Email - for testing only): ${info.previewUrl}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`Failed to send sell request notification email to admin after ${duration}ms:`, error.message);
      
      // Don't throw error - we don't want email failures to break the sell request creation
      // Just log the error
      this.logger.warn('Sell request was created successfully, but admin notification email failed.');
    }
  }

  // ---------------------------------------------------------------------------
  // Insurance quote emails
  // ---------------------------------------------------------------------------

  /**
   * Turn a human label and a details object into HTML table rows.
   * Handles nested arrays of objects (e.g. vehicles, drivers) as sub-tables.
   */
  private renderDetailsRows(details: Record<string, any> | undefined | null): string {
    if (!details || typeof details !== 'object') {
      return '<tr><td style="padding: 8px;" colspan="2">No additional details provided</td></tr>';
    }

    const humanize = (key: string): string =>
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, (c) => c.toUpperCase());

    const formatScalar = (value: any): string => {
      if (value === null || value === undefined || value === '') return 'Not specified';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not specified';
      return String(value);
    };

    const rows: string[] = [];

    for (const [key, value] of Object.entries(details)) {
      // Array of objects -> render each as its own labelled block
      if (Array.isArray(value) && value.some((v) => v && typeof v === 'object')) {
        value.forEach((item, index) => {
          const subRows = Object.entries(item || {})
            .map(
              ([k, v]) =>
                `<tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; width: 45%;"><strong>${humanize(
                  k,
                )}</strong></td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${formatScalar(
                  v,
                )}</td></tr>`,
            )
            .join('');
          rows.push(
            `<tr><td colspan="2" style="padding: 10px 8px 4px;"><strong style="color:#007bff;">${humanize(
              key,
            )} #${index + 1}</strong></td></tr>`,
            `<tr><td colspan="2" style="padding: 0 8px 10px;"><table style="width:100%; border-collapse: collapse;">${subRows}</table></td></tr>`,
          );
        });
        continue;
      }

      // Nested plain object
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const subRows = Object.entries(value)
          .map(
            ([k, v]) =>
              `<tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; width: 45%;"><strong>${humanize(
                k,
              )}</strong></td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${formatScalar(
                v,
              )}</td></tr>`,
          )
          .join('');
        rows.push(
          `<tr><td colspan="2" style="padding: 10px 8px 4px;"><strong style="color:#007bff;">${humanize(
            key,
          )}</strong></td></tr>`,
          `<tr><td colspan="2" style="padding: 0 8px 10px;"><table style="width:100%; border-collapse: collapse;">${subRows}</table></td></tr>`,
        );
        continue;
      }

      rows.push(
        `<tr><td style="padding: 8px; border-bottom: 1px solid #dee2e6; width: 45%;"><strong>${humanize(
          key,
        )}</strong></td><td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${formatScalar(
          value,
        )}</td></tr>`,
      );
    }

    return rows.join('');
  }

  private async sendMailWithTimeout(
    mailOptions: nodemailer.SendMailOptions,
    label: string,
  ): Promise<void> {
    const startTime = Date.now();
    const sendPromise = this.transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000),
    );
    const info = (await Promise.race([sendPromise, timeoutPromise])) as nodemailer.SentMessageInfo;
    const duration = Date.now() - startTime;
    this.logger.log(`${label} sent in ${duration}ms. Message ID: ${info.messageId}`);
    if (info.previewUrl) {
      this.logger.warn(`Preview URL (Ethereal Email - for testing only): ${info.previewUrl}`);
    }
  }

  async sendInsuranceRequestToAdmin(insuranceData: {
    id: string;
    type: 'home' | 'auto';
    fullName: string;
    email: string;
    phoneNumber?: string;
    details?: Record<string, any>;
    createdAt: Date;
  }): Promise<void> {
    try {
      const adminEmail =
        this.configService.get<string>('ADMIN_EMAIL') ||
        this.configService.get<string>('SMTP_USER') ||
        'realestatemarketplaceintl@gmail.com';

      if (!adminEmail || adminEmail.trim() === '') {
        this.logger.warn('No admin email configured. Skipping insurance notification.');
        return;
      }

      const typeLabel = insuranceData.type === 'home' ? 'Home' : 'Auto';

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: adminEmail,
        replyTo: insuranceData.email,
        subject: `New ${typeLabel} Insurance Quote Request from ${insuranceData.fullName} - Real Estate Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New ${typeLabel} Insurance Quote Request
            </h2>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Contact Information</h3>
              <p><strong>Name:</strong> ${insuranceData.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${insuranceData.email}">${insuranceData.email}</a></p>
              ${insuranceData.phoneNumber ? `<p><strong>Phone:</strong> <a href="tel:${insuranceData.phoneNumber}">${insuranceData.phoneNumber}</a></p>` : ''}
              <p><strong>Insurance Type:</strong> ${typeLabel}</p>
              <p><strong>Request ID:</strong> ${insuranceData.id}</p>
              <p><strong>Submitted:</strong> ${insuranceData.createdAt.toLocaleString()}</p>
            </div>

            <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Quote Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${this.renderDetailsRows(insuranceData.details)}
              </table>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
              <p>This is an automated notification from the Real Estate Marketplace insurance form.</p>
              <p>Reply directly to this email to follow up with ${insuranceData.fullName}.</p>
            </div>
          </div>
        `,
        priority: 'high' as const,
        messageId: `<insurance-admin-${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      await this.sendMailWithTimeout(mailOptions, `Insurance admin notification (${adminEmail})`);
    } catch (error) {
      this.logger.error('Failed to send insurance admin notification:', error.message);
      this.logger.warn('Insurance request was created, but admin notification email failed.');
    }
  }

  async sendInsuranceConfirmationToUser(insuranceData: {
    type: 'home' | 'auto';
    fullName: string;
    email: string;
  }): Promise<void> {
    try {
      if (!insuranceData.email || insuranceData.email.trim() === '') {
        this.logger.warn('No user email provided. Skipping insurance confirmation.');
        return;
      }

      const typeLabel = insuranceData.type === 'home' ? 'home' : 'auto';

      const mailOptions: nodemailer.SendMailOptions = {
        from: this.configService.get<string>('FROM_EMAIL') || 'noreply@realestate.com',
        to: insuranceData.email,
        subject: `We received your ${typeLabel} insurance quote request - Real Estate Marketplace`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Thanks, ${insuranceData.fullName}!</h2>
            <p>We've received your request for a <strong>${typeLabel} insurance</strong> quote.</p>
            <p>One of our licensed agents will review your information and reach out shortly with personalized quotes. No action is needed from you right now.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}"
                 style="background-color: #ff5a3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Browse Properties
              </a>
            </div>
            <p>If you have any questions, just reply to this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">Real Estate Marketplace &middot; This is an automated confirmation.</p>
          </div>
        `,
        priority: 'high' as const,
        messageId: `<insurance-user-${Date.now()}-${Math.random().toString(36).substring(7)}@realestate.com>`,
      };

      await this.sendMailWithTimeout(
        mailOptions,
        `Insurance confirmation to user (${insuranceData.email})`,
      );
    } catch (error) {
      this.logger.error('Failed to send insurance confirmation to user:', error.message);
    }
  }
}

