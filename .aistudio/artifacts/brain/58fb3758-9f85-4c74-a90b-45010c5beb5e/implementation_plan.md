# MoneyLens — Standalone Personal Finance & Wallet Tracker

Transition MoneyLens from a simulated bank-integrated interface into a standalone, self-contained personal finance tracker and wallet. Users start with a clean onboarding setup, set an optional monthly salary, log income deposits anytime, record itemized expenses with recurring toggles, and view dynamic AI insights and simulations computed directly from their own entries.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1:
> - **Initial State**: Zero balance on initial load with a smooth setup onboarding prompt to enter starting cash balance, primary currency, and optional monthly salary.
> - **Earnings & Income Management**: Dedicated recurring monthly salary setting (e.g. salary amount, payday of month) combined with an immediate "+ Add Income" modal for manual bonuses, freelance earnings, or cash gifts anytime.
> - **Expense Recording**: A clean "+ Add Expense" modal with category selection, date picker, merchant/note, and a "Repeat Monthly" toggle to auto-schedule recurring commitments.
> - **Branding & Identity**: Complete removal of Allied Bank Limited references; updated to a modern, private personal wallet & finance intelligence dashboard ("MoneyLens Personal Wallet").

---

## 1. Overview & Core Concept

- **What It Does**: Enables users to take complete ownership of their cash flow without linking external bank APIs or viewing mock institution data. Users define their starting balance, schedule recurring salary credits, log income anytime, log expenses on the fly, and watch their 60-day cash flow, health score, What-If simulator, and AI reasoning adapt in real time.
- **Target Persona**: Individuals, freelancers, and professionals who want privacy-first financial tracking, predictive cash flow modeling, and intelligent purchasing simulation without connecting bank accounts.
- **Key Value**: 100% user-authoritative ledger with zero external dependencies, combined with elite predictive modeling (cash dips, runway, milestone pacing).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Zero-State Onboarding**:
   - On first launch (or after selecting "Start Fresh"), a sleek modal greets the user: *"Welcome to MoneyLens Personal Wallet"*.
   - Prompts for:
     1. Current cash/liquid balance (default PKR 0 or user-entered).
     2. Monthly salary / recurring earnings (amount + payday of the month).
     3. Emergency buffer target (default PKR 50,000 or custom).
   - Instant "Start Tracking" button initializes the local ledger.

2. **Quick-Action Ledger Bar (Always Visible on Dashboard)**:
   - Primary action buttons prominently anchored in the top dashboard and navigation bar:
     - **`+ Add Income`**: Log one-off freelance inflow, bonus, cash deposit, or investment return.
     - **`- Add Expense`**: Log grocery receipt, dining bill, utility payment, or equipment purchase with category selection and "Repeat Monthly" toggle.
     - **`Edit Salary & Settings`**: One-click drawer/modal to adjust monthly salary amount or payday without resetting history.

3. **Transaction History & Ledger Exploration**:
   - All user-entered income and expenses appear immediately in the Transactions ledger with clear badges (`Income` vs `Expense`), dates, categories, and delete/edit capabilities.
   - Dynamic monthly aggregation: Monthly Inflow, Monthly Outflow, Net Savings, and Savings Rate update instantaneously.

4. **Synchronized What-If & AI Experience**:
   - The **What-If Simulator** and **MoneyLens AI** operate directly over the user's active custom balance, user-scheduled salary, and user-entered recurring obligations rather than hardcoded mock figures.

### Visual Identity & Theme
- **Theme**: Dark neutral canvas (`#09090b`), subtle hairline borders (`border-white/[0.08]`), crisp typography (`Plus Jakarta Sans`), and tabular figures (`font-mono` / `tabular-nums`).
- **Color Palette**:
  - Inflow / Positive: Emerald (`#10b981`)
  - Outflow / Deductions: Crimson / Rose (`#f43f5e`)
  - Warnings / Near Buffer Floor: Amber (`#f59e0b`)
  - Accent / Brand: Neutral zinc with emerald micro-glows.
- **Anti-Slop Discipline**: Zero gratuitous pills on static text. Clean typographic metadata with `·` separators. High-contrast forms with accessible labels and numeric inputs.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Reactive Storage (`localStorage`)**:
  - *Chosen Approach*: Persist all user wallet settings, custom transactions, recurring rules, and goals in browser `localStorage` with reactive hooks.
  - *Why*: Instant offline performance, complete user privacy (zero financial data transmitted to external servers), and no backend database setup friction.
  - *Fallback / Reset*: Provide an "Export Data", "Clear Wallet", and "Load Sample Data" option in Settings for quick testing.

- **Decision 2: Automated Salary Generation in 60-Day Forecast**:
  - *Chosen Approach*: If the user sets a monthly salary (e.g. PKR 200,000 on the 1st of every month), the forecast projection engine automatically inserts these recurring credits into the 60-day cash flow curve and updates the live balance whenever a payday passes.
  - *Why*: Eliminates the manual burden of recording regular salary credits each month while maintaining forward visibility into cash dips.

- **Decision 3: Complete Stripping of Bank Affiliations**:
  - *Chosen Approach*: Replace all "Allied Bank", "PK72", and bank account placeholders with "Personal Cash Wallet", "Liquid Reserves", and custom wallet labels.
  - *Why*: Directly aligns with the user's requested specification for a private, self-managed personal wallet.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MoneyLens Wallet Engine                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
               ┌────────────────────┴───────────────────┐
               ▼                                        ▼
   ┌───────────────────────┐               ┌─────────────────────────┐
   │  useFinanceData Hook  │               │   Onboarding / Modals   │
   │  - balance            │               │   - SetupWalletModal    │
   │  - monthlySalary      │◄──────────────┤   - AddIncomeModal      │
   │  - transactions[]     │               │   - AddExpenseModal     │
   │  - recurringBills[]   │               │   - EditSalaryModal     │
   │  - goals[]            │               └─────────────────────────┘
   └───────────┬───────────┘
               │
   ┌───────────┴────────────────────────────────────────┐
   ▼                                                    ▼
┌───────────────────────────────┐        ┌──────────────────────────────┐
│       Calculation Layer       │        │        AI / Simulator        │
│ - calculateMonthlyTotals()    │        │ - agentService (Live state)  │
│ - calculateCashflowForecast() │───────►│ - simulatePurchase()         │
│ - calculateFinancialHealth()  │        │ - generateInsights()         │
└───────────────────────────────┘        └──────────────────────────────┘
```

### Core Entities & State

```typescript
export interface UserWalletProfile {
  walletName: string;          // e.g. "Primary Personal Wallet"
  currency: string;            // 'PKR', 'USD', etc.
  initialBalance: number;      // Starting cash
  currentBalance: number;      // Real-time balance = initial + inflows - outflows
  monthlySalary: number;       // e.g. 250,000
  salaryPayday: number;        // Day of month (1-31)
  hasCompletedOnboarding: boolean;
}

export interface UserTransaction {
  id: string;
  date: string;                // YYYY-MM-DD
  title: string;               // e.g. "Monthly Salary", "Grocery Store"
  category: string;            // 'Salary', 'Groceries', 'Dining', etc.
  amount: number;
  type: 'income' | 'expense';
  isRecurring?: boolean;
}
```

### Components & Handlers To Implement

1. **`SetupWalletModal.tsx`**: First-time user onboarding modal prompting for initial balance, currency, salary, and reserve target.
2. **`AddIncomeModal.tsx`**: Fast modal to add funds with amount, source name, category, and date.
3. **`AddExpenseModal.tsx`**: Fast modal to record expenses with category icons, note, date, and "Repeat monthly" switch.
4. **`EditSalaryModal.tsx`**: Dedicated modal to update base monthly salary and payout day.
5. **Updated `DashboardView.tsx`**: Clean hero card showing "Available Cash Balance", quick-action buttons (`+ Add Income`, `- Add Expense`, `Salary Settings`), dynamic monthly summary, and forecast curve powered by user data.
6. **Updated `Navbar.tsx` & `LandingPageView.tsx`**: Pure personal wallet branding with no bank logos or institution names.
7. **Updated `agentService.ts`**: Grounded answers using the user's actual custom balance, entered salary, and recorded expenses.
