const SUGGESTIONS = [
  'Create a Knowledge Sharing presentation',
  'Create an All Hands Meeting deck',
  'Create a Project Status presentation',
  'Create an Internal Training & Onboarding presentation',
]

interface SuggestionCardsProps {
  onSelect: (suggestion: string) => void
}

export function SuggestionCards({ onSelect }: SuggestionCardsProps) {
  return (
    <div className="suggestions">
      {SUGGESTIONS.map((suggestion, index) => (
        <button
          key={index}
          className="suggestion-card"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
