import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import ChatInterface from "@/components/chat-interface";

export default async function ChatPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Chat Interface</h1>
      <div className="h-[70vh]">
        <ChatInterface />
      </div>
    </div>
  );
}
