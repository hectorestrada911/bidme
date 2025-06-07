'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
}

interface MessagingUIProps {
  offerId?: string
  requestId?: string
  senderId: string
  receiverId: string
}

export default function MessagingUI({ offerId, requestId, senderId, receiverId }: MessagingUIProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line
  }, [offerId, requestId, senderId, receiverId])

  async function fetchMessages() {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (offerId) queryParams.append('offerId', offerId)
      if (requestId) queryParams.append('requestId', requestId)
      const res = await fetch(`/api/messages?${queryParams.toString()}`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          senderId,
          receiverId,
          offerId,
          requestId,
        }),
      })
      const data = await res.json()
      setMessages([...messages, data])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-96 border rounded-lg p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 mb-2 rounded-lg max-w-[80%] ${
                message.senderId === senderId
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-blue-900 text-blue-100'
              }`}
            >
              <p>{message.content}</p>
              <small className="text-gray-300">
                {new Date(message.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  )
} 