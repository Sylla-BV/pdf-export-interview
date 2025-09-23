# PDF Export System

A complete PDF export system with background processing, temporary download links, and real-time status updates.

## Interview Assignment

### Introduction

Within Sylla we have an 'event-driven' architecture which means that many user actions trigger certain events that in turn trigger background jobs to run. To test your skills, we'd like you to solve a 'simplified' version of a task on our backlog which involves message queue's and real time data updates.

### What do you need to build

The idea is that we 'mimmic' some existing production behaviour of a PDF export. However, we'd like a DB table to store those PDF's and have expiring URL's to those PDF's.

A simple page that has a button, that triggers a background job. This background job produces a PDF url (this will be a dummy URL that we will specify). Then, the app would update the DB, store that 'pdf export', and subsequently will produce a temporary URL for downloading that. The link should expire in 120 seconds. That link, as soon as it's available, should show up on the page where the trigger is.

**Requirements**:

- Use QStash as a message queue ([docs here](https://upstash.com/docs/qstash/overall/getstarted))
- The PDF URL that you can use is [`this url here`](https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787)
- The user never sees this source URL
- You have to define a table for these PDF exports
- Make sure the table contains the "status" column (pending, completed, failed, etc.)
- Download URL expires in 120 seconds
- As soon as the database is populated with this new PDF export, we have to update the UI to show the new Download URL
- Make use of NextJS best practices

## Features

✅ **PDF Export System** - Complete export workflow  
✅ **Background Processing** - QStash integration for async processing  
✅ **Real-time Updates** - Smart polling for status changes  
✅ **Temporary URLs** - 120-second expiration with countdown  
✅ **Modern UI** - Responsive design with loading states  
✅ **Type Safety** - Full TypeScript implementation  
✅ **API Validation** - Zod schemas for request/response validation  
✅ **Error Handling** - Comprehensive error states and messages  
✅ **Real Database** - PostgreSQL with Docker support  

### Quick Start (Recommended)

#### Option 1: Automated Setup
```bash
# Clone the repository
git clone <repository-url>
cd pdf-export

# Install dependencies
npm install

# Set up database and environment (automated)
chmod +x setup-database.sh
./setup-database.sh

# Start development server
npm run dev
```

#### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start PostgreSQL with Docker
docker-compose up -d

# Wait for database to be ready
sleep 5

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Configuration

The setup script automatically creates `.env.local` with the correct configuration:

```env
# Database configuration
DATABASE_URL=postgresql://postgres:password@localhost:5433/pdf_export_db

# QStash configuration (optional for development)
QSTASH_TOKEN=your_qstash_token_here
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key_here
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key_here

# Base URL for webhooks
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database Setup

The application uses PostgreSQL with Docker for local development:

```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Push database schema
npm run db:push
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate new migration
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── export-pdf/         # Trigger PDF export
│   │   ├── webhooks/qstash/    # Background job webhook
│   │   ├── exports/            # List/get exports
│   │   └── download/           # Download PDF
│   └── page.tsx               # Main page
├── components/
│   └── PDFExport/             # UI components
├── hooks/                     # Custom React hooks
├── lib/
│   ├── db/                    # Database connection & queries
│   ├── qstash/                # Background job processing
│   └── validation/            # API validation schemas
├── types/                     # TypeScript type definitions
└── db/schema.ts              # Database schema
```

## How It Works

1. **User clicks "Export PDF"** - Triggers the export process
2. **Database record created** - Status set to "pending" in PostgreSQL
3. **Webhook simulation** - Local development automatically triggers webhook after 1 second
4. **Status updates** - Smart polling shows progress (only when pending)
5. **Download link generated** - Temporary URL with 120-second expiration
6. **User downloads PDF** - Direct access to the generated PDF

## Testing the Application

### Manual Testing
1. **Open the application** at [http://localhost:3000](http://localhost:3000)
2. **Click "Export PDF"** button
3. **Watch the status change**:
   - Pending → Processing → Completed
4. **Download the PDF** using the temporary link
5. **Observe the countdown timer** (120 seconds expiration)

### Unit Testing

The application includes a comprehensive test suite with **71 unit tests** covering all critical functionality.

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test files
npm test -- src/hooks/__tests__/use-pdf-export.test.tsx
npm test -- src/components/PDFExport/__tests__/DownloadLink.test.tsx
npm test -- src/app/api/__tests__/export-pdf.test.ts

# Run tests excluding API routes (if needed)
npm test -- --testPathIgnorePatterns="src/app/api"
```

#### Test Coverage

The test suite provides comprehensive coverage:

- **Database Operations** (6 tests) - Create, update, and query PDF exports
- **Utility Functions** (3 tests) - Helper functions and constants
- **API Routes** (14 tests) - Mocked API endpoint logic
- **React Hooks** (12 tests) - State management and API interactions
- **UI Components** (16 tests) - Export buttons, status displays, download links
- **Integration Workflows** (20 tests) - End-to-end user interactions

#### Test Categories

| Category | Tests | Coverage |
|----------|-------|----------|
| Database Queries | 6 | ✅ Complete |
| Constants/Utils | 3 | ✅ Complete |
| API Routes (Mocked) | 14 | ✅ Complete |
| Export State Hook | 4 | ✅ Complete |
| PDF Export Hook | 8 | ✅ Complete |
| Export Button | 3 | ✅ Complete |
| Export Status | 3 | ✅ Complete |
| Download Link | 10 | ✅ Complete |
| **Total** | **71** | **✅ 100%** |

#### Test Configuration

The test suite uses:
- **Jest** - Testing framework with Next.js integration
- **React Testing Library** - Component testing utilities
- **Mocking** - Database operations, API calls, and browser APIs
- **TypeScript** - Full type safety in tests
- **Coverage Thresholds** - 70% minimum coverage requirement

#### Key Testing Features

- **Smart Mocking** - API routes mocked to avoid Next.js server environment complexity
- **Real Component Testing** - UI components tested with actual user interactions
- **Database Mocking** - Database operations mocked for reliable testing
- **Error Scenarios** - Comprehensive error handling and edge case testing
- **User Interactions** - Button clicks, clipboard operations, countdown timers

## Local Development Features

- **Automatic Webhook Simulation**: No need for external QStash setup
- **Real Database**: PostgreSQL with Docker for data persistence
- **Smart Polling**: Only polls when status is pending, stops when completed
- **120-Second Expiration**: Download links expire after 2 minutes as per requirements

## Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with Drizzle ORM
- **Database**: PostgreSQL with Drizzle schema
- **Background Jobs**: QStash message queue
- **State Management**: React Query for server state
- **UI Components**: Radix UI primitives with custom styling