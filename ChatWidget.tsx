import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FinancialContext {
  meal_plan_balance: number;
  dining_dollars: number;
  campus_card_balance: number;
  recent_spending?: Array<{
    description: string;
    amount: number;
  }>;
}

export function ChatWidget({ financialContext }: { financialContext: FinancialContext }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = 'https://7f5c848d-4fe1-4f88-b0e6-777bf0170334-00-3rl8p3kqh71ji.kirk.replit.dev';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/financial-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          financial_context: financialContext,
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: data.response 
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else if (data.error) {
        console.error('Error:', data.error);
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I could not connect to the server.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget" style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '350px',
      height: '500px',
      border: '1px solid #ccc',
      borderRadius: '12px',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#CC0033',
        color: 'white',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        fontWeight: 'bold'
      }}>
        💬 Financial Advisor
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
            Ask me anything about your spending!<br/>
            <span style={{ fontSize: '12px', color: '#999' }}>
              e.g., "Should I add more to my meal plan?" or "How much did I spend on coffee?"
            </span>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.role === 'user' ? '#CC0033' : '#f0f0f0',
              color: msg.role === 'user' ? 'white' : 'black',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '80%',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            {msg.content}
          </div>
        ))}
        
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: '#f0f0f0',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '14px'
          }}>
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about your spending..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#CC0033',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            opacity: loading || !input.trim() ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
