# LiveTeamGames Dashboard

A modern dashboard application built with Next.js 15, React 19, and Tailwind CSS.

## Features

- **Responsive Design**: Clean, modern interface with sidebar navigation
- **Modular Components**: Well-organized component structure for maintainability
- **Server Components**: Optimized for performance using Next.js App Router
- **Dashboard Layout**: Professional dashboard with sidebar, header, and content areas
- **Interactive Elements**: Hover effects, transitions, and responsive design

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects to dashboard)
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── Header.tsx            # Top header with user profile
│   ├── BlackoutCard.tsx      # Blackout game information card
│   ├── NewsFeedCard.tsx      # News feed card
│   └── SupportButton.tsx     # Floating support button
└── public/                   # Static assets
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Geist Font** - Modern typography

## Component Architecture

The application follows a modular approach with server components:

- **Sidebar**: Navigation with logo and menu items
- **Header**: Top bar with user profile
- **Dashboard Content**: Two-column layout with cards
- **Support Button**: Fixed floating action button

All components are designed to be reusable and maintainable.
