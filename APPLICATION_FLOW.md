# Application Flow & Routing Structure

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NestJS Application                       │
├─────────────────────────────────────────────────────────────┤
│  main.ts (Bootstrap)                                        │
│  ├── AppModule (Root Module)                                │
│  │   ├── ConfigModule (Environment Variables)               │
│  │   ├── SequelizeModule (Database Connection)              │
│  │   ├── AuthModule (Authentication)                        │
│  │   └── AppController (Health Check)                       │
│  └── Global Middleware (CORS, Validation)                   │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Module Structure

### 1. **Root Module (`AppModule`)**
**File:** `src/app.module.ts`
**Purpose:** Main application module that orchestrates all other modules

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),     // Environment variables
    SequelizeModule.forRoot(databaseConfig),      // Database connection
    AuthModule,                                   // Authentication module
  ],
  controllers: [AppController],                   // Health check endpoint
  providers: [AppService],
})
```

### 2. **Authentication Module (`AuthModule`)**
**File:** `src/auth/auth.module.ts`
**Purpose:** Handles user authentication and authorization

```typescript
@Module({
  imports: [
    UsersModule,                                  // User management
    PassportModule,                               // Authentication strategies
    JwtModule.registerAsync({...}),               // JWT configuration
  ],
  controllers: [AuthController],                  // Auth endpoints
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
```

### 3. **Users Module (`UsersModule`)**
**File:** `src/users/users.module.ts`
**Purpose:** User data management and database operations

```typescript
@Module({
  imports: [SequelizeModule.forFeature([User])],  // User model
  providers: [UsersService],                      // User business logic
  exports: [UsersService, SequelizeModule],       // Available to other modules
})
```

## 🛣️ Routing Structure

### **Base URL:** `http://localhost:3200`

| Method | Endpoint | Controller | Description | Authentication |
|--------|----------|------------|-------------|----------------|
| `GET` | `/` | `AppController` | Health check | ❌ None |
| `POST` | `/auth/register` | `AuthController` | User registration | ❌ None |
| `POST` | `/auth/login` | `AuthController` | User login | ❌ None |
| `GET` | `/auth/profile` | `AuthController` | Get user profile | ✅ JWT Required |

## 🔄 Request Flow

### 1. **Application Startup Flow**
```
main.ts → NestFactory.create() → AppModule → Load all modules → Start server
```

### 2. **Authentication Flow**

#### **Registration Flow:**
```
POST /auth/register
├── AuthController.register()
├── AuthService.register()
├── UsersService.create() → Database
├── JWT Token Generation
└── Response: { user, token }
```

#### **Login Flow:**
```
POST /auth/login
├── AuthController.login()
├── AuthService.login()
├── UsersService.findByEmail() → Database
├── Password Verification (bcrypt)
├── JWT Token Generation
└── Response: { user, token }
```

#### **Protected Route Flow:**
```
GET /auth/profile
├── JwtAuthGuard (Middleware)
├── JWT Token Validation
├── User Extraction from Token
├── AuthController.getProfile()
└── Response: { user data }
```

### 3. **Database Flow**
```
Request → Service → Sequelize Model → PostgreSQL Database
Response ← Service ← Sequelize Model ← PostgreSQL Database
```

## 🔐 Authentication & Authorization

### **JWT Strategy (`JwtStrategy`)**
- **File:** `src/auth/strategies/jwt.strategy.ts`
- **Purpose:** Validates JWT tokens in protected routes
- **Flow:** Extract token → Verify signature → Extract user data

### **Local Strategy (`LocalStrategy`)**
- **File:** `src/auth/strategies/local.strategy.ts`
- **Purpose:** Validates email/password during login
- **Flow:** Email/Password → User lookup → Password verification

### **JWT Guard (`JwtAuthGuard`)**
- **File:** `src/auth/guards/jwt-auth.guard.ts`
- **Purpose:** Protects routes requiring authentication
- **Usage:** `@UseGuards(JwtAuthGuard)`

## 📊 Data Models

### **User Model (`User`)**
**File:** `src/users/user.model.ts`
```typescript
@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
```

## 🔧 Middleware & Pipes

### **Global Middleware (main.ts)**
1. **CORS:** `app.enableCors()` - Allows cross-origin requests
2. **Validation:** `ValidationPipe` - Validates incoming data
   - `whitelist: true` - Strips non-whitelisted properties
   - `forbidNonWhitelisted: true` - Throws error for non-whitelisted properties
   - `transform: true` - Transforms payloads to DTOs

### **DTOs (Data Transfer Objects)**
- **RegisterDto:** `src/auth/dto/register.dto.ts`
- **LoginDto:** `src/auth/dto/login.dto.ts`

## 🗄️ Database Integration

### **Sequelize Configuration**
**File:** `src/config/database.config.ts`
```typescript
export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'real_estate',
  autoLoadModels: true,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}
```

## 🚀 API Endpoints Details

### **1. Health Check**
```http
GET /
Response: "Hello World!"
```

### **2. User Registration**
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### **3. User Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### **4. Get User Profile (Protected)**
```http
GET /auth/profile
Authorization: Bearer jwt_token_here

Response:
{
  "userId": "uuid",
  "email": "john@example.com"
}
```

## 🔄 Error Handling

### **HTTP Status Codes**
- `200` - Success
- `201` - Created (Registration)
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid credentials)
- `409` - Conflict (User already exists)
- `500` - Internal Server Error

### **Error Response Format**
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request"
}
```

## 🛡️ Security Features

1. **Password Hashing:** bcrypt with salt rounds of 10
2. **JWT Tokens:** 24-hour expiration
3. **Input Validation:** Class-validator decorators
4. **CORS Protection:** Configurable cross-origin requests
5. **SQL Injection Protection:** Sequelize ORM
6. **UUID Primary Keys:** Enhanced security

## 📈 Scalability Considerations

1. **Modular Architecture:** Easy to add new modules
2. **Database Connection Pooling:** Configured for performance
3. **Environment-based Configuration:** Different settings for dev/prod
4. **Separation of Concerns:** Clear module boundaries
5. **TypeScript:** Type safety and better development experience 