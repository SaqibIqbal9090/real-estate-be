# Profile Data Flow Explanation

## 🤔 The Question: "How does profile data come from JWT token?"

This is a great question! The profile data doesn't actually come from the database - it comes directly from the JWT token itself. Let me break down the complete flow:

## 🔄 Complete Profile Data Flow

### **Step 1: Client Makes Request**
```http
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### **Step 2: JwtAuthGuard Intercepts Request**
```typescript
// src/auth/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

The guard calls the JWT strategy to validate the token.

### **Step 3: JWT Strategy Validates Token**
```typescript
// src/auth/strategies/jwt.strategy.ts
async validate(payload: any) {
  return { userId: payload.sub, email: payload.email };
}
```

**What happens here:**
1. Extracts JWT token from `Authorization: Bearer <token>`
2. Verifies the token signature using `JWT_SECRET`
3. Decodes the token payload
4. Returns user data from the token payload

### **Step 4: Token Payload Structure**
When a user logs in, the JWT token is created with this payload:

```typescript
// From auth.service.ts during login/register
const payload = { email: user.email, sub: user.id };
const token = this.jwtService.sign(payload);
```

**Example JWT Payload:**
```json
{
  "email": "john@example.com",
  "sub": "12345678-1234-1234-1234-123456789012",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### **Step 5: Strategy Returns User Data**
The `validate()` method in JWT strategy returns:
```typescript
return { userId: payload.sub, email: payload.email };
```

This becomes `req.user` in the controller.

### **Step 6: Controller Receives User Data**
```typescript
// src/auth/auth.controller.ts
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Request() req: any) {
  return req.user; // This is the data from JWT strategy validate()
}
```

## 📊 Visual Flow Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   JWT Token     │    │   Server        │
│                 │    │                 │    │                 │
│ GET /profile    │───▶│ Bearer token    │───▶│ JwtAuthGuard    │
│ + Authorization │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Response      │    │   User Data     │    │   Controller    │
│                 │    │                 │    │                 │
│ {userId, email} │◀───│ req.user        │◀───│ JWT Strategy    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔍 Detailed Step-by-Step Breakdown

### **1. Token Creation (During Login/Register)**
```typescript
// auth.service.ts
async login(loginDto: LoginDto) {
  const user = await this.usersService.findByEmail(email);
  // ... password verification ...
  
  const payload = { email: user.email, sub: user.id };
  const token = this.jwtService.sign(payload);
  
  return { user, token };
}
```

### **2. Token Storage (Client Side)**
The client stores the JWT token (usually in localStorage, sessionStorage, or cookies).

### **3. Token Usage (Profile Request)**
```javascript
// Client-side code
fetch('/auth/profile', {
  headers: {
    'Authorization': `Bearer ${storedToken}`
  }
})
```

### **4. Server-side Processing**
```typescript
// 1. JwtAuthGuard intercepts
@UseGuards(JwtAuthGuard)

// 2. JWT Strategy validates
async validate(payload: any) {
  return { userId: payload.sub, email: payload.email };
}

// 3. Controller receives data
getProfile(@Request() req: any) {
  return req.user; // { userId: "...", email: "..." }
}
```

## 🎯 Key Points to Understand

### **1. No Database Query for Profile**
The profile endpoint **does NOT** query the database. It only uses data from the JWT token.

### **2. Token Contains User Data**
The JWT token itself contains the user information that gets returned.

### **3. Limited Data Available**
Only data that was included in the token during creation is available:
- `userId` (from `sub` claim)
- `email` (from `email` claim)

### **4. Token Expiration**
If the token is expired, the request will fail with 401 Unauthorized.

## 🔧 How to Get More Profile Data

If you want to return more user data (like `fullName`), you have two options:

### **Option 1: Include More Data in JWT Token**
```typescript
// auth.service.ts
const payload = { 
  email: user.email, 
  sub: user.id,
  fullName: user.fullName  // Add this
};
```

```typescript
// jwt.strategy.ts
async validate(payload: any) {
  return { 
    userId: payload.sub, 
    email: payload.email,
    fullName: payload.fullName  // Add this
  };
}
```

### **Option 2: Query Database in Controller**
```typescript
// auth.controller.ts
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req: any) {
  const user = await this.usersService.findById(req.user.userId);
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt
  };
}
```

## 🚨 Security Considerations

### **1. Token Size**
Don't put too much data in JWT tokens - they're sent with every request.

### **2. Sensitive Data**
Never put sensitive data (like passwords) in JWT tokens.

### **3. Token Expiration**
JWT tokens should have reasonable expiration times (24 hours in your case).

### **4. Token Storage**
Store tokens securely on the client side.

## 📝 Summary

The profile data comes from the JWT token itself, not from a database query. The flow is:

1. **Token Creation** → User data embedded in JWT during login
2. **Token Validation** → JWT strategy extracts user data from token
3. **Controller Response** → Returns the extracted user data

This is why JWT authentication is called "stateless" - the server doesn't need to store session information, it just validates the token and extracts the user data from it. 