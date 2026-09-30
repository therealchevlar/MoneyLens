# MoneyLens — Agentic AI for Banking

> **"Your financial life, understood."**  
> *Developed for Allied Bank 5th Fintech Hackathon 2026 • Thematic Area: Agentic AI for Banking*

---

## 🚀 Overview

**MoneyLens** transforms passive banking ledgers into an active financial intelligence partner. Rather than forcing users to decipher raw transaction tables, MoneyLens combines **deterministic financial calculations** with an **autonomous agent reasoning engine** powered by Google Gemini 3.8 Flash.

It answers the core questions every banking customer asks:
* *"Where did my money go?"* (Uncovers hidden surges like +18.2% in dining)
* *"Can I afford a Honda Civic or a PKR 150,000 laptop?"* (Dynamic What-If cashflow stress testing)
* *"Will I have enough money next month?"* (Predictive 60-day cash flow trajectory against scheduled bills)
* *"Will I reach my university fee deadline?"* (Real-time goal deficit tracking and required contribution pace)

---

## 🏛️ The 9 Architectural Layers

1. **Layer 1 — Core Architecture**: Strict TypeScript types (`Account`, `Transaction`, `Goal`, `RecurringObligation`, `CashFlowPoint`, `FinancialHealthScore`), Tailwind dark-mode banking design system.
2. **Layer 2 — Realistic Financial Data**: 6-month synthetic dataset grounded in Pakistan (PKR currency, Allied Bank, LESCO/K-Electric, Nayatel, Hafeez Center, university fees, restaurant dining surge).
3. **Layer 3 — Financial Intelligence Engine**: 100% deterministic mathematical calculations with unit test suite runner (0% hallucinated math).
4. **Layer 4 — Visual Dashboard**: Executive scorecard, Financial Health Score breakdown modal, 60-day cash flow curve, category spending breakdown, transaction search & filter modal.
5. **Layer 5 — What-If Financial Simulator**: Live sandbox testing capital purchases (e.g. laptop, vehicles), rent hikes (+PKR 10k), and savings acceleration against an emergency floor.
6. **Layer 6 — MoneyLens AI Agent**: Multi-step observable tool pipeline (`[getAccountSummary]`, `[getUpcomingObligations]`, `[simulatePurchase]`), structured executive answers with key figures, causation, and action triggers.
7. **Layer 7 — Dynamic AI Insights**: Continuous background auditing across 6 intelligence dimensions (Spending Velocity, Subscriptions, Anomalies, Goals, Cashflow Buffer).
8. **Layer 8 — Polish & Microinteractions**: Keyboard shortcuts (`Escape` key dismiss), mobile responsive drawers, smooth animations, and Vercel deployment readiness.
9. **Layer 9 — Master System Verification**: Comprehensive unit test execution, zero lint errors, and production build readiness.

---

## 📦 Deploying to GitHub & Vercel

MoneyLens is built on standard **Vite + React + TypeScript** with zero proprietary lock-in.

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: MoneyLens Agentic Banking Application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/moneylens.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. Vercel automatically detects the Vite framework preset:
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
4. *(Optional)* Add Environment Variable:
   * `VITE_GEMINI_API_KEY`: Your Google Gemini API Key
5. Click **Deploy**!

> **Note**: Even if no API key is provided, MoneyLens runs on its **deterministic banking agent engine**, ensuring judges receive grounded, instant answers with 100% reliability.

---

## 🧪 Built-in Unit Test Suite

Inside the app, navigate to **Settings & Diagnostics** and click **"Run Engine Tests"** to verify:
1. `Savings Rate Computation` (PKR 40,200 net savings / PKR 250,000 income = 16.1%)
2. `Food & Dining Surge Detection` (PKR 32,500 vs PKR 27,500 = +18.2%)
3. `Recurring Subscriptions Aggregate` (Coursera + Netflix + Spotify = PKR 6,400/mo)
4. `Spending Anomaly Detection` (Hafeez Center PKR 48,000 flagged at 9.2x category average)
5. `Cashflow Forecast Trajectory` (60-day projection preserves PKR 100,000 emergency floor)
6. `Goal Completion Mathematics` (University Fees milestone deficit calculation)
7. `Financial Health Score Algorithm` (Multivariate weighted composite score of 74/100)

---

## 🏆 Allied Bank Hackathon Judge Scenarios

Try these exact prompts in the **MoneyLens AI** tab:
1. *"Can I afford a Honda Civic?"* → Demonstrates automotive loan math, PKR 2.55M down payment, SBP DBR check, and university fee conflict.
2. *"Can I afford a PKR 150,000 laptop?"* → Demonstrates liquid reserve stress, emergency floor breach alert, and installment alternatives.
3. *"Why did my food spending increase 18% this month?"* → Demonstrates restaurant receipt audit across Cafe Aylanto, Ginsoy, Kolachi, and Chai Khana.
4. *"Which subscriptions am I paying for?"* → Dissects Coursera (70.3%), Netflix, and Spotify totaling PKR 6,400/mo.
5. *"Will I have enough money next month?"* → Validates scheduled Oct 1 salary vs upcoming bills.
6. *"Will I reach my university fee goal?"* → Calculates PKR 46,400/mo required contribution pace to hit Dec 15 deadline.
