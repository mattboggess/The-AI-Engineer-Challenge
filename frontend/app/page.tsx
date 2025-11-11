'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [developerMessage, setDeveloperMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [model, setModel] = useState('gpt-4.1-mini');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<string>('');

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    setError(null);
    setIsLoading(true);
    responseRef.current = '';

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Add placeholder for assistant response
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      // Determine API URL - use environment variable or default to localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage || 'You are a helpful assistant.',
          user_message: userMessage,
          model: model,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to get response from API');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        responseRef.current += chunk;

        // Update the last message (assistant response) with accumulated content
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: responseRef.current,
          };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Remove the placeholder assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setUserMessage('');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>OpenAI Chat Interface</h1>
          <p className={styles.subtitle}>Streaming chat powered by OpenAI API</p>
        </header>

        <div className={styles.settings}>
          <div className={styles.settingGroup}>
            <label htmlFor="model" className={styles.label}>
              Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={styles.select}
            >
              <option value="gpt-4.1-mini">gpt-4.1-mini</option>
              <option value="gpt-4">gpt-4</option>
              <option value="gpt-4-turbo">gpt-4-turbo</option>
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label htmlFor="developer-message" className={styles.label}>
              System/Developer Message (Optional)
            </label>
            <textarea
              id="developer-message"
              value={developerMessage}
              onChange={(e) => setDeveloperMessage(e.target.value)}
              placeholder="You are a helpful assistant."
              className={styles.textarea}
              rows={3}
            />
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h2>Chat</h2>
            {messages.length > 0 && (
              <button onClick={handleClearChat} className={styles.buttonSecondary}>
                Clear Chat
              </button>
            )}
          </div>
          <div className={styles.messages}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  <div className={styles.messageRole}>
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className={styles.messageContent}>
                    {message.content || (isLoading && index === messages.length - 1 ? '...' : '')}
                  </div>
                </div>
              ))
            )}
            {isLoading && messages.length > 0 && (
              <div className={styles.loading}>Streaming response...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            className={styles.chatInput}
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userMessage.trim()}
            className={styles.sendButton}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}

