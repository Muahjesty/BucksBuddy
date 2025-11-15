import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import aiAvatar from '@assets/generated_images/AI_assistant_avatar_icon_5bd9e75e.png';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your campus financial assistant. I can help you understand your spending patterns, suggest budget improvements, and answer questions about your campus wallet. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've analyzed your spending. You're doing great staying under budget in most categories! Consider reducing dining expenses by $20/week to reach your savings goal faster.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[500px]" data-testid="card-ai-chat">
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={aiAvatar} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Financial Assistant
          </p>
          <p className="text-xs text-muted-foreground">Always here to help</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            data-testid={`message-${message.role}`}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={aiAvatar} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about your spending..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            data-testid="input-ai-message"
          />
          <Button onClick={handleSend} size="icon" data-testid="button-send-message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
