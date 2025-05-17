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

          // Get current user data
          const { data: userData } = await supabase
            .from("users")
            .select("prompts_used, daily_prompts_used, last_prompt_date")
            .eq("id", user.id)
            .single();

          if (userData) {
            const today = new Date().toISOString().split("T")[0];
            const lastPromptDate =
              userData.last_prompt_date?.split("T")[0] || today;

            let dailyPromptsUsed = userData.daily_prompts_used || 0;
            if (lastPromptDate !== today) {
              // It's a new day, reset the counter
              dailyPromptsUsed = 0;
            }

            // Update both total and daily counts
            await supabase
              .from("users")
              .update({
                prompts_used: (userData.prompts_used || 0) + 1,
                daily_prompts_used: dailyPromptsUsed + 1,
                last_prompt_date: today,
              })
              .eq("id", user.id);

            // Save the prompt to history
            await supabase.from("saved_prompts").insert({
              user_id: user.id,
              prompt: userMessage,
              title:
                userMessage.substring(0, 50) +
                (userMessage.length > 50 ? "..." : ""),
              created_at: new Date().toISOString(),
            });
          }
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
                {
                  role: "system",
                  content:
                    "You are an expert-level prompt engineer tasked with transforming raw, vague, or incomplete user inputs into high-quality, effective prompts optimized for large language models.Your goal is to preserve the user's original intent while enhancing the prompt for clarity, precision, structure, and model interpretability. You must rewrite the prompt using advanced prompting strategies that improve outcomes across all domains (e.g., writing, coding, analysis, research, business, creative tasks).The enhanced prompt must follow this structure:1. **Instruction** – Clearly state the task or action the AI should perform (e.g., summarize, explain, generate code, write an email).2. **Context** – Provide relevant background, data, or the problem it operates on.3. **Role** – Optionally specify who the AI should act as (e.g., a software engineer, writing tutor, legal advisor).4. **Tone** – Indicate the desired tone or sentiment (e.g., formal, friendly, instructional, concise).5. **Output Format** – Define how the response should be structured (e.g., paragraph, bullet list, code block).6. **Constraints** – Include any additional requirements (e.g., length, audience, edge cases, style guides).Guidelines:- Maintain the original intent of the user.- Fill in any missing but implied elements to make the prompt complete.- Do not fabricate unrelated content.- Use clear, professional, and model-friendly phrasing.- Do not return explanations or markdown—only the final rewritten prompt as a plain string.Example1:User input: 'make this sound better'  → Enhanced: 'Rewrite the following message to sound more professional and polished.  **Role**: Email assistant **Tone**: Formal  **Content**: 'I finished the report. Let me know if you need anything else.Example2: User input: 'fix this code'→ Enhanced: 'Act as an experienced Python developer. Debug the following code, provide a corrected version in a code block, and explain the fix briefly. **Tone**: Educational and clear  **Constraints**: Ensure the code handles edge cases like empty inputs.  ```python  for i in range(5)print(i)  ```' Example3: User input: 'build an app to manage tasks' → Enhanced: 'You are a senior backend engineer. Design a task management backend application using a RESTful API architecture in Python.  **Context**: The API should support CRUD operations on tasks. Use in-memory data structures for storage.**Tone**: Clear and instructional  **Output Format**: Return the full implementation in a single Python script with clear code sections (e.g., # Routes, # Controllers).  **Constraints**: Include inline comments, docstrings, and test examples. Handle edge cases like invalid IDs and empty task lists. End with a suggestion on how the app could scale using a framework like Flask or FastAPI.'' ***Mandatory Output Requirement:  Respond only with the final rewritten prompt as a single plain-text sentence or paragraph. Do not include section labels (Instruction, Context, Role, etc.), markdown formatting, or code blocks. Only return the complete, enhanced prompt — nothing else.",
                },
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
          <div className="flex">
            <div className="flex-1 bg-white p-4 rounded-lg border shadow-sm">
              <PromptEnhancer
                originalPrompt={input}
                onApply={applyEnhancedPrompt}
                onCancel={() => setShowEnhancer(false)}
              />
            </div>
            <div className="w-64 ml-4 bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-sm font-medium mb-3">Global Settings</div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Output Format
                  </label>
                  <select className="w-full text-xs p-1 border rounded">
                    <option>Paragraph</option>
                    <option>Bullet Points</option>
                    <option>Numbered List</option>
                    <option>Table</option>
                    <option>Code Block</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Audience Level
                  </label>
                  <select className="w-full text-xs p-1 border rounded">
                    <option>General</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                    <option>Child (5th Grade)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Response Length
                  </label>
                  <select className="w-full text-xs p-1 border rounded">
                    <option>Default</option>
                    <option>Short (100 words)</option>
                    <option>Medium (300 words)</option>
                    <option>Long (500+ words)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center text-xs font-medium">
                    <input type="checkbox" className="mr-2" />
                    Include examples
                  </label>
                </div>
                <div>
                  <label className="flex items-center text-xs font-medium">
                    <input type="checkbox" className="mr-2" />
                    Include pros and cons
                  </label>
                </div>
              </div>
            </div>
          </div>
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
