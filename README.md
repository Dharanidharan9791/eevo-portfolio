# eevo — The Art of Celebration

> **Bespoke Celebration & Event Curation Studio**  
> Curating milestone birthdays, intimate nuptials, heritage anniversaries, private soirées, and brand experiences with poetic elegance and personal narrative.

Official website: [eevo.events](https://eevo.events)  
Instagram: [@eevo.events](https://www.instagram.com/eevo.events/)

---

## ✨ Features

- **Luxury Boutique Aesthetic:** Deep British racing green (`#0F2E22`), warm ivory (`#FAF7F2`), and antique gold accents reflecting high-end celebration curation.
- **Dynamic Star Constellation Canvas:** Lightweight, procedural HTML5 canvas particle animation honoring eevo's star/sparkle branding.
- **Concierge Consultation Drawer:** Interactive enquiry modal collecting event vision, dates, and client details.
- **Direct Mail Delivery:** Powered by [Web3Forms](https://web3forms.com) delivering customer briefs straight to `enquiry@eevo.events` (Zoho Mail).
- **Anti-Spam & Honeypot:** Built-in bot protection and graceful fallback to mail clients.
- **Quick-Contact Suite:** Direct mail client links, prefilled Gmail Web links, phone hotlinks, and one-click copy-to-clipboard actions with toast notifications.
- **Fully Responsive & Accessible:** Crafted with semantic HTML, fluid typography, and mobile-optimized layouts.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Bundler & Dev Server:** [Vite 8](https://vite.dev/)
- **Styling:** Custom Vanilla CSS Design System (CSS variables, smooth cubic-bezier transitions, glassmorphism)
- **Form Delivery:** Web3Forms API
- **Linter:** [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Dharanidharan9791/eevo-portfolio.git
cd eevo-portfolio
npm install
```

### 2. Configure Environment Variables
Create a local `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Add your Web3Forms access key:
```env
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```
*(Get a free access key by registering `enquiry@eevo.events` on [web3forms.com](https://web3forms.com)).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory |
| `npm run preview` | Locally preview the built production bundle |
| `npm run lint` | Runs Oxlint across the codebase for fast code-quality checks |

---

## 🌐 Deployment (Vercel)

This project is configured for automated deployments via [Vercel](https://vercel.com).

### Environment Variables on Vercel:
1. In your Vercel Project Dashboard, navigate to **Settings** → **Environment Variables**.
2. Add:
   - **Key:** `VITE_WEB3FORMS_ACCESS_KEY`
   - **Value:** `your-web3forms-access-key`
   - **Environments:** Check **Production**, **Preview**, and **Development**.
3. Redeploy the latest commit with **"Use existing Build Cache"** unchecked to ensure the variable is compiled into the production build.

---

## 📬 Contact & Enquiries

- **Email:** [enquiry@eevo.events](mailto:enquiry@eevo.events)
- **Phone:** [+91 9445274264](tel:+919445274264)
- **Instagram:** [@eevo.events](https://www.instagram.com/eevo.events/)

---

© 2026 eevo. All rights reserved.
