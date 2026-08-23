// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    })
  }

  try {
    const { expenses, budget } = await req.json()

    if (!expenses || expenses.length === 0) {
      return new Response(
        JSON.stringify({
          insight: "Add some expenses so I can analyze your spending.",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY")

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.")
    }

    const categoryTotals: Record<string, number> = {}

    for (const expense of expenses) {
      const category = expense.category || "Other"
      const amount = Number(expense.amount) || 0

      categoryTotals[category] =
        (categoryTotals[category] || 0) + amount
    }

    const totalSpent = expenses.reduce(
      (total: number, expense: any) =>
        total + (Number(expense.amount) || 0),
      0
    )

    const prompt = `
You are SmartSpend, a personal finance assistant.

Analyze the following user's spending data.

Total spent: ₹${totalSpent.toFixed(2)}

Monthly budget:
${budget ? `₹${Number(budget.amount).toFixed(2)}` : "No budget set"}

Spending by category:
${JSON.stringify(categoryTotals, null, 2)}

Number of transactions: ${expenses.length}

Give the user a short, useful financial analysis.

Return:
1. One spending insight
2. One warning if spending looks high
3. One practical saving suggestion

Keep the response concise, friendly and easy to understand.
Do not give investment advice.
`

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    })

    const result = await model.generateContent(prompt)

    const insight = result.response.text()

    return new Response(
      JSON.stringify({
        insight,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error
          ? error.message
          : "Something went wrong.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})