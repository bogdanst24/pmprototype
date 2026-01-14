import type { Message } from '../components'

interface ChatResponse {
  content: string
}

export async function sendMessage(messages: Message[]): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get response from AI')
  }

  const data: ChatResponse = await response.json()
  return data.content
}
