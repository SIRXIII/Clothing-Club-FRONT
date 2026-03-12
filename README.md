# Clothing Club Frontend (Partner Dashboard)

Partner-facing dashboard for Travel Clothing Club (TCC). Partners use this app to manage their rental clothing inventory, process orders, handle refunds, coordinate with riders, and communicate via support tickets.

## Tech Stack

- **React 19** with Vite 7
- **Tailwind CSS 4** for styling
- **React Query (TanStack)** for server-state management
- **React Router DOM 7** for client-side routing
- **Axios** for HTTP requests
- **Laravel Echo + Pusher** for real-time notifications and chat (via Reverb WebSocket server)
- **Chart.js / react-chartjs-2** for dashboard analytics
- **Framer Motion** for animations
- **CryptoJS** for OAuth state generation
- **QRCode** for product barcode/QR generation

## Features

- Partner authentication with email/password, Google, Apple, and Shopify OAuth
- Two-factor authentication (TOTP and email-based)
- Dashboard with order trends, widgets, and alerts
- Product management (CRUD, images, video, rental pricing, availability)
- Order management with rider assignment
- Refund processing (approve/reject with evidence review)
- Real-time support ticket chat
- Profile and settings management

## Backend Connection

This frontend connects to **Clothing-Club-BACK**, a Laravel API. The API base URL is configured via the `VITE_API_URL` environment variable. Real-time features (notifications, chat) use Laravel Reverb via WebSocket, configured with `VITE_REVERB_*` variables.

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Clothing-Club-FRONT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in the values:
   ```
   VITE_API_URL=http://clothing-club-back.test/api
   VITE_REVERB_APP_KEY=<your-reverb-key>
   VITE_REVERB_HOST=<your-reverb-host>
   VITE_REVERB_PORT=8080
   VITE_REVERB_SCHEME=https
   VITE_APP_GEOAPIFY_KEY=<your-geoapify-key>
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Related Repositories

- **Clothing-Club-BACK** — Laravel API backend (authentication, products, orders, refunds, support, notifications)
- **TCC-Admin-BACK** — Admin backend service
