import { useState, FormEvent } from 'react';

interface Message {
  id: string;
  content: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [offerId, setOfferId] = useState('');
  const [requestId, setRequestId] = useState('');

  const fetchMessages = async () => {
    const queryParams = new URLSearchParams();
    if (offerId) queryParams.append('offerId', offerId);
    if (requestId) queryParams.append('requestId', requestId);
    const response = await fetch(`/api/messages?${queryParams.toString()}`);
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, senderId, receiverId, offerId, requestId }),
    });
    const data = await response.json();
    console.log('Message sent:', data);
    setContent('');
  };

  return (
    <div>
      <h1>Messages</h1>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Message content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Offer ID (optional)"
          value={offerId}
          onChange={(e) => setOfferId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Request ID (optional)"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />
        <button type="submit">Send Message</button>
      </form>
      <button onClick={fetchMessages}>Fetch Messages</button>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.content}</li>
        ))}
      </ul>
    </div>
  );
} 