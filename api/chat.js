const SYSTEM_PROMPT = `You are the AI assistant for WVH Developments Ltd, a UK-based premium tech agency. Be warm, confident and concise. Never use bullet points or dashes in your replies.

SERVICES:
Website Development and Hosting (with or without payment systems)
App Development and Hosting (mobile and web, with or without payment systems)
Social Media Management and Growth
AI Chatbots (website and in-app)
WhatsApp Automation (lead qualification, FAQ handling, full automation)
AI Phone Assistant (24/7 call handling, lead qualification)
Custom Backend Systems (booking, payments, admin dashboards, databases)
Full Tech Management, one monthly retainer covers everything

PACKAGES:
Single services are available individually.
Full Stack Retainer: everything above, fully managed monthly. Most popular option.
All pricing is bespoke.

KEY FACTS:
Setup typically takes 2 to 3 weeks.
No long-term contracts, cancel with 30 days notice.
No technical knowledge required from the client.
One point of contact. Will handles everything personally.
AI phone assistant works with a Twilio number. If clients want it to only handle missed calls, they set up conditional call forwarding on their existing phone so unanswered calls route to the AI. Simple to set up on any UK network.

CONTACT: will@wvhdevelopments.com

IMPORTANT BEHAVIOR: After answering any question, always end with a natural, friendly nudge to get in touch. For example: "The best next step is to drop Will an email at will@wvhdevelopments.com — he will get back to you quickly." or "Feel free to email will@wvhdevelopments.com for a tailored quote." Vary the phrasing but always include the email address. If someone asks for pricing or seems ready to move forward, be more direct about it. Your goal is to answer their question AND get them to make contact.`

// Simple in-memory rate limiter — resets on cold starts, good enough for abuse deterrence
const rateMap = new Map()
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 60_000

function isRateLimited(ip) {
  const now = Date.now()
  let record = rateMap.get(ip)
  if (!record || now > record.reset) {
    record = { count: 0, reset: now + RATE_WINDOW_MS }
  }
  record.count++
  rateMap.set(ip, record)
  return record.count > RATE_LIMIT
}

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || '*')
  .split(',')
  .map(o => o.trim())

export default async function handler(req, res) {
  const requestOrigin = req.headers.origin || ''
  const allowedOrigin =
    ALLOWED_ORIGINS.includes('*')
      ? '*'
      : ALLOWED_ORIGINS.includes(requestOrigin)
        ? requestOrigin
        : ALLOWED_ORIGINS[0]

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Chat-Token')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Token check — skipped only when CHAT_TOKEN is not set (local dev without the var)
  const expectedToken = process.env.CHAT_TOKEN
  if (expectedToken) {
    const provided = req.headers['x-chat-token']
    if (provided !== expectedToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }

  // Rate limit by IP
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Service temporarily unavailable.' })
  }

  const { messages: rawMessages } = req.body
  if (!Array.isArray(rawMessages)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  // Strip any system-role messages from the client, cap count and length
  const messages = rawMessages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-20)
    .map(m => ({
      role: m.role,
      content: String(m.content).slice(0, 1000),
    }))

  // Prepend system prompt server-side — client never controls this
  const fullMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages: fullMessages, max_tokens: 500, temperature: 0.7 })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI error:', data)
      return res.status(200).json({ error: 'The AI service is temporarily unavailable. Please try again shortly.' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('OpenAI proxy error:', err)
    return res.status(500).json({ error: 'Failed to reach AI service.' })
  }
}
