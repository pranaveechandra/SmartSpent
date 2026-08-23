# SmartSpend

> A smart personal expense management platform for tracking spending, managing monthly budgets, visualizing financial patterns, and receiving AI-powered spending insights.

##  Overview

SmartSpend is a web-based personal finance application designed to make expense tracking simple and meaningful.

Instead of only recording transactions, SmartSpend turns expense data into useful information through:

- Expense tracking
- Monthly budget management
- Spending analytics
- Category-wise analysis
- Visual spending charts
- Monthly spending trends
- AI-powered spending insights
- Secure user authentication and user-specific data

The project is built using **React**, **Supabase**, **PostgreSQL**, and **Google Gemini AI**.

---

##  Problem Statement

Many people record expenses but do not have a clear understanding of where their money is going.

Traditional expense trackers often provide lists of transactions without helping users interpret their spending behavior.

SmartSpend addresses this problem by combining **expense management, budgeting, analytics, visualization, and AI-powered insights** in one application.

---

##  Our Solution

SmartSpend provides a centralized dashboard where users can:

1. Record their daily expenses.
2. View their total spending.
3. Monitor the number of transactions.
4. Calculate average spending per transaction.
5. Identify their highest-spending category.
6. Set a monthly spending budget.
7. Compare spending against the budget.
8. Analyze spending by category.
9. View spending through charts.
10. Track monthly spending trends.
11. Get personalized AI-powered spending insights.

This transforms raw financial records into actionable information.

---

##  Key Features

###  User Authentication

SmartSpend uses Supabase Authentication to provide user-based access.

Each authenticated user can access their own expenses and budgets.

###  Expense Tracking

Users can add expenses with information such as:

- Category
- Amount
- Payment method
- Expense date
- Description

Expenses are stored in Supabase and displayed in the dashboard.

###  Monthly Budget Management

Users can set a monthly budget for a selected month.

The budget system uses a unique combination of:

- User
- Month

This allows a user to maintain one budget for each month while updating an existing budget when required.

###  Dashboard Analytics

The dashboard provides useful financial metrics including:

- Total Spent
- Total Transactions
- Average Expense
- Top Spending Category

These metrics are calculated dynamically from the user's stored expenses.

### ️ Category Analysis

SmartSpend groups expenses by category and calculates:

- Total amount spent per category
- Percentage of overall spending
- Highest spending category

Progress bars make category comparisons easy to understand.

###  Expense Distribution Chart

A donut chart provides a visual breakdown of spending across different categories.

The chart is implemented using **Recharts**.

###  Monthly Spending Trend

SmartSpend analyzes expenses by month and displays a line chart showing how spending changes over time.

This helps users identify increases or decreases in spending.

###  AI Spending Insights

SmartSpend integrates Google Gemini through a Supabase Edge Function.

The AI feature is designed to provide spending insights based on the user's financial data.

The Gemini API key is kept server-side using Supabase secrets rather than exposing it in the frontend.

### ️ Secure Data Handling

Supabase is used for authentication and database storage.

Expenses are associated with the authenticated user's ID, allowing the application to retrieve the user's own expense records.

---

## ️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend development/build tooling |
| Tailwind CSS | Styling and responsive UI |
| Supabase | Authentication, database, and Edge Functions |
| PostgreSQL | Relational database |
| Recharts | Data visualization |
| Google Gemini AI | AI-powered spending insights |
| JavaScript | Application logic |

---

## ️ Architecture

The application follows a modern frontend + backend-service architecture.

```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │     SmartSpend      │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌────────────┐    ┌────────────┐    ┌──────────────┐
      │ Supabase   │    │ PostgreSQL │    │ Recharts     │
      │ Auth       │    │ Database   │    │ Visualization│
      └────────────┘    └────────────┘    └──────────────┘
                               │
                               ▼
                       ┌──────────────┐
                       │ Supabase     │
                       │ Edge Function│
                       └──────┬───────┘
                              │
                              ▼
                       ┌──────────────┐
                       │ Gemini AI    │
                       └──────────────┘
```

---

## ️ Database

The project uses Supabase's PostgreSQL database.

### Expenses

The expenses table stores user transactions and includes fields used by the dashboard such as:

- `id`
- `user_id`
- `category`
- `amount`
- `payment_method`
- `expense_date`
- `description`

Expenses are filtered using the authenticated user's ID.

### Budgets

The budgets table stores monthly budgets.

The structure includes:

- `id`
- `user_id`
- `month`
- `amount`
- `created_at`

A unique constraint on `user_id` and `month` ensures that each user has one budget record for a particular month.

---

##  AI Integration

The AI functionality is implemented through a Supabase Edge Function named:

```text
gemini-insights
```

The frontend communicates with the Edge Function instead of exposing the Gemini API key directly in the browser.

The Gemini API key is stored as a Supabase secret.

### AI Flow

```text
User
  ↓
SmartSpend Dashboard
  ↓
AI Insights Request
  ↓
Supabase Edge Function
  ↓
Gemini API
  ↓
Generated Spending Insight
  ↓
SmartSpend UI
```

This architecture helps keep sensitive API credentials away from frontend source code.

---

##  Project Structure

A typical project structure is:

```text
smartspend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── BudgetForm.jsx
│   │   └── AIInsights.jsx
│   │
│   ├── lib/
│   │   └── supabase.js
│   │
│   └── ...
│
├── supabase/
│   └── functions/
│       └── gemini-insights/
│           ├── index.ts
│           └── deno.json
│
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

> The exact structure can vary depending on the final local project organization.

---

##  Getting Started

### Prerequisites

Install the following before running SmartSpend:

- Node.js
- npm
- A Supabase project
- A Google Gemini API key

---

##  Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd smartspend
```

Install dependencies:

```bash
npm install
```

---

##  Environment Variables

Create a local `.env` file for frontend configuration.

Example:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Important Security Note

Never commit:

```text
.env
.env.local
```

to GitHub.

Never place the Gemini API key directly in frontend code.

The Gemini API key should be stored using Supabase secrets.

---

## ️ Supabase Setup

Create a Supabase project and configure:

1. Authentication
2. PostgreSQL database
3. `expenses` table
4. `budgets` table
5. Required Row Level Security policies
6. `gemini-insights` Edge Function

The application uses the authenticated user's ID to associate expenses and budgets with individual accounts.

---

##  Gemini Secret Setup

The Gemini API key should be configured as a Supabase secret.

Example:

```bash
supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Do not place the actual key inside this README or source-controlled files.

---

##  Running the Application

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, usually similar to:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

##  Main User Flow

```text
Register / Login
      ↓
Dashboard
      ↓
Add Expense
      ↓
Expense stored in Supabase
      ↓
Dashboard analytics update
      ↓
Set Monthly Budget
      ↓
Compare spending with budget
      ↓
View category + monthly charts
      ↓
Generate AI Spending Insights
```

---

##  User Experience

SmartSpend focuses on a clean and simple dashboard experience.

The interface provides:

- Clear financial summary cards
- Responsive layouts
- Easy expense entry
- Visual charts
- Category progress indicators
- Budget information
- AI insight cards
- Simple navigation

The goal is to make financial information understandable without requiring users to analyze spreadsheets manually.

---

##  Security Considerations

SmartSpend follows several security practices:

- Supabase Authentication for user access
- User-specific expense queries
- User-specific budget records
- API secrets stored server-side
- Gemini API key stored as a Supabase secret
- `.env` files excluded from Git
- `node_modules` excluded from Git

Sensitive credentials should never be committed to the repository.

---

##  What Makes SmartSpend Different?

SmartSpend is more than a basic expense tracker.

### Traditional Expense Tracker

```text
Record Expense → View Expense
```

### SmartSpend

```text
Record Expense
      ↓
Categorize Spending
      ↓
Analyze Spending
      ↓
Visualize Patterns
      ↓
Set Budget
      ↓
Monitor Budget
      ↓
Generate AI Insights
      ↓
Make Better Financial Decisions
```

The combination of **tracking + budgeting + analytics + visualization + AI** makes SmartSpend a more complete personal finance solution.

---

##  Future Enhancements

Potential future improvements include:

- AI-generated personalized saving recommendations
- Automatic recurring expense detection
- Expense editing and deletion
- Advanced date-range filtering
- Export reports to PDF/CSV
- Notifications for approaching budgets
- Budget recommendations based on historical spending
- More advanced financial forecasting
- Mobile/PWA support
- Multi-currency support
- Improved AI-driven financial goal planning

---

##  Hackathon Value

SmartSpend demonstrates how modern web technologies and AI can be combined to solve a practical everyday problem.

The project focuses on:

- Financial awareness
- Responsible spending
- Data-driven decision making
- Personalized insights
- Accessible financial management

Instead of simply telling users **how much they spent**, SmartSpend helps answer:

> **Where is my money going, how am I doing against my budget, and what can I improve?**

---

##  Project Status

**Status:** Completed and working prototype

Core implemented functionality includes:

- Authentication
- Expense management
- Monthly budgets
- Dashboard analytics
- Category analysis
- Expense distribution visualization
- Monthly spending trend
- AI spending insights
- Supabase Edge Function integration

---

##  Team

**Project:** SmartSpend

**Developed for:** Hackathon / Competition Submission

---

##  License

This project can be used for educational, demonstration, and hackathon purposes.

Add a specific open-source license here if your competition requires one.

---

##  Acknowledgements

- React
- Vite
- Tailwind CSS
- Supabase
- PostgreSQL
- Recharts
- Google Gemini
