# Overview

Share Nest is a community sharing platform that enables users to donate, borrow, and request items within their local communities. The application promotes sustainability and community building by facilitating the reuse of items, reducing waste, and helping people access resources they need. Built as a full-stack web application, it features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript, utilizing modern development practices:

- **Framework**: React 18 with TypeScript for type safety and better developer experience
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring an eco-friendly green color palette
- **State Management**: TanStack Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for robust form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The server-side application follows a RESTful API design pattern:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the full stack
- **API Design**: RESTful endpoints for CRUD operations on users, items, requests, and transactions
- **File Handling**: Multer middleware for image upload processing with type and size validation
- **Error Handling**: Centralized error handling middleware for consistent API responses

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL for relational data storage
- **ORM**: Drizzle ORM with Zod schema validation for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud hosting
- **Migrations**: Drizzle Kit for database schema migrations and management
- **Storage Pattern**: Repository pattern with in-memory fallback for development

## Authentication and Authorization
Currently implemented with session-based approach:

- **Session Management**: PostgreSQL session store for persistent user sessions
- **User Management**: User profiles with community scoring and impact tracking
- **Access Control**: Route-level protection for user-specific operations

## Data Models
The application manages several core entities:

- **Users**: Profile information, location, community metrics, and impact statistics
- **Items**: Donated items with categorization, condition tracking, and availability status
- **Requests**: Community requests for needed items with urgency levels
- **Transactions**: Borrowing history and item exchange tracking
- **Impact Stats**: Community-wide metrics for sustainability tracking

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Drizzle ORM**: Type-safe database operations and schema management

## UI and Design
- **shadcn/ui**: Pre-built accessible UI components based on Radix UI
- **Radix UI**: Headless component primitives for complex UI interactions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Fast build tool with hot module replacement for development
- **TypeScript**: Static type checking across frontend and backend
- **TanStack Query**: Server state management and API caching
- **React Hook Form**: Performance-optimized form handling
- **Zod**: Runtime type validation for forms and API schemas

## File Management
- **Multer**: Multipart form data handling for image uploads
- **Image Processing**: Built-in validation for image file types and sizes

## Deployment Platform
- **Replit**: Development and hosting platform with integrated tooling
- **ESBuild**: Fast JavaScript bundler for production builds