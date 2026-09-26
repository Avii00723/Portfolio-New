import { useState, useRef, useEffect } from 'react'
import '../chatbot.css'

// Replace this with your deployed Render URL, e.g.
// "https://your-service-name.onrender.com"
const API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8000'

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

// Very small markdown renderer: supports **bold** and bullet lists
// (lines starting with "*" or "-"). Escapes HTML first so streamed
// content from the API can never inject markup.
function renderMarkdown(text) {
    const escaped = escapeHtml(text)
    const lines = escaped.split('\n')

    let html = ''
    let inList = false

    for (const rawLine of lines) {
        const line = rawLine.trim()
        const isBullet = /^[*-]\s+/.test(line)

        if (isBullet) {
            if (!inList) {
                html += '<ul>'
                inList = true
            }
            const bulletText = line.replace(/^[*-]\s+/, '')
            html += `<li>${bulletText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`
        } else {
            if (inList) {
                html += '</ul>'
                inList = false
            }
            if (line) {
                html += `<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`
            }
        }
    }

    if (inList) html += '</ul>'
    return html
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hi! I'm Avinash's portfolio assistant. Ask me about his skills, experience, or projects." }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isOpen])

    async function sendMessage(e) {
        e.preventDefault()
        const question = input.trim()
        if (!question || isLoading) return

        setMessages((prev) => [...prev, { role: 'user', text: question }])
        setInput('')
        setIsLoading(true)

        // Add an empty bot message that we'll fill in as chunks arrive.
        setMessages((prev) => [...prev, { role: 'bot', text: '' }])

        try {
            const res = await fetch(`${API_URL}/api/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            })

            if (!res.ok || !res.body) {
                throw new Error(`Request failed with status ${res.status}`)
            }

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                // SSE messages are separated by a blank line ("\n\n")
                const parts = buffer.split('\n\n')
                buffer = parts.pop() // keep the last (possibly incomplete) chunk in the buffer

                for (const part of parts) {
                    const line = part.trim()
                    if (!line.startsWith('data:')) continue

                    const dataStr = line.slice(5).trim()
                    if (dataStr === '[DONE]') continue

                    try {
                        const { content } = JSON.parse(dataStr)
                        if (content) {
                            setMessages((prev) => {
                                const updated = [...prev]
                                updated[updated.length - 1] = {
                                    role: 'bot',
                                    text: updated[updated.length - 1].text + content,
                                }
                                return updated
                            })
                        }
                    } catch {
                        // Ignore malformed SSE chunks
                    }
                }
            }
        } catch (err) {
            setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                    role: 'bot',
                    text: "Sorry, I couldn't reach the server. Please try again in a moment.",
                }
                return updated
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <span>Portfolio Assistant</span>
                        <button
                            className="chatbot-close-btn"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => {
                            const isStreamingPlaceholder =
                                isLoading && msg.role === 'bot' && i === messages.length - 1 && msg.text === ''

                            if (isStreamingPlaceholder) {
                                return (
                                    <div key={i} className="chatbot-message chatbot-message-bot chatbot-typing">
                                        Thinking...
                                    </div>
                                )
                            }

                            if (msg.role === 'bot') {
                                return (
                                    <div
                                        key={i}
                                        className="chatbot-message chatbot-message-bot"
                                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                                    />
                                )
                            }

                            return (
                                <div key={i} className="chatbot-message chatbot-message-user">
                                    {msg.text}
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input-row" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about skills, projects..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            )}

            <button
                className="chatbot-toggle-btn"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '×' : '💬'}
            </button>
        </div>
    )
}