export interface Message {
  role: 'user' | 'assistant'
  content: string
  attachments?: Array<{ name: string; type: string }>
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="chat-container">
      <div className="test-badge">Test</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.role === 'assistant' && (
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-feedback">
                  <button className="feedback-btn" title="Good response">👍</button>
                  <button className="feedback-btn" title="Bad response">👎</button>
                </div>
              </div>
            )}
            {message.role === 'user' && (
              <div className="message-content user-content">
                {message.attachments && message.attachments.length > 0 && (
                  <div className="message-attachments">
                    {message.attachments.map((file, i) => (
                      <span key={i} className="attachment-badge">
                        📎 {file.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="message-text">
                  {message.content.split('\n\n[Attached')[0]}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="message-text loading">Thinking...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
