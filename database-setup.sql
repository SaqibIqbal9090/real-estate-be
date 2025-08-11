-- Database setup script for Real Estate Backend
-- Run this script in your PostgreSQL database

-- Create database (run this as superuser)
-- CREATE DATABASE real_estate;

-- Connect to the database
-- \c real_estate;

-- Create extension for UUID support (if not already exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created automatically by Sequelize when the application starts
-- with synchronize: true in development mode 