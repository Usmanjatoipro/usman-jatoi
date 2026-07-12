import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const searchSchema = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — Usman Jatoi" }] }),
});

function AuthPage() {
  const { next } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: (next as any) ?? "/import" });
    });
  }, [navigate, next]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: (next as any) ?? "/import" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/import" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email to confirm your account (or sign in if confirmation is disabled)");
  }

  async function signInGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: (next as any) ?? "/import" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Admin access to import & manage site content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="in">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="in">Sign in</TabsTrigger>
              <TabsTrigger value="up">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="in">
              <form onSubmit={signIn} className="space-y-3">
                <div>
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Sign in
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="up">
              <form onSubmit={signUp} className="space-y-3">
                <div>
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    minLength={6}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={signInGoogle} disabled={loading}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
