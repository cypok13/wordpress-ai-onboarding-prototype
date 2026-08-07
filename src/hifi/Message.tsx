import { Button } from '@wordpress/components'
import { thumbsUp, thumbsDown, copy } from '@wordpress/icons'

// The single message renderer shared by every assistant surface (Clarify,
// Generating, Editor). A user message is the gray rounded bubble; an assistant
// message is left-aligned text with the thumbs-up/down/copy action row. Both
// stages render through THIS component so the thread reads as one conversation.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="hf-msg hf-msg--user">
      <p className="hf-msg__bubble">{children}</p>
    </div>
  )
}

export function AiMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="hf-msg hf-msg--ai">
      <p className="hf-msg__text">{children}</p>
      <div className="hf-msg__actions" aria-label="Message actions">
        <Button size="small" icon={thumbsUp} label="Helpful" />
        <Button size="small" icon={thumbsDown} label="Not helpful" />
        <Button size="small" icon={copy} label="Copy" />
      </div>
    </div>
  )
}
