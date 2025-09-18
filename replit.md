# Overview

This is a comprehensive Educational Management System (EduManage) designed for managing multiple engineering colleges. The system provides role-based dashboards for Chairman, HODs, and staff to monitor student and faculty attendance, academic performance, and generate analytics across three engineering colleges: BGIIG Institute of Engineering and Technology, Brilliant Institute of Engineering and Technology, and Kasireddy Narayanreddy College of Engineering and Research.

The application follows a full-stack architecture with a React frontend using TypeScript and shadcn/ui components, an Express.js backend with session-based authentication, and PostgreSQL database management through Drizzle ORM. The system supports bulk data uploads via Excel files, comprehensive attendance tracking, marks management, and provides detailed analytics dashboards with role-based access control.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built with React 18 and TypeScript, utilizing Vite as the build tool for optimal development experience. The UI layer uses shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. State management is handled through TanStack Query for server state synchronization, with Wouter for lightweight client-side routing.

The component architecture follows a modular approach with reusable UI components in the `/components/ui` directory and feature-specific components for college cards, student search, file uploads, and sidebar navigation. The application implements responsive design with mobile-first principles using Tailwind CSS.

## Backend Architecture
The server follows a RESTful API design pattern built with Express.js and TypeScript. Authentication is implemented using Passport.js with local strategy and session-based authentication stored in PostgreSQL via connect-pg-simple. The server includes comprehensive middleware for authentication checks, role-based authorization, audit logging, and request/response logging.

File upload functionality uses Multer for handling Excel files, with XLSX library for parsing spreadsheet data. The API provides endpoints for user management, college operations, student and faculty management, attendance tracking, marks recording, and dashboard analytics.

## Database Design
PostgreSQL database with Drizzle ORM provides type-safe database operations. The schema includes tables for users (with role-based access), colleges, departments, students, faculty, attendance records, marks, audit logs, and session storage. The database design supports multi-college operations with proper foreign key relationships and indexing for performance.

User roles are enforced at the database level with enum types (chairman, hod, staff), and all database operations include proper transaction handling and data validation through Zod schemas.

## Authentication & Authorization
Session-based authentication with three distinct user roles: Chairman (full access to all colleges), HOD (department-limited access), and Staff (limited access). The system implements middleware-based authorization checks at both route and component levels, ensuring proper access control throughout the application.

Audit logging tracks all significant user actions including login attempts, data modifications, and file uploads, providing comprehensive activity monitoring and security oversight.

## Data Management
The system supports bulk data operations through Excel file uploads for students, faculty, attendance, and marks data. File upload processing includes data validation, error handling, and batch insertion capabilities. The application provides real-time dashboard updates through query invalidation and optimistic updates.

Dashboard analytics aggregate data across colleges and departments, providing KPIs for student/faculty attendance rates, pass percentages, and other educational metrics with filtering capabilities by college and time periods.

# External Dependencies

## Database & ORM
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL for cloud deployment
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication & Security
- **Passport.js**: Authentication middleware with local strategy
- **express-session**: Session management with PostgreSQL storage
- **bcrypt equivalent (scrypt)**: Password hashing using Node.js crypto module

## Frontend Libraries
- **React 18**: UI library with modern hooks and concurrent features
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for TypeScript

## UI Components & Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## File Processing
- **Multer**: Middleware for handling multipart/form-data file uploads
- **XLSX**: Library for parsing and writing Excel files
- **File validation**: 10MB limit with memory storage for temporary processing

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit plugins**: Development environment integration for runtime error handling and debugging