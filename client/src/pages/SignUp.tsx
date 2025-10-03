import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useLocation } from "wouter";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, User, Image as ImageIcon } from "lucide-react";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm your password" }),
    // File input handled separately; allow optional
    profileImage: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: undefined,
    },
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [, navigate] = useLocation();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      form.setValue("profileImage", undefined);
      setPreview(null);
    }
  }

  async function onSubmit(values: SignUpValues) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      if (values.profileImage instanceof File) {
        formData.append("profileImage", values.profileImage);
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Sign up failed");
      }
      toast({ title: "Account created", description: `Welcome, ${values.firstName}!` });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Sign up error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-white/60">Fill in the details to get started</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input placeholder="John" {...field} className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/40" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Last Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input placeholder="Doe" {...field} className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/40" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input placeholder="you@example.com" {...field} className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-white">Profile Image</FormLabel>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input type="file" accept="image/*" onChange={handleFileChange} className="pl-10 bg-black/40 border-white/20 text-white file:text-white/80" />
                </div>
                {preview && (
                  <img src={preview} alt="Preview" className="h-10 w-10 rounded object-cover border border-white/20" />
                )}
              </div>
            </div>

            <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}