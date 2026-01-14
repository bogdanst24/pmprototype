import express from 'express'
import { AzureOpenAI } from 'openai'
import dotenv from 'dotenv'
import { createServer as createViteServer } from 'vite'

dotenv.config()

const app = express()
app.use(express.json())

// Azure OpenAI configuration
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
})

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4'

// System prompt for the presentation assistant
const systemPrompt = `You are a helpful presentation creation assistant. Your role is to help users create professional presentations. 

When a user asks for help, ask clarifying questions to understand:
- The type of presentation (sales, training, project update, etc.)
- The target audience
- Key topics or points to cover
- Desired tone (formal, casual, engaging)
- Any specific requirements

Be concise and helpful. Use bullet points when listing options or suggestions.`

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' })
    }

    const completion = await client.chat.completions.create({
      model: deploymentName,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content || 'No response generated'
    res.json({ content })
  } catch (error) {
    console.error('Azure OpenAI error:', error)
    res.status(500).json({ error: 'Failed to get response from AI' })
  }
})

// Development: Use Vite middleware
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })

  app.use(vite.middlewares)

  const port = process.env.PORT || 5173
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

startServer()
