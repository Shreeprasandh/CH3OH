# CH3OH (Methanol) 🌿
### Next-Generation Shared Expense, Asset & Mobility Ledger

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase Postgres](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

An elegant, minimal, and tactile shared expense and physical asset tracking platform. Built for flatmates, travel groups, and vehicle co-owners who demand mathematical trust, zero floating-point loss, and quiet luxury aesthetics.

---

## 🎨 Color Palette & Tactile Design

Crafted with a warm, earth-tone linen and sage palette matching our 3D claymorphic wallet brandmark:

| Token | Hex | Role | Contrast vs Text |
| :--- | :--- | :--- | :--- |
| **Sage Hero** | `#8B9A6E` | Brand Accent, Primary Buttons & Hero Accents | WCAG AA Large (4.6:1) |
| **Warm Linen** | `#F7F2EB` | Main Application Canvas & Page Background | WCAG AAA (13.8:1) |
| **Tuscan Sand** | `#EAE2D6` | Elevated Card Surfaces, Modals & Drawers | WCAG AAA (11.9:1) |
| **Muted Border** | `#EEEEEE` | Subtle Dividers & Card Outlines | N/A (Structure) |
| **Charcoal Ink** | `#1C241B` | High-Contrast Primary Typography | Strict Accessible AAA |
| **Forest Credit** | `#3F633B` | Positive Net Balances ("Owed to you") | Accessible Green |
| **Terracotta Debt**| `#984A3B` | Negative Net Balances ("You owe") | Refined Earth Red |

---

## ✨ Core Pillars & Architectural Innovations

### 1. 📱 The Tactile Minimalist Widget Suite ("Tactile Glances")
High information density with zero cognitive clutter, no filler words, and clean tabular numerals:
* **Mini Pill (Dynamic Island / Nav Ribbon — 200×38dp)**: Ultra-compact status badge (`[Wallet] +₹2,450 │ [Bike] 14,285 km`).
* **Small Widget (1x1 Square — 160×160dp)**: Focused financial balance or bike readiness glance with live pulse pips.
* **Medium Widget (2x1 Wide Banner — 340×160dp)**: Dual-quadrant overview balancing financial health and bike custody.
* **Large Widget (2x2 Tactical Console — 340×340dp)**: Complete command hub with 7-day mini calendar strip, dual metrics, and quick-action triggers.
* **Tactile Widget Studio**: Interactive previewer and manifest generator in the Account tab.

### 2. 💰 Financial Core & Zero-Paisa-Loss Engine
* **Paisa-Exact Integer Arithmetic**: All monetary computations execute in integer minor units (Paise). Rounding remainders are deterministically allocated so $\sum \text{Splits} \equiv \text{Total Amount}$ down to the last paisa.
* **5 Split Strategies**:
  1. *Equally* (with member include/exclude checkmarks)
  2. *Unequally / Exact* (custom rupee inputs per member)
  3. *By Percentage* (validating 100%)
  4. *By Shares* (custom weighted parts: 1, 2, 3...)
  5. *By Adjustment* (fixed +/- offsets)
* **Greedy Min-Cash-Flow Simplifier**: Reduces $N(N-1)/2$ entangled debts to at most $N-1$ settlement handoffs in $O(N \log N)$ time.
* **Dynamic Auto-Category Icon**: Automatically matches expense titles (*"Petrol"*, *"Chai"*, *"Dinner"*, *"WiFi"*, *"Blinkit"*) to refined Lucide icons.
* **Multi-Currency Support**: Default ₹ (INR), toggleable to USD, EUR, GBP, and AED.
* **Backdated Payment Dates**: Record expenses on the exact day paid, keeping calendar schedules accurate for weekly entries.

### 3. 🏍️ The Group Bike Asset Module ("The Odometer Chain")
* **Odometer Handover & Verification**: Next rider confirms starting meter reading, pre-filled with the last parked value.
* **Suspicious Gap Flagging**: If the start odometer deviates by $>0.3\text{ km}$, the system flags an *Unverified Odometer Void* requiring group co-verification.
* **Individual Mobility Ledger**: Tracks separate personal kilometers logged as **Primary Rider** vs. **Passenger (Pillion)** to ensure fair wear-and-tear sharing.
* **Full-Tank Fuel Efficiency**: Computes rolling km/L mileage between consecutive refills and calculates exact per-trip fuel cost.
* **Maintenance Alarms**: Service countdowns for engine oil, chain lubrication, and brake pads.
* **Encrypted Document Vault**: Private storage for RC, Insurance, and PUC certificates accessed via short-lived signed URLs.

### 4. 📅 3D Wall Calendar & Weekly Horizon
* **Weekly Horizon Strip**: 7-day horizontal bar with expense heat dots.
* **3D Wall Calendar Modal**: 42-cell paper grid, metallic binder rings, 12 monthly fine artworks (`1.jpg`–`12.jpg`), and spring page-flip physics.

### 5. 🛡️ Supabase Security & Anti-Fraud Defense Grid
* **100% Row Level Security (RLS)**: Enforced across all 14 database tables with group membership checks.
* **Database Check Constraints**: Zero client-trust (`CHECK (amount > 0)`, `CHECK (end_odometer >= start_odometer)`).
* **Atomic Stored Procedures**: `create_expense_with_splits` executes inside a single transaction with automatic rollback if totals mismatch.
* **Immutable Audit Trail**: Append-only log recording previous states, new states, user IDs, and timestamps.
* **GDPR Account Anonymization**: Purges personal identity while preserving historical ledger balances.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Shreeprasandh/CH3OH.git
cd CH3OH
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://puycrmchufwtwgudzwbm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Apply Supabase Database Schema
Copy and execute the migration script in your Supabase SQL Editor:
```
supabase/migrations/20260927_init_ch3oh.sql
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to launch CH3OH.

---

## 🏛️ Architecture & Verification

Audited and certified by **The Seven Shadows**:
* **Alpha**: Next.js 16 async params & zero auth secret leaks.
* **Beta**: Strict environment secret isolation (`.env.local` excluded from Git).
* **Gamma**: Zod runtime schema validation on all inputs.
* **Delta**: WCAG AAA color contrast compliance and zero cartoon emojis.
* **Epsilon**: HTTP security headers (CSP, HSTS, X-Frame-Options).
* **Zeta**: Rate-limiting and performance optimization.
* **Eta**: 100% Supabase Postgres RLS coverage and anti-IDOR protection.

---

© 2026 CH3OH. Engineered with precision.
