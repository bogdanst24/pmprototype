import { useState } from 'react'
import {
  Sidebar,
  ChatMessages,
  InputSection,
  SuggestionCards,
  ErrorBoundary,
  type Message,
  type AttachedFile,
} from './components'
import { sendMessage } from './services/chatApi'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [activeNav, setActiveNav] = useState('create')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  const hasConversation = messages.length > 0

  const handleStartNew = () => {
    setMessages([])
    setInputValue('')
    setAttachedFiles([])
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const buildMessageContent = (): string => {
    let messageContent = inputValue

    if (attachedFiles.length > 0) {
      const fileDescriptions = attachedFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          return `[Attached image: ${file.name}]`
        }
        return `[Attached file: ${file.name}]\n\`\`\`\n${file.content}\n\`\`\``
      }).join('\n\n')

      messageContent = messageContent
        ? `${messageContent}\n\n${fileDescriptions}`
        : fileDescriptions
    }

    return messageContent
  }

  const handleSubmit = async () => {
    if ((!inputValue.trim() && attachedFiles.length === 0) || isLoading) {
      return
    }

    const userMessage: Message = {
      role: 'user',
      content: buildMessageContent(),
      attachments: attachedFiles.map(f => ({ name: f.name, type: f.type }))
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setAttachedFiles([])
    setIsLoading(true)

    try {
      const responseContent = await sendMessage(newMessages)
      setMessages([...newMessages, { role: 'assistant', content: responseContent }])
    } catch (error) {
      console.error('Error:', error)
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="layout">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        <main className="main">
          <header className="page-header">
            <h1>Create presentation</h1>
            {hasConversation && (
              <button className="start-new-button" onClick={handleStartNew}>
                <span className="sparkle">✦</span> Start new
              </button>
            )}
          </header>

          <div className={`content ${hasConversation ? 'has-conversation' : ''}`}>
            {!hasConversation ? (
              <>
                <p className="subtitle">
                  <span className="sparkle">✦</span> What would you like to create today?
                </p>
                <h2 className="title">Alright Anton, tell me what you need</h2>
              </>
            ) : (
              <ChatMessages messages={messages} isLoading={isLoading} />
            )}

            <InputSection
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              attachedFiles={attachedFiles}
              onFilesChange={setAttachedFiles}
              hasConversation={hasConversation}
            />

            {!hasConversation && (
              <SuggestionCards onSelect={handleSuggestionClick} />
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
