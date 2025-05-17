import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, settings } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Get user's prompt usage
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("prompts_used, prompts_limit")
      .eq("id", user.id)
      .single();

    if (userError) {
      return NextResponse.json(
        { error: "Failed to get user data" },
        { status: 500 },
      );
    }

    if (userData.prompts_used >= userData.prompts_limit) {
      return NextResponse.json(
        { error: "Prompt limit reached" },
        { status: 403 },
      );
    }

    // Enhance the prompt based on settings
    // This is a simplified version - in a real implementation, this would be more sophisticated
    let enhancedPrompt = prompt;

    if (settings?.role && settings.role !== "default") {
      enhancedPrompt = `As a ${settings.role}, ${enhancedPrompt}`;
    }

    if (settings?.tone) {
      if (settings.tone < 33) {
        enhancedPrompt = `${enhancedPrompt}\n\nPlease respond in a concise and direct manner.`;
      } else if (settings.tone > 66) {
        enhancedPrompt = `${enhancedPrompt}\n\nPlease respond in a friendly and conversational tone.`;
      } else {
        enhancedPrompt = `${enhancedPrompt}\n\nPlease respond in a balanced and professional tone.`;
      }
    }

    if (settings?.detailLevel) {
      if (settings.detailLevel < 33) {
        enhancedPrompt = `${enhancedPrompt} Keep your response brief and to the point.`;
      } else if (settings.detailLevel > 66) {
        enhancedPrompt = `${enhancedPrompt} Please provide a detailed and comprehensive response.`;
      } else {
        enhancedPrompt = `${enhancedPrompt} Provide a moderately detailed response.`;
      }
    }

    if (settings?.complexity) {
      if (settings.complexity < 33) {
        enhancedPrompt = `${enhancedPrompt} Use simple language and avoid technical jargon.`;
      } else if (settings.complexity > 66) {
        enhancedPrompt = `${enhancedPrompt} Feel free to use technical language and advanced concepts.`;
      } else {
        enhancedPrompt = `${enhancedPrompt} Use a mix of simple explanations and technical terms where appropriate.`;
      }
    }

    // Update user's prompt count
    const { error: updateError } = await supabase
      .from("users")
      .update({
        prompts_used: userData.prompts_used + 1,
        daily_prompts_used: dailyPromptsUsed + 1,
        last_prompt_date: today,
      })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update prompt count" },
        { status: 500 },
      );
    }

    // Save the prompt to the user's history
    try {
      await supabase.from("saved_prompts").insert({
        user_id: user.id,
        prompt: prompt,
        enhanced_prompt: enhancedPrompt,
        title: prompt.substring(0, 50) + (prompt.length > 50 ? "..." : ""),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      // Continue even if saving fails
    }

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
