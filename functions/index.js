const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')

const openAiKey = defineSecret('OPENAI_API_KEY')

exports.chat = onRequest(
  { secrets: [openAiKey], cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request body' })
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey.value()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      })

      const data = await response.json()
      return res.status(200).json(data)
    } catch (err) {
      console.error('OpenAI error:', err)
      return res.status(500).json({ error: 'Failed to reach AI service' })
    }
  }
)
