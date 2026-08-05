# Changelog - Le Pacte silencieux

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-08-05

### ✨ Added

- **Core Features**
  - Silent pact creation with 1, 3, or 7-day duration
  - Magic link authentication via Supabase Auth
  - Automatic pairing system for users with same duration
  - 4 silent gestures: "Je suis là", "Je tiens", "Aujourd'hui c'est fragile", "Je veille avec toi"
  - Complete anonymity - no public profiles

- **API Endpoints**
  - `POST /api/start` - Create a new pact
  - `GET /api/pact` - Retrieve pact details
  - `POST /api/gesture` - Send a gesture
  - `POST /api/report` - Report inappropriate behavior

- **Pages**
  - Home page with pact creation form
  - Waiting page for pairing
  - Active pact page with gesture interface
  - Privacy policy page
  - Terms of service page
  - 404 page

- **Components**
  - Header with theme toggle
  - Footer with navigation links
  - Donation button
  - Dark mode support

- **Deployment**
  - Vercel configuration
  - Docker support
  - GitHub Actions CI/CD workflows
  - Comprehensive deployment documentation

- **Documentation**
  - README with full setup instructions
  - Deployment guide
  - Contributing guidelines
  - Release notes
  - API documentation

### 🔒 Security

- Secure magic link authentication
- Email hashing with SHA-256
- Supabase RLS policies
- Environment variables for sensitive data
- Report mechanism for abuse prevention

### 🎨 Design

- Minimalist and peaceful interface
- Dark mode by default (toggle available)
- Responsive design for mobile and desktop
- Smooth transitions and animations
- Focus on clarity and simplicity

### 📦 Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase Auth
- Vercel deployment

---

## Planned Features

- Email notifications for new gestures
- Session history and statistics
- Rate limiting on API endpoints
- Admin dashboard for moderation
- Multi-language support
- Custom domain support
- Analytics integration

---

**Status**: 🟢 Production Ready
