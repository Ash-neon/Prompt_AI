import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Welcome to your prompt management dashboard</span>
            </div>
          </header>

          {/* User Profile & Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-medium">
                      {userData.name || userData.full_name || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userData.email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subscription Plan:</span>
                      <span className="font-medium capitalize">
                        {userData.subscription_plan}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Daily Prompt Limit:</span>
                      <span className="font-medium">
                        {userData.prompts_limit}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Prompt Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily Usage:</span>
                      <span>
                        {userData.daily_prompts_used} / {userData.prompts_limit}
                      </span>
                    </div>
                    <Progress
                      value={
                        (userData.daily_prompts_used / userData.prompts_limit) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Prompts Used:</span>
                      <span>{userData.prompts_used}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Saved Prompts:</span>
                      <span>{savedPrompts?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Management Section */}
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="recent">Recent Prompts</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="most-used">Most Used</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <History className="h-5 w-5" /> Recent Prompts
              </h2>

              {recentPrompts.length > 0 ? (
                <div className="grid gap-4">
                  {recentPrompts.map((prompt) => (
                    <Card key={prompt.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {prompt.title || "Untitled Prompt"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Used {prompt.use_count} times • Created{" "}
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{prompt.prompt}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent prompts found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Star className="h-5 w-5" /> Favorite Prompts
              </h2>

              {favoritePrompts.length > 0 ? (
                <div className="grid gap-4">
                  {favoritePrompts.map((prompt) => (
                    <Card key={prompt.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {prompt.title || "Untitled Prompt"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Used {prompt.use_count} times • Created{" "}
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{prompt.prompt}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No favorite prompts found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="most-used" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Most Used Prompts
              </h2>

              {mostUsedPrompts.length > 0 ? (
                <div className="grid gap-4">
                  {mostUsedPrompts.map((prompt) => (
                    <Card key={prompt.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {prompt.title || "Untitled Prompt"}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Used {prompt.use_count} times • Created{" "}
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{prompt.prompt}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No frequently used prompts found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" /> Account Settings
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and prompt limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium capitalize">
                            {userData.subscription_plan} Plan
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {userData.prompts_limit} prompts per day
                          </p>
                        </div>
                        <a
                          href="/pricing"
                          className="text-sm text-primary hover:underline"
                        >
                          Upgrade Plan
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
