# Yousif & Sons Rent A Car

## Overview
A car rental management application built with React, Vite, and Firebase. Features include booking management, vehicle tracking, invoice generation, and PWA support.

## Recent Changes
- 2026-02-16: Re-imported to Replit environment
  - Extracted from zip archive
  - Installed Node.js 20 and npm dependencies
  - Configured workflow on port 5000
  - Set up static deployment (dist folder)

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: react-router-dom v6
- **State**: TanStack React Query v5
- **Backend**: Firebase (auth, Firestore, storage)
- **PWA**: vite-plugin-pwa with workbox
- **PDF**: jspdf + html2canvas

## Key Files
- `src/App.tsx` - Main app with routing and splash screen
- `src/hooks/useAuth.tsx` - Firebase authentication
- `src/lib/firebase.ts` - Firebase configuration
- `src/lib/firestoreService.ts` - Firestore data operations
- `src/components/Layout.tsx` - App layout wrapper
- `vite.config.ts` - Vite configuration (port 5000, host 0.0.0.0, allowedHosts: true)
- `index.html` - Entry HTML with PWA meta tags

## User Preferences
- (none recorded yet)
