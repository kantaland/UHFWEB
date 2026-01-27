# UHF Promo - Replit Configuration

## Overview

UHF Promo is a music promotion marketing web application designed for content creators to purchase tiered YouTube and social media growth packages. The application features a luxury-styled React frontend with pricing cards, ROI simulation tools, AI-powered chat assistance via Google's Gemini API, and contract/checkout workflows with PDF generation capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS loaded via CDN, with custom CSS for luxury brand aesthetics (Manrope/Inter fonts, dark theme, platinum text effects)
- **Component Structure**: Modal-based UI pattern with separate components for pricing, checkout, FAQ, case studies, pitch deck, and privacy policy

### State Management
- Local React state using `useState` hooks
- No external state management library - component-level state is sufficient for the current scope

### AI Integration
- Google Gemini API (`@google/genai` package) for AI-powered chat functionality in the ROI Simulator
- API key configured via environment variable `API_KEY` (accessed through Vite's `loadEnv`)

### PDF Generation
- jsPDF library for generating downloadable contracts during the checkout flow

### Key Design Patterns
- **Modal-driven navigation**: Major features (checkout, FAQ, pitch deck, case studies, privacy) are displayed in overlay modals
- **Type-safe development**: TypeScript interfaces defined in `types.ts` for pricing tiers, protocol categories, song configuration, and user stats
- **Componentized icons**: Lucide React icons wrapped in a single `Icons.tsx` export file for consistent imports

### Deployment Configuration
- Vite dev server configured for host `0.0.0.0` on port `5000`
- Vercel configuration present with SPA routing rewrites
- Base path set to `/` for root deployment

## External Dependencies

### Third-Party Services
- **Google Gemini API**: Powers the AI chat assistant in the ROI simulator. Requires `GEMINI_API_KEY` or `API_KEY` environment variable.
- **Google Fonts**: Manrope and Inter fonts loaded from fonts.googleapis.com
- **Tailwind CSS CDN**: Styling framework loaded directly from cdn.tailwindcss.com

### NPM Packages
- **React/React-DOM**: Core UI framework
- **jsPDF**: Client-side PDF document generation for contracts
- **lucide-react**: Icon library for UI elements
- **@google/genai**: Google Generative AI SDK for Gemini integration

### Environment Variables Required
- `API_KEY` or `GEMINI_API_KEY`: Google Gemini API key for AI chat functionality