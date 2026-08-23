import { useState } from 'react'
import { supabase } from '../lib/supabase'

function AIInsights({ expenses, budget }) {
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generateInsights() {
    if (!expenses || expenses.length === 0) {
      setError('Add some expenses first.')
      return
    }

    setLoading(true)
    setError('')
    setInsight('')

    try {
      const { data, error: functionError } =
        await supabase.functions.invoke('gemini-insights', {
          body: {
            expenses,
            budget,
          },
        })

      if (functionError) {
        throw functionError
      }

      if (data?.error) {
        throw new Error(data.error)
      }

      setInsight(data?.insight || 'No insight was generated.')
    } catch (err) {
      console.error(err)
      setError('Unable to generate AI insights right now.')
    } finally {
      setLoading(false)
    }
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900">
          🤖 AI Spending Insights
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Add some expenses to receive personalized AI spending insights.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          🤖 AI Spending Insights
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Get personalized analysis of your spending using AI.
        </p>
      </div>

      <div className="rounded-xl bg-blue-50 p-5">

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-blue-900">
              SmartSpend AI
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Analyze your {expenses.length} transactions and spending
              pattern.
            </p>
          </div>

          <button
            type="button"
            onClick={generateInsights}
            disabled={loading}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : '✨ Analyze'}
          </button>
        </div>

      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {insight && (
        <div className="mt-4 rounded-xl bg-gray-50 p-5">
          <p className="mb-2 font-medium text-gray-900">
            💡 Your AI Insight
          </p>

          <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
            {insight}
          </p>
        </div>
      )}

    </div>
  )
}

export default AIInsights