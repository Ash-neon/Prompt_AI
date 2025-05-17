import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import ChatInterface from "@/components/chat-interface";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Sparkles,
  MessageSquare,
  Settings,
  Layers,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-2/3">
              <div className="rounded-lg shadow-xl w-full h-[600px]">
                <ChatInterface />
              </div>
            </div>
            <div className="lg:w-1/3">
              <h2 className="text-3xl font-bold mb-6">
                Intelligent Prompt Enhancement
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Our extension analyzes your input in real-time and transforms
                basic queries into structured, high-quality prompts following
                best practices in prompt engineering.
              </p>

              <div
                className="space-y-4 animate-fadeIn"
                style={{ animationDelay: "0.7s" }}
              >
                {[
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    title: "Real-time Analysis",
                    description: "Instantly analyzes your prompts as you type",
                  },
                  {
                    icon: <Layers className="w-5 h-5" />,
                    title: "Structured Format",
                    description:
                      "Organizes content into instruction/context/output/constraints",
                  },
                  {
                    icon: <Settings className="w-5 h-5" />,
                    title: "Customizable Options",
                    description: "Adjust tone, detail level, and complexity",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our extension provides everything you need to transform your
              ChatGPT experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Floating Interface",
                description: "Non-intrusive UI that appears when needed",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Smart Restructuring",
                description: "Transforms queries into expert prompts",
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "Customization Options",
                description: "Adjust to your specific needs",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "One-Click Apply",
                description: "Seamlessly replace your original text",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get better ChatGPT responses in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                number: "01",
                title: "Type Your Query",
                description:
                  "Start typing in the ChatGPT input field as you normally would.",
              },
              {
                number: "02",
                title: "Click Enhance",
                description:
                  "Click the floating button that appears to see your enhanced prompt.",
              },
              {
                number: "03",
                title: "Apply & Submit",
                description:
                  "Customize if needed, then apply the enhanced prompt with one click.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Enhance Your Prompts?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are getting better ChatGPT responses
            with our prompt enhancer.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
