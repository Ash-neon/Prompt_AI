"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Check, Edit, Plus, Minus, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface PromptEnhancerProps {
  originalPrompt: string;
  onApply: (enhancedPrompt: string) => void;
  onCancel: () => void;
}

interface EnhancedPromptDisplayProps {
  prompt: string;
  role: string;
  tone: number;
  detailLevel: number;
  complexity: number;
  onUpdatePrompt: (prompt: string) => void;
}

function EnhancedPromptDisplay({
  prompt,
  role,
  tone,
  detailLevel,
  complexity,
  onUpdatePrompt,
}: EnhancedPromptDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);

  useEffect(() => {
    setEditedPrompt(prompt);
  }, [prompt]);

  // Extract different parts of the prompt for highlighting
  const getRolePart = () => {
    if (role === "default") return null;
    return `As a ${roleOptions[role]}`;
  };

  const getTonePart = () => {
    if (tone < 33) {
      return "Please respond in a concise and direct manner.";
    } else if (tone > 66) {
      return "Please respond in a friendly and conversational tone.";
    } else {
      return "Please respond in a balanced and professional tone.";
    }
  };

  const getDetailPart = () => {
    if (detailLevel < 33) {
      return "Keep your response brief and to the point.";
    } else if (detailLevel > 66) {
      return "Please provide a detailed and comprehensive response.";
    } else {
      return "Provide a moderately detailed response.";
    }
  };

  const getComplexityPart = () => {
    if (complexity < 33) {
      return "Use simple language and avoid technical jargon.";
    } else if (complexity > 66) {
      return "Feel free to use technical language and advanced concepts.";
    } else {
      return "Use a mix of simple explanations and technical terms where appropriate.";
    }
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

  const toneOptions = {
    direct: "concise and direct",
    balanced: "balanced and professional",
    friendly: "friendly and conversational",
  };

  const detailOptions = {
    brief: "brief and to the point",
    moderate: "moderately detailed",
    detailed: "detailed and comprehensive",
  };

  const complexityOptions = {
    simple: "simple language without jargon",
    moderate: "mix of simple explanations and technical terms",
    advanced: "technical language and advanced concepts",
  };

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          className="w-full h-32 p-2 border rounded text-sm"
        />
        <div className="flex justify-end mt-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onUpdatePrompt(editedPrompt);
              setIsEditing(false);
            }}
          >
            <Check className="w-4 h-4 mr-1" /> Apply
          </Button>
        </div>
      </div>
    );
  }

  const rolePart = getRolePart();
  const basePrompt = rolePart ? prompt.substring(rolePart.length + 2) : prompt;
  const tonePart = getTonePart();
  const detailPart = getDetailPart();
  const complexityPart = getComplexityPart();

  const handleSpanClick = (id: string, event: React.MouseEvent) => {
    const spanElement = spanRefs.current[id];
    if (spanElement) {
      const rect = spanElement.getBoundingClientRect();
      setSuggestionPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setActiveSuggestion(id);
      event.stopPropagation();
    }
  };

  // Close suggestion box when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveSuggestion(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Process the prompt to wrap segments in interactive spans
  const processPrompt = () => {
    if (!prompt) return [];

    const segments = [];
    let currentIndex = 0;

    // Process role part if exists
    if (rolePart) {
      const roleId = "role-part";
      segments.push(
        <span
          key={roleId}
          ref={(el) => (spanRefs.current[roleId] = el)}
          className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded cursor-pointer hover:bg-blue-200"
          onClick={(e) => handleSpanClick(roleId, e)}
          data-type="role"
          data-original={rolePart}
        >
          {rolePart}
        </span>,
      );
      currentIndex = rolePart.length;
      segments.push(<span key="comma">, </span>);
    }

    // Process main prompt content
    const mainContent = rolePart ? basePrompt : prompt;
    segments.push(<span key="main-content">{mainContent}</span>);

    // Process tone part
    const toneId = "tone-part";
    if (tonePart) {
      segments.push(
        <span
          key={toneId}
          ref={(el) => (spanRefs.current[toneId] = el)}
          className="bg-green-100 text-green-800 px-1 py-0.5 rounded cursor-pointer hover:bg-green-200 ml-1"
          onClick={(e) => handleSpanClick(toneId, e)}
          data-type="tone"
          data-original={tonePart}
        >
          {tonePart}
        </span>,
      );
    }

    // Process detail part
    const detailId = "detail-part";
    if (detailPart) {
      segments.push(
        <span
          key={detailId}
          ref={(el) => (spanRefs.current[detailId] = el)}
          className="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded cursor-pointer hover:bg-yellow-200 ml-1"
          onClick={(e) => handleSpanClick(detailId, e)}
          data-type="detail"
          data-original={detailPart}
        >
          {detailPart}
        </span>,
      );
    }

    // Process complexity part
    const complexityId = "complexity-part";
    if (complexityPart) {
      segments.push(
        <span
          key={complexityId}
          ref={(el) => (spanRefs.current[complexityId] = el)}
          className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded cursor-pointer hover:bg-purple-200 ml-1"
          onClick={(e) => handleSpanClick(complexityId, e)}
          data-type="complexity"
          data-original={complexityPart}
        >
          {complexityPart}
        </span>,
      );
    }

    return segments;
  };

  // Render suggestion box based on active suggestion
  const renderSuggestionBox = () => {
    if (!activeSuggestion) return null;

    let options: { label: string; value: string }[] = [];
    let title = "";

    switch (activeSuggestion) {
      case "role-part":
        title = "Change Role";
        options = Object.entries(roleOptions).map(([key, value]) => ({
          label: value,
          value: `As a ${value}`,
        }));
        break;
      case "tone-part":
        title = "Adjust Tone";
        options = [
          {
            label: "Direct",
            value: "Please respond in a concise and direct manner.",
          },
          {
            label: "Balanced",
            value: "Please respond in a balanced and professional tone.",
          },
          {
            label: "Conversational",
            value: "Please respond in a friendly and conversational tone.",
          },
        ];
        break;
      case "detail-part":
        title = "Adjust Detail Level";
        options = [
          {
            label: "Brief",
            value: "Keep your response brief and to the point.",
          },
          {
            label: "Moderate",
            value: "Provide a moderately detailed response.",
          },
          {
            label: "Detailed",
            value: "Please provide a detailed and comprehensive response.",
          },
        ];
        break;
      case "complexity-part":
        title = "Adjust Complexity";
        options = [
          {
            label: "Simple",
            value: "Use simple language and avoid technical jargon.",
          },
          {
            label: "Moderate",
            value:
              "Use a mix of simple explanations and technical terms where appropriate.",
          },
          {
            label: "Advanced",
            value: "Feel free to use technical language and advanced concepts.",
          },
        ];
        break;
    }

    return (
      <div
        className="absolute z-50 bg-white border rounded-md shadow-lg p-2 w-64"
        style={{
          top: suggestionPosition.top + 5,
          left: suggestionPosition.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-medium text-sm mb-2">{title}</div>
        <div className="space-y-1">
          {options.map((option, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left text-xs"
              onClick={() => {
                let newPrompt = prompt;
                const spanElement = spanRefs.current[activeSuggestion];
                if (spanElement) {
                  const originalText =
                    spanElement.getAttribute("data-original") || "";
                  newPrompt = newPrompt.replace(originalText, option.value);
                  onUpdatePrompt(newPrompt);
                  setActiveSuggestion(null);
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="relative" onClick={() => setActiveSuggestion(null)}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Edit className="w-3 h-3" />
        </Button>

        <div className="space-y-2">
          <div className="prompt-container relative">
            {processPrompt()}
            {renderSuggestionBox()}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                >
                  <span>🔄 Tone:</span>
                  <span className="font-medium">
                    {tone < 33
                      ? "Direct"
                      : tone > 66
                        ? "Conversational"
                        : "Balanced"}
                  </span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        tonePart,
                        "Please respond in a concise and direct manner.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Direct
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        tonePart,
                        "Please respond in a balanced and professional tone.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Balanced
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        tonePart,
                        "Please respond in a friendly and conversational tone.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Conversational
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                >
                  <span>🔧 Detail:</span>
                  <span className="font-medium">
                    {detailLevel < 33
                      ? "Brief"
                      : detailLevel > 66
                        ? "Detailed"
                        : "Moderate"}
                  </span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        detailPart,
                        "Keep your response brief and to the point.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Brief
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        detailPart,
                        "Provide a moderately detailed response.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Moderate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        detailPart,
                        "Please provide a detailed and comprehensive response.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Detailed
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                >
                  <span>🖊 Complexity:</span>
                  <span className="font-medium">
                    {complexity < 33
                      ? "Simple"
                      : complexity > 66
                        ? "Advanced"
                        : "Moderate"}
                  </span>
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        complexityPart,
                        "Use simple language and avoid technical jargon.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Simple
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        complexityPart,
                        "Use a mix of simple explanations and technical terms where appropriate.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Moderate
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      let newPrompt = prompt.replace(
                        complexityPart,
                        "Feel free to use technical language and advanced concepts.",
                      );
                      onUpdatePrompt(newPrompt);
                    }}
                  >
                    Advanced
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Constraint
                </Badge>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      onUpdatePrompt(
                        `${prompt} Limit your response to 100 words or less.`,
                      );
                    }}
                  >
                    Word Limit (100)
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      onUpdatePrompt(
                        `${prompt} Use examples to illustrate key points.`,
                      );
                    }}
                  >
                    Include Examples
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      onUpdatePrompt(
                        `${prompt} Explain as if speaking to a 5th grader.`,
                      );
                    }}
                  >
                    5th Grade Level
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      onUpdatePrompt(
                        `${prompt} Include pros and cons in your response.`,
                      );
                    }}
                  >
                    Pros and Cons
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
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
        <div className="whitespace-pre-wrap relative">
          <EnhancedPromptDisplay
            prompt={enhancedPrompt}
            role={role}
            tone={tone}
            detailLevel={detailLevel}
            complexity={complexity}
            onUpdatePrompt={setEnhancedPrompt}
          />
        </div>
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
