# Password Reset API Documentation

This document describes the password reset functionality implemented in the Real Estate Backend API.

## Overview

The password reset system consists of three main endpoints that work together to provide a secure password reset flow:

1. **Forgot Password** - Generates a reset token and sends an email
2. **Verify Reset Token** - Validates if a reset token is valid and not expired
3. **Reset Password** - Updates the user's password using a valid token

## Database Changes

### New Fields Added to Users Table

```sql
-- Migration: 20250115000000-add-password-reset-fields.js
ALTER TABLE users ADD COLUMN passwordResetToken VARCHAR(255);
ALTER TABLE users ADD COLUMN passwordResetExpires TIMESTAMP;
```

### User Model Updates

The `User` model now includes:
- `passwordResetToken`: Stores the reset token (nullable)
- `passwordResetExpires`: Stores token expiration time (nullable)

## API Endpoints

### 1. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Sends a password reset email to the user if the email exists.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

**Features:**
- Generates a cryptographically secure 64-character hex token
- Sets token expiration to 1 hour from generation
- Sends HTML email with reset link
- For security, always returns success message regardless of email existence
- Clears token if email sending fails

### 2. Verify Reset Token

**Endpoint:** `POST /auth/verify-reset-token`

**Description:** Verifies if a password reset token is valid and not expired.

**Request Body:**
```json
{
  "token": "abc123def456ghi789..."
}
```

**Response (Valid Token):**
```json
{
  "message": "Reset token is valid.",
  "valid": true
}
```

**Response (Invalid/Expired Token):**
```json
{
  "message": "Invalid or expired reset token.",
  "valid": false
}
```

**Features:**
- Validates token existence in database
- Checks token expiration
- Clears expired tokens automatically
- Returns boolean validation status

### 3. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Resets the user's password using a valid reset token.

**Request Body:**
```json
{
  "token": "abc123def456ghi789...",
  "password": "newSecurePassword123"
}
```

**Response (Success):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Password Requirements:**
- Minimum 6 characters
- Must contain at least one letter
- Must contain at least one number

**Features:**
- Validates token before password update
- Hashes new password with bcrypt
- Clears reset token after successful reset
- Prevents reuse of expired tokens

## Email Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000

# For development/testing with Ethereal Email
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=test@ethereal.email
SMTP_PASS=test-password
```

### Email Template

The system sends a professional HTML email with:
- Company branding
- Clear call-to-action button
- Fallback text link
- Security information
- Expiration notice

## Security Features

### Token Security
- **Cryptographically Secure**: Uses `crypto.randomBytes(32)` for token generation
- **Time-Limited**: Tokens expire after 1 hour
- **Single Use**: Tokens are cleared after password reset
- **Database Storage**: Tokens are stored securely in the database

### Password Security
- **Bcrypt Hashing**: Passwords are hashed with bcrypt (10 rounds)
- **Validation**: Strong password requirements enforced
- **No Plain Text**: Passwords are never stored or transmitted in plain text

### Privacy Protection
- **Email Privacy**: System doesn't reveal if an email exists
- **Consistent Responses**: Always returns success message for forgot password
- **Token Logging**: Only partial tokens are logged for debugging

## Error Handling

### Common Error Responses

**Invalid Email Format:**
```json
{
  "statusCode": 400,
  "message": ["Please provide a valid email address"],
  "error": "Bad Request"
}
```

**Invalid Token:**
```json
{
  "statusCode": 400,
  "message": "Invalid or expired reset token.",
  "error": "Bad Request"
}
```

**Email Send Failure:**
```json
{
  "statusCode": 500,
  "message": "Failed to send password reset email. Please try again.",
  "error": "Internal Server Error"
}
```

## Usage Flow

1. **User requests password reset:**
   ```bash
   curl -X POST http://localhost:3000/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com"}'
   ```

2. **User receives email and clicks reset link**

3. **Frontend verifies token:**
   ```bash
   curl -X POST http://localhost:3000/auth/verify-reset-token \
     -H "Content-Type: application/json" \
     -d '{"token": "abc123def456ghi789..."}'
   ```

4. **User submits new password:**
   ```bash
   curl -X POST http://localhost:3000/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token": "abc123def456ghi789...", "password": "newPassword123"}'
   ```

## Testing

Run the test script to verify functionality:

```bash
node test-password-reset.js
```

## Migration

To apply the database changes:

```bash
npm run db:migrate
```

## Dependencies Added

- `nodemailer`: Email sending functionality
- `@types/nodemailer`: TypeScript definitions

## Files Created/Modified

### New Files:
- `src/auth/dto/forgot-password.dto.ts`
- `src/auth/dto/verify-reset-token.dto.ts`
- `src/auth/dto/reset-password.dto.ts`
- `src/auth/email.service.ts`
- `src/migrations/20250115000000-add-password-reset-fields.js`
- `test-password-reset.js`

### Modified Files:
- `src/users/user.model.ts` - Added password reset fields
- `src/auth/auth.service.ts` - Added password reset methods
- `src/auth/auth.controller.ts` - Added new endpoints
- `src/auth/auth.module.ts` - Added EmailService
- `package.json` - Added nodemailer dependency

## Frontend Integration

The frontend should:

1. **Forgot Password Page**: Form with email input
2. **Reset Password Page**: Form with new password input
3. **Token Handling**: Extract token from URL parameters
4. **Token Verification**: Verify token before showing reset form
5. **Error Handling**: Display appropriate error messages
6. **Success Handling**: Redirect to login after successful reset

## Production Considerations

1. **Email Service**: Configure production SMTP settings
2. **Rate Limiting**: Implement rate limiting for forgot password requests
3. **Token Cleanup**: Schedule job to clean expired tokens
4. **Monitoring**: Monitor email delivery and token usage
5. **HTTPS**: Ensure all communications use HTTPS
6. **Logging**: Implement proper logging for security events

