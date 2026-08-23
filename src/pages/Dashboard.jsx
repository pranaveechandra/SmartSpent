import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

import { supabase } from '../lib/supabase'
import ExpenseForm from './ExpenseForm'
import BudgetForm from '../components/BudgetForm'
import AIInsights from '../components/AIInsights'

function Dashboard() {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshExpenses, setRefreshExpenses] = useState(0)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
const [budget, setBudget] = useState(null)
const [budgetLoading, setBudgetLoading] = useState(true)

  // Load expenses from Supabase
  useEffect(() => {
    async function loadExpenses() {
      setLoading(true)
      setError('')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setExpenses(data || [])
      }

      setLoading(false)
    }

    loadExpenses()
  }, [refreshExpenses])

  // Load current month's budget
useEffect(() => {
  async function loadBudget() {
    setBudgetLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setBudgetLoading(false)
      return
    }

    const now = new Date()

    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-01`

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .maybeSingle()

    if (!error) {
      setBudget(data)
    }

    setBudgetLoading(false)
  }

  loadBudget()
}, [])

  // Total spending
  const totalSpent = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  )

  // Current month's spending
const currentMonth = new Date().toISOString().slice(0, 7)

const currentMonthExpenses = expenses.filter((expense) => {
  return expense.expense_date?.slice(0, 7) === currentMonth
})

const currentMonthSpent = currentMonthExpenses.reduce(
  (total, expense) => total + Number(expense.amount),
  0
)

// Budget calculations
const budgetAmount = budget ? Number(budget.amount) : 0

const budgetPercentage =
  budgetAmount > 0
    ? (currentMonthSpent / budgetAmount) * 100
    : 0

const budgetRemaining = budgetAmount - currentMonthSpent

let budgetStatus = 'No budget set'
let budgetStatusClass = 'text-gray-500'

if (budgetAmount > 0) {
  if (budgetPercentage > 100) {
    budgetStatus = 'Budget exceeded'
    budgetStatusClass = 'text-red-600'
  } else if (budgetPercentage >= 90) {
    budgetStatus = 'Almost at limit'
    budgetStatusClass = 'text-red-600'
  } else if (budgetPercentage >= 70) {
    budgetStatus = 'Watch your spending'
    budgetStatusClass = 'text-yellow-600'
  } else {
    budgetStatus = 'Healthy spending'
    budgetStatusClass = 'text-green-600'
  }
}

  // Average expense
  const averageExpense =
    expenses.length > 0 ? totalSpent / expenses.length : 0

  // Calculate spending by category
  const categoryTotals = expenses.reduce((categories, expense) => {
    const category = expense.category || 'Other'
    const amount = Number(expense.amount)

    categories[category] = (categories[category] || 0) + amount

    return categories
  }, {})

  // Convert category data into chart format
  const categoryData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  // Calculate monthly spending
  const monthlyTotals = expenses.reduce((months, expense) => {
    const date = new Date(expense.expense_date)

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`

    months[monthKey] =
      (months[monthKey] || 0) + Number(expense.amount)

    return months
  }, {})

  // Convert monthly data into chart format
  const monthlyData = Object.entries(monthlyTotals)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  // Find highest spending category
  let topCategory = 'No expenses'
  let topCategoryAmount = 0

  categoryData.forEach((item) => {
    if (item.amount > topCategoryAmount) {
      topCategory = item.category
      topCategoryAmount = item.amount
    }
  })

  // Chart colors
  const chartColors = [
    '#2563eb',
    '#16a34a',
    '#f59e0b',
    '#dc2626',
    '#9333ea',
    '#0891b2',
    '#ea580c',
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold text-blue-600">
            SmartSpend 💰
          </h1>

          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut()
            }}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back 👋
          </h2>

          <p className="mt-2 text-gray-600">
            Here's an overview of your spending.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total Spent */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Total Spent
              </p>

              <span className="text-2xl">
                💰
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              ₹{totalSpent.toFixed(2)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Across all expenses
            </p>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Transactions
              </p>

              <span className="text-2xl">
                🧾
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {expenses.length}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Total recorded expenses
            </p>
          </div>

          {/* Average Expense */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Average Expense
              </p>

              <span className="text-2xl">
                📊
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              ₹{averageExpense.toFixed(2)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Per transaction
            </p>
          </div>

          {/* Top Category */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                Top Category
              </p>

              <span className="text-2xl">
                🏆
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-gray-900">
              {topCategory}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {topCategoryAmount > 0
                ? `₹${topCategoryAmount.toFixed(2)} spent`
                : 'Add expenses to analyze'}
            </p>
          </div>

        </div>

        {/* Monthly Budget */}
<div className="rounded-2xl bg-white p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <p className="text-sm font-medium text-gray-500">
      Monthly Budget
    </p>

    <span className="text-2xl">
      🎯
    </span>
  </div>

  {budgetLoading ? (
    <p className="mt-3 text-gray-500">
      Loading...
    </p>
  ) : budget ? (
    <>
      <p className="mt-3 text-3xl font-bold text-gray-900">
        ₹{Number(budget.amount).toFixed(2)}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Current month's budget
      </p>
    </>
  ) : (
    <>
      <p className="mt-3 text-xl font-bold text-gray-900">
        No budget set
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Set a budget to start tracking.
      </p>
    </>
  )}

  <button
    type="button"
    onClick={() => setShowBudgetForm(true)}
    className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
  >
    {budget ? 'Update Budget' : 'Set Budget'}
  </button>
</div>

{/* Budget vs Spending */}
<div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-900">
      Budget Overview
    </h3>

    <p className="mt-1 text-sm text-gray-500">
      See how your current spending compares with your monthly budget.
    </p>
  </div>

  {!budget ? (
    <div className="rounded-xl bg-gray-50 p-8 text-center">
      <p className="text-gray-500">
        Set a monthly budget to start tracking your progress.
      </p>
    </div>
  ) : (
    <>
      <div className="grid gap-6 sm:grid-cols-3">

        {/* Budget */}
        <div>
          <p className="text-sm text-gray-500">
            Monthly Budget
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹{budgetAmount.toFixed(2)}
          </p>
        </div>

        {/* Spent */}
        <div>
          <p className="text-sm text-gray-500">
            Spent This Month
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            ₹{currentMonthSpent.toFixed(2)}
          </p>
        </div>

        {/* Remaining */}
        <div>
          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              budgetRemaining < 0
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            ₹{Math.abs(budgetRemaining).toFixed(2)}
          </p>
        </div>

      </div>

      {/* Progress */}
      <div className="mt-8">

        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Budget Used
          </span>

          <span className="text-sm font-semibold text-gray-900">
            {budgetPercentage.toFixed(1)}%
          </span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-100">

          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPercentage > 100
                ? 'bg-red-600'
                : budgetPercentage >= 70
                ? 'bg-yellow-500'
                : 'bg-green-600'
            }`}
            style={{
              width: `${Math.min(budgetPercentage, 100)}%`,
            }}
          />

        </div>

        <p className={`mt-3 text-sm font-medium ${budgetStatusClass}`}>
          {budgetStatus}
        </p>

      </div>
    </>
  )}

</div>

        {/* Category Analysis + Chart */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Category Progress Bars */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Spending by Category
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                See where most of your money is going.
              </p>
            </div>

            {categoryData.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-8 text-center">
                <p className="text-gray-500">
                  Add expenses to see your category analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-6">

                {categoryData.map((item) => (
                  <div key={item.category}>

                    <div className="mb-2 flex items-center justify-between">

                      <div>
                        <p className="font-medium text-gray-900">
                          {item.category}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.percentage.toFixed(1)}% of total spending
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        ₹{item.amount.toFixed(2)}
                      </p>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Donut Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Expense Distribution
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Visual breakdown of your spending.
              </p>
            </div>

            {categoryData.length === 0 ? (
              <div className="flex h-[350px] items-center justify-center rounded-xl bg-gray-50">
                <p className="text-gray-500">
                  Add expenses to see the chart.
                </p>
              </div>
            ) : (
              <div className="h-[350px]">

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >

                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.category}`}
                          fill={
                            chartColors[index % chartColors.length]
                          }
                        />
                      ))}

                    </Pie>

                    <Tooltip
                      formatter={(value) => [
                        `₹${Number(value).toFixed(2)}`,
                        'Spent',
                      ]}
                    />

                    <Legend />

                  </PieChart>
                </ResponsiveContainer>

              </div>
            )}

          </div>

        </div>

       {/* Monthly Spending Trend */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Monthly Spending Trend
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Track how your spending changes over time.
            </p>
          </div>

          {monthlyData.length === 0 ? (
            <div className="flex h-[350px] items-center justify-center rounded-xl bg-gray-50">
              <p className="text-gray-500">
                Add expenses to see your monthly spending trend.
              </p>
            </div>
          ) : (
            <div className="h-[350px]">

              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toFixed(2)}`,
                      'Spent',
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />

                </LineChart>
              </ResponsiveContainer>

            </div>
          )}

        </div>

        {/* Budget Section */}
<div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

  <div className="flex items-center justify-between">

    <div>
      <h3 className="text-xl font-semibold text-gray-900">
        Monthly Budget
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Set a spending limit for this month.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setShowBudgetForm(true)}
      className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
    >
      {budget ? 'Update Budget' : '+ Set Budget'}
    </button>

  </div>

  {showBudgetForm && (
    <div className="mt-6">
      <BudgetForm
        onBudgetSaved={(savedBudget) => {
          setBudget(savedBudget)
          setShowBudgetForm(false)
        }}
        onCancel={() => {
          setShowBudgetForm(false)
        }}
      />
    </div>
  )}

</div>


{/* AI Insights */}
<AIInsights
  expenses={expenses}
  
  budget={budget}
/>

        {/* Expenses Section */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Expenses
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Track and analyze your spending.
              </p>
            </div>

            <button
  type="button"
  onClick={() => setShowExpenseForm((current) => !current)}
  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
>
  {showExpenseForm ? 'Close' : '+ Add Expense'}
</button>

          </div>

          {/* Expense Form */}
          {showExpenseForm && (
            <div className="mt-6">

              <ExpenseForm
                onExpenseAdded={() => {
                  setShowExpenseForm(false)
                  setRefreshExpenses((value) => value + 1)
                }}
                onCancel={() => {
                  setShowExpenseForm(false)
                }}
              />

            </div>
          )}

          {/* Expenses */}
          <div className="mt-8">

            {/* Loading */}
            {loading && (
              <div className="rounded-xl bg-gray-50 p-10 text-center">
                <p className="text-gray-500">
                  Loading expenses...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-xl bg-red-50 p-5 text-center">
                <p className="text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* No Expenses */}
            {!loading && !error && expenses.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">

                <p className="text-gray-500">
                  No expenses yet.
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Add your first expense to get started.
                </p>

              </div>
            )}

            {/* Expense Table */}
            {!loading && !error && expenses.length > 0 && (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">

                      <th className="px-4 py-3">
                        Category
                      </th>

                      <th className="px-4 py-3">
                        Amount
                      </th>

                      <th className="px-4 py-3">
                        Payment
                      </th>

                      <th className="px-4 py-3">
                        Date
                      </th>

                      <th className="px-4 py-3">
                        Description
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b last:border-b-0"
                      >

                        <td className="px-4 py-4 font-medium text-gray-900">
                          {expense.category}
                        </td>

                        <td className="px-4 py-4 font-semibold text-gray-900">
                          ₹{Number(expense.amount).toFixed(2)}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {expense.payment_method}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {expense.expense_date}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {expense.description || '-'}
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard