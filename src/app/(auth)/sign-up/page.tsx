import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-3xl rounded-lg border border-border bg-card p-6 shadow-sm">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Select a Plan</Label>
                <RadioGroup
                  name="subscription_plan"
                  defaultValue="free"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2"
                >
                  <div>
                    <RadioGroupItem
                      value="free"
                      id="free"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="free"
                      className="peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 flex flex-col h-full"
                    >
                      <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <CardTitle>Free</CardTitle>
                          <CardDescription>For casual users</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-2xl font-bold">
                            $0
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>15 prompts per day</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Basic prompt enhancement</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="basic"
                      id="basic"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="basic"
                      className="peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 flex flex-col h-full"
                    >
                      <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <CardTitle>Basic</CardTitle>
                          <CardDescription>For regular users</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-2xl font-bold">
                            $4.99
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>50 prompts per day</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Advanced prompt enhancement</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Save favorite prompts</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="standard"
                      id="standard"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="standard"
                      className="peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 flex flex-col h-full"
                    >
                      <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <CardTitle>Standard</CardTitle>
                          <CardDescription>For power users</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-2xl font-bold">
                            $9.99
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>30 prompts per day</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Premium prompt enhancement</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Prompt history & analytics</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>

                  <div>
                    <RadioGroupItem
                      value="professional"
                      id="professional"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="professional"
                      className="peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 flex flex-col h-full"
                    >
                      <Card className="h-full cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                          <CardTitle>Professional</CardTitle>
                          <CardDescription>For businesses</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-2xl font-bold">
                            $29.99
                            <span className="text-sm font-normal text-muted-foreground">
                              /month
                            </span>
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>150 prompts per day</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Enterprise prompt enhancement</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Team collaboration features</span>
                            </li>
                            <li className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span>Priority support</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full"
            >
              Sign up
            </SubmitButton>

            <FormMessage message={searchParams} />
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
