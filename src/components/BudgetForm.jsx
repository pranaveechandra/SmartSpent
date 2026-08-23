import { useState } from 'react'
import { supabase } from '../lib/supabase'

function BudgetForm({ onBudgetSaved, onCancel }) {
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState(() => {
    const today = new Date()

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-01`
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setSuccess('')

    const budgetAmount = Number(amount)

    if (!budgetAmount || budgetAmount <= 0) {
      setError('Please enter a valid budget amount.')
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

   const { data: savedBudget, error: saveError } = await supabase
  .from('budgets')
  .upsert(
    {
      user_id: user.id,
      month,
      amount: budgetAmount,
    },
    {
      onConflict: 'user_id,month',
    }
  )
  .select()
  .single()

    if (saveError) {
      setError(saveError.message)
    } else {
      setSuccess('Monthly budget saved successfully! 🎉')

      setAmount('')

      if (onBudgetSaved) {
  onBudgetSaved(savedBudget)
}
    }

    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Set Monthly Budget
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Set a spending limit for a specific month.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Budget Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Monthly Budget
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>

            <input
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="20000"
              min="1"
              step="0.01"
              required
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-9 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Month */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Budget Month
          </label>

          <input
            type="month"
            value={month.slice(0, 7)}
            onChange={(event) => {
              const selectedMonth = event.target.value

              setMonth(`${selectedMonth}-01`)
            }}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-sm text-green-600">
              {success}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Budget'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

        </div>

      </form>
    </div>
  )
}

export default BudgetForm