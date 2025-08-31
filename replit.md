# Overview

This is a client onboarding application for SecureForce, a cybersecurity company specializing in Salesforce security assessments and services. The application provides a multi-step wizard interface for managing client onboarding processes, including contract signing, system configuration, kickoff scheduling, and resource access. It features integration capabilities with Slack, Zoho (Meetings and Contracts), and n8n automation workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for SecureForce branding
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with full CRUD operations for clients, milestones, and integration status
- **Validation**: Shared Zod schemas between frontend and backend
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple

## Data Storage Solutions
- **Primary Database**: PostgreSQL with four main tables:
  - `users`: User authentication and management
  - `clients`: Core client information and onboarding status
  - `project_milestones`: Timeline and milestone tracking
  - `integration_status`: Third-party service connection status
- **Schema Management**: Drizzle migrations with PostgreSQL-specific features
- **Data Validation**: Shared TypeScript types and Zod schemas for type safety

## Authentication and Authorization
- **Session-based Authentication**: Express sessions stored in PostgreSQL
- **Password Security**: Bcrypt for password hashing
- **Authorization Pattern**: Simple user-based access control
- **CSRF Protection**: Built-in Express session protection

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (serverless PostgreSQL)
- **Build Tools**: Vite for frontend bundling, esbuild for backend compilation
- **Development**: Replit-specific plugins for development environment integration

### Third-party Integrations
- **Slack**: Webhook integration for client notifications and channel management
- **Zoho Services**: 
  - Zoho Meetings for scheduling kickoff calls
  - Zoho Contracts for MSA/SOW management
- **n8n**: Workflow automation platform for marketing and process automation
- **External APIs**: Configurable webhook endpoints for Slack and n8n integrations

### UI and Design System
- **Component Library**: Radix UI for accessible, unstyled components
- **Icon System**: Lucide React for consistent iconography
- **Typography**: Inter font family for modern, professional appearance
- **Theme System**: CSS custom properties with light/dark mode support

### Development and Quality Tools
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Code Quality**: ESLint with React and TypeScript configurations
- **Error Handling**: React Error Boundaries and comprehensive error logging
- **Environment Management**: Environment-specific configuration for development and production