"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

interface PromptEnhancerProps {
  originalPrompt: string;
  onApply: (enhancedPrompt: string) => void;
  onCancel: () => void;
}

export default function PromptEnhancer({
  originalPrompt,
  onApply,
  onCancel,
}: PromptEnhancerProps) {
  const [role, setRole] = useState("default");
  const [tone, setTone] = useState(50); // 0-100 scale
  const [detailLevel, setDetailLevel] = useState(50); // 0-100 scale
  const [complexity, setComplexity] = useState(50); // 0-100 scale
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

  useEffect(() => {
    // Generate enhanced prompt based on settings
    enhancePrompt();
  }, [originalPrompt, role, tone, detailLevel, complexity]);

  const enhancePrompt = () => {
    // This is a simplified version of prompt enhancement
    // In a real implementation, this would be more sophisticated
    let prompt = originalPrompt;

    // Add role/persona
    if (role !== "default") {
      prompt = `As a ${roleOptions[role]}, ${prompt}`;
    }

    // Add tone
    if (tone < 33) {
      prompt = `${prompt}\n\nPlease respond in a concise and direct manner.`;
    } else if (tone > 66) {
      prompt = `${prompt}\n\nPlease respond in a friendly and conversational tone.`;
    } else {
      prompt = `${prompt}\n\nPlease respond in a balanced and professional tone.`;
    }

    // Add detail level
    if (detailLevel < 33) {
      prompt = `${prompt} Keep your response brief and to the point.`;
    } else if (detailLevel > 66) {
      prompt = `${prompt} Please provide a detailed and comprehensive response.`;
    } else {
      prompt = `${prompt} Provide a moderately detailed response.`;
    }

    // Add complexity
    if (complexity < 33) {
      prompt = `${prompt} Use simple language and avoid technical jargon.`;
    } else if (complexity > 66) {
      prompt = `${prompt} Feel free to use technical language and advanced concepts.`;
    } else {
      prompt = `${prompt} Use a mix of simple explanations and technical terms where appropriate.`;
    }

    setEnhancedPrompt(prompt);
  };

  const roleOptions: Record<string, string> = {
    default: "Default",
    expert: "Subject Matter Expert",
    teacher: "Teacher",
    researcher: "Academic Researcher",
    programmer: "Software Developer",
    writer: "Professional Writer",
    coach: "Coach/Mentor",
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <h3 className="font-semibold text-lg">Enhance Your Prompt</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="role">Role/Persona</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleOptions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="tone">Tone</Label>
            <span className="text-xs text-gray-500">
              {tone < 33 ? "Direct" : tone > 66 ? "Conversational" : "Balanced"}
            </span>
          </div>
          <Slider
            id="tone"
            value={[tone]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => setTone(values[0])}
            className="my-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="detail">Detail Level</Label>
            <span className="text-xs text-gray-500">
              {detailLevel < 33
                ? "Brief"
                : detailLevel > 66
                  ? "Detailed"
                  : "Moderate"}
            </span>
          </div>
          <Slider
            id="detail"
            value={[detailLevel]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => setDetailLevel(values[0])}
            className="my-2"
          />
        </div>

        <div>
          <div className="flex justify-between">
            <Label htmlFor="complexity">Language Complexity</Label>
            <span className="text-xs text-gray-500">
              {complexity < 33
                ? "Simple"
                : complexity > 66
                  ? "Advanced"
                  : "Moderate"}
            </span>
          </div>
          <Slider
            id="complexity"
            value={[complexity]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => setComplexity(values[0])}
            className="my-2"
          />
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded border text-sm">
        <p className="font-semibold mb-1">Enhanced Prompt:</p>
        <p className="whitespace-pre-wrap">{enhancedPrompt}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onApply(enhancedPrompt)}>Apply</Button>
      </div>
    </div>
  );
}
