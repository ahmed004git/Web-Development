# Property Dealer CRM System

A full-stack CRM system for property dealers in Pakistan to manage leads, track activities, and analyze performance.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS

## Project Structure
- `src/app`: Application routes and pages.
- `src/models`: Database schemas.
- `src/lib`: Shared utilities and connection logic.
- `src/components`: Reusable UI components.
- `src/actions`: Server actions for data mutations.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env.local`:
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
