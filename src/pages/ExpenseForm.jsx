import { useState } from 'react'
import { supabase } from '../lib/supabase'

function ExpenseForm({ onExpenseAdded, onCancel }) {
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

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

    const { error: insertError } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        category,
        amount: Number(amount),
        payment_method: paymentMethod,
        expense_date: expenseDate,
        description,
      })

    if (insertError) {
      setError(insertError.message)
    } else {
      setCategory('')
      setAmount('')
      setPaymentMethod('')
      setExpenseDate('')
      setDescription('')

      if (onExpenseAdded) {
        onExpenseAdded()
      }
    }

    setLoading(false)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Add Expense
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Record a new expense.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Amount
          </label>

          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="500"
            min="0"
            step="0.01"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Payment Method
          </label>

          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Select payment method</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Date
          </label>

          <input
            type="date"
            value={expenseDate}
            onChange={(event) => setExpenseDate(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What was this expense for?"
            rows="3"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
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

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Expense'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  )
}

export default ExpenseForm