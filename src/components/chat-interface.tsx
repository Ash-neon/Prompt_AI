"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { MessageSquare, Send, Settings } from "lucide-react";
import PromptEnhancer from "./prompt-enhancer";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [promptsLimit, setPromptsLimit] = useState(5);
  const [showEnhancer, setShowEnhancer] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchUserPromptData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("prompts_used, prompts_limit")
          .eq("id", user.id)
          .single();

        if (data) {
          setPromptsUsed(data.prompts_used || 0);
          setPromptsLimit(data.prompts_limit || 5);
        }
      }
    };

    fetchUserPromptData();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() && !enhancedPrompt.trim()) return;

    const userMessage = enhancedPrompt.trim() || input.trim();

    // Check if user has reached prompt limit
    if (promptsUsed >= promptsLimit) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        {
          role: "assistant",
          content:
            "You've reached your prompt limit. Please upgrade your plan to continue using the chat.",
        },
      ]);
      setInput("");
      setEnhancedPrompt("");
      setShowEnhancer(false);
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setEnhancedPrompt("");
    setShowEnhancer(false);

    try {
      // Call Together AI API
      try {
        // Update prompts used count
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const newPromptsUsed = promptsUsed + 1;
          setPromptsUsed(newPromptsUsed);

          await supabase
            .from("users")
            .update({ prompts_used: newPromptsUsed })
            .eq("id", user.id);
        }

        // Call Together AI API
        const response = await fetch(
          "https://api.together.xyz/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_API_KEY || ""}`,
            },
            body: JSON.stringify({
              model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
              messages: [
                ...messages.map((msg) => ({
                  role: msg.role,
                  content: msg.content,
                })),
                { role: "user", content: userMessage },
              ],
              max_tokens: 1024,
            }),
          },
        );

        const data = await response.json();

        // Add assistant response
        if (data.choices && data.choices[0]) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.choices[0].message.content,
            },
          ]);
        } else {
          throw new Error("Invalid response from API");
        }

        setLoading(false);
      } catch (apiError) {
        console.error("Error calling Together AI API:", apiError);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, there was an error processing your request with the AI model.",
          },
        ]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
      setLoading(false);
    }
  };

  const handleEnhancePrompt = () => {
    if (!input.trim()) return;
    setShowEnhancer(true);
  };

  const applyEnhancedPrompt = (prompt: string) => {
    setEnhancedPrompt(prompt);
    setShowEnhancer(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold">Chat Interface</h2>
        </div>
        <div className="text-sm text-gray-600">
          Prompts: {promptsUsed}/{promptsLimit}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="w-12 h-12 mb-2" />
            <p>Start a conversation</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`p-3 max-w-[80%] ${message.role === "user" ? "bg-green-50" : "bg-gray-50"}`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </Card>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <Card className="p-3 bg-gray-50">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {showEnhancer && (
        <div className="border-t p-4 bg-gray-50">
          <PromptEnhancer
            originalPrompt={input}
            onApply={applyEnhancedPrompt}
            onCancel={() => setShowEnhancer(false)}
          />
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={enhancedPrompt || input}
            onChange={(e) => {
              if (enhancedPrompt) {
                setEnhancedPrompt(e.target.value);
              } else {
                setInput(e.target.value);
              }
            }}
            placeholder="Type your message here..."
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleEnhancePrompt}
              variant="outline"
              size="icon"
              disabled={!input.trim() || enhancedPrompt.trim() || loading}
              title="Enhance prompt"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={(!input.trim() && !enhancedPrompt.trim()) || loading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {promptsUsed >= promptsLimit && (
          <p className="mt-2 text-sm text-red-500">
            You've reached your prompt limit. Please upgrade your plan to
            continue.
          </p>
        )}
      </div>
    </div>
  );
}
