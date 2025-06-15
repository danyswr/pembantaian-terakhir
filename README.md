# EcoMarket - E-commerce Platform

A modern e-commerce platform built with Next.js and Google Apps Script for data storage.

## Features

- Role-based authentication (Buyer/Seller)
- Product management with image upload
- Order processing and tracking
- Responsive design with dark/light theme
- Google Sheets as database via Google Apps Script

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack React Query
- **Backend**: Next.js API Routes
- **Database**: Google Sheets via Google Apps Script
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file in the root directory:

```
GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_web_app_url_here
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up your Google Apps Script (see Google Apps Script setup section)

3. Add your Google Apps Script URL to `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the `GOOGLE_APPS_SCRIPT_URL` environment variable in Vercel dashboard
4. Deploy

The application is optimized for Vercel deployment with Next.js App Router.

## Google Apps Script Setup

Use the provided Google Apps Script files (`google-apps-script-complete-fixed.js` or similar) to set up your backend. Make sure to:

1. Create a Google Spreadsheet with sheets: Users, Products, Orders
2. Deploy the Apps Script as a web app
3. Copy the web app URL to your environment variables

## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                # Utilities and configurations
├── pages/              # Page components
├── shared/             # Shared schemas and types
└── hooks/              # Custom React hooks
```