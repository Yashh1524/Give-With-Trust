# 💝 GiveWithTrust

**GiveWithTrust** is a next-generation donation platform designed to revolutionize charitable giving by introducing **transparency**, **accountability**, and **community participation**. Built for the modern donor, GiveWithTrust ensures that contributions are only used by NGOs when they provide verified evidence of impact — turning trust into measurable progress.

---

## 🚀 Why GiveWithTrust?

Many donors hesitate to give repeatedly due to uncertainty about how funds are used. GiveWithTrust solves this by making NGO funding **proof-based**, **time-bound**, and **community-controlled**. By doing so, we empower both **donors** and **NGOs**, creating a system that encourages genuine impact and discourages misuse.

---

## 🌟 Core Features

### 🛡️ Proof-Based Fund Release System

Donations are **not immediately** released to NGOs. Instead, they are held by the platform and disbursed **only after the NGO submits verified monthly reports** (proof of work). This creates a powerful incentive for performance and transparency.

### ⏳ Deadline-Driven Accountability

NGOs must submit their monthly proof **by the 3rd of the following month**. Missing this deadline results in the **loss of access** to that month's donation pool, which is then flagged for reallocation.

### 🗳️ Donor Voting for Reallocation

If an NGO fails to provide proof on time:

* A **3-day voting window** opens.
* Donors who contributed that month can **vote to redirect funds** to other NGOs who met their obligations.
* This gives donors more control and creates a dynamic, trust-based ecosystem.

### 📊 Live Donor Dashboards

Each donor gets a **real-time dashboard** where they can:

* Track donations
* See NGO proof reports
* Monitor voting history and outcomes
* View NGO ratings and progress updates

### 🧠 Smart NGO Discovery Chatbot

An AI-powered chatbot (Gemini) helps users find NGOs that align with their interests or causes. It uses:

* NGO descriptions
* Reviews
* Tags and categories
* User intent detection

### ⭐ NGO Review System

After each funding cycle, donors can **review NGOs** based on:

* Transparency
* Communication
* Proof quality
* Impact

These reviews contribute to NGO credibility and help future donors make informed decisions.

### 🧩 Admin Control Panel

A centralized dashboard for platform administrators to:

* Verify NGO submissions
* Approve/deny proof of work
* Monitor platform health and transaction logs
* Manage deadlines and flag issues

---

## 🎯 Who Is This For?

* **Donors** who demand transparency and want a say in how their funds are used.
* **NGOs** that are serious about trust-building, accountability, and long-term donor relationships.
* **Admins** managing charitable ecosystems who need robust controls and verifiable processes.

---

## 🧠 Tech Stack

| Layer        | Tools Used                                     |
| ------------ | ---------------------------------------------- |
| **Frontend** | Next.js 15, React.js, Tailwind CSS, TypeScript |
| **Backend**  | Prisma ORM, Neon DB (PostgreSQL), UploadThing  |
| **Auth**     | Clerk                                          |
| **Payments** | Razorpay                                       |
| **AI**       | Gemini API (for chatbot integration)           |
| **Email**    | Resend                                         |

---

## 🗂️ Folder Structure (Overview)

```
/prisma
  schema.prisma             # Prisma schema for DB

/public
  static files              # Publicly served files (e.g. icons, assets)

/src
  /actions                  # Server-side logic and actions
  /app                      # Route-based structure with Next.js App Router
    /about
    /admin-dashboard
    /api
    /dashboard              # Donor dashboard
    /donors
    /edit-ngo-details
    /ngos                   # NGO profiles & public view
    /notification
    /profile                # User profile
    /register-ngo
    /upload-monthly-works   # NGO proof submission
    /voting-session         # Donor voting for fund redirection
    layout.tsx
    page.tsx
    globals.css
  /components               # UI components (buttons, cards, forms)
  /context                  # React contexts (e.g. user state, theme)
  /lib                      # Utility libraries (middleware, helpers)
    middleware.ts

README.md
next.config.ts
vercel.json
package.json
tsconfig.json
.env
```

---

## 🔐 Environment Variables

> ***Note:** Do not commit secrets or `.env` to version control.*

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

WEBSITE_LINK=http://localhost:3000/

DATABASE_URL=...

SIGNING_SECRET=...

UPLOADTHING_TOKEN=...

RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...

RESEND_API_KEY=...

NEXT_PUBLIC_GEMINI_API_KEY=...
```

---

## 🏗️ Development Roadmap

### ✅ Phase 1: MVP

* NGO onboarding & registration
* Donor dashboard
* Proof submission & admin validation
* Basic payment setup

### 🔄 Phase 2: Admin System

* Admin validation flows
* Deadline enforcement
* Notification system

### 📢 Phase 3: Voting & Reviews

* Donor-based fund redirection voting
* NGO rating and review mechanism

### 🤖 Phase 4: AI Integration

* Gemini-powered chatbot for NGO discovery
* Natural language query processing

### 🌐 Phase 5: Deployment & Monitoring

* Deploy on **Vercel**
* Add **logging, monitoring, and alerting**
* Open beta testing with selected NGOs and donors

---

## 🤝 Contributions

Contributions are welcome! If you believe in transparent giving and want to be part of building this platform, feel free to fork the repo, create issues, or submit PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/xyz`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/xyz`)
5. Open a Pull Request 🚀

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

