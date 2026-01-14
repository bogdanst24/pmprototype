import { useRef, ChangeEvent, KeyboardEvent } from 'react'

export interface AttachedFile {
  name: string
  type: string
  size: number
  content: string
}

interface InputSectionProps {
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  attachedFiles: AttachedFile[]
  onFilesChange: (files: AttachedFile[]) => void
  hasConversation: boolean
}

const MAX_CHARS = 4000

const ACCEPTED_FILE_TYPES = '.txt,.md,.json,.csv,.xml,.html,.css,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.pdf,.doc,.docx,.pptx,.xlsx,image/*'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function readFileContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    if (file.type.startsWith('image/')) {
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      reader.onload = () => resolve(reader.result as string)
      reader.readAsText(file)
    }
  })
}

export function InputSection({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  attachedFiles,
  onFilesChange,
  hasConversation,
}: InputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const filePromises = files.map(async (file) => {
      const content = await readFileContent(file)
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        content,
      }
    })

    const newFiles = await Promise.all(filePromises)
    onFilesChange([...attachedFiles, ...newFiles])

    e.target.value = ''
  }

  const removeFile = (index: number) => {
    onFilesChange(attachedFiles.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const canSubmit = (inputValue.trim() || attachedFiles.length > 0) && !isLoading

  return (
    <div className="input-section">
      {attachedFiles.length > 0 && (
        <div className="attached-files">
          {attachedFiles.map((file, index) => (
            <div key={index} className="attached-file">
              <span className="file-icon">📎</span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatFileSize(file.size)}</span>
              <button
                className="file-remove"
                onClick={() => removeFile(index)}
                title="Remove file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="input-container">
        <textarea
          className="prompt-input"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder={hasConversation ? 'Type your message...' : ''}
          disabled={isLoading}
        />
        <div className="input-footer">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple
            accept={ACCEPTED_FILE_TYPES}
          />
          <button className="add-button" onClick={handleAddClick} title="Attach file">
            +
          </button>
          <div className="input-actions">
            <span className="char-count">{inputValue.length} / {MAX_CHARS}</span>
            <button
              className="submit-button"
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
