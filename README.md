# StudioSpace — Frontend

A modern, responsive studio rental platform built with Next.js, TypeScript, and Tailwind CSS. StudioSpace allows users to discover studios, explore details, manage listings, and book spaces through an intuitive interface.

**Live Website:** https://studiospace-a-08.vercel.app

**Backend API:** https://studiospace-server-h7p3.onrender.com

## Overview

StudioSpace is a full-stack studio rental platform designed to connect people looking for creative spaces with studio owners. Users can browse available studios, manage their own listings, make bookings, and share reviews.

## Features

- **Authentication:** Email/password and Google authentication using Better Auth.
- **Explore Studios:** Browse studios with search, category filtering, and price sorting.
- **Studio Details:** View studio information, images, amenities, pricing, and reviews.
- **Studio Management:** Create, edit, and delete personal studio listings.
- **Image Upload:** Upload studio images through the backend image upload API.
- **Booking System:** Book studios and manage personal reservations.
- **Double Booking Prevention:** Prevent conflicting bookings for the same time slot.
- **Reviews:** Submit and view studio reviews.
- **User Dashboard:** View personal statistics, studio listings, and recent bookings.
- **My Bookings:** View and manage booking history.
- **Responsive Design:** Optimized for mobile, tablet, and desktop.
- **Theme Switching:** Light and dark mode support.

## Technology Stack

| Category       | Technologies |
| -------------- | ------------ |
| Framework      | Next.js 16   |
| Language       | TypeScript   |
| Styling        | Tailwind CSS |
| Authentication | Better Auth  |
| Icons          | Lucide React |
| Notifications  | Sonner       |
| Deployment     | Vercel       |

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm
- Git

### Installation

Clone the repository:

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd studiospace-client
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, configure the deployed backend URL in your Vercel environment variables.

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (main)/
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
└── ...
```

## Deployment

The frontend is deployed on Vercel.

**Live URL:** https://studiospace-a-08.vercel.app

## Backend Repository

The backend is maintained separately:

https://github.com/tanvir134338/studiospace-server

## Developer

**Tanvir**

Full-Stack Web Developer

GitHub: https://github.com/tanvir134338

---

Built with Next.js, TypeScript, and a passion for creating useful web experiences.
