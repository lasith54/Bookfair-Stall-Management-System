# Frontend - Bookfair Stall Management System

A modern React-based web application for managing bookfair stall reservations, built with TypeScript, Vite, and Tailwind CSS.

## Overview

This frontend application provides an intuitive interface for users to:
- Browse available stalls on an interactive venue map
- Reserve stalls with payment processing
- View and manage their reservations
- Select book genres for their stall

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library

## Setup Guide

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration (if needed):
```bash
# Create .env file with your configuration
VITE_API_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API service clients
│   ├── contexts/        # React contexts
│   ├── lib/             # Utilities and helpers
│   └── assets/          # Static assets
├── public/              # Public assets
└── index.html           # HTML entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

