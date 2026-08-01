"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EyeOff, Eye } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTenant } from "@/components/providers/TenantProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const RegisterForm = () => {
  const { toast } = useToast();
  const tenant = useTenant();

  const [showPassword, setShowPassword] = useState(false);

  const registerSchema = z.object({
    displayName: z.string().min(1, "Please enter your full name"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    dateOfBirth: z.string().min(1, "Please enter your date of birth"),
    bvn: z.string().min(11, "BVN must be 11 digits").max(11, "BVN must be 11 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const methods = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      bvn: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const payload = {
      principalType: "CUSTOMER", // Defaulting to CUSTOMER
      subjectRef: data.email, // Using email as the subject reference
      displayName: data.displayName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      bvn: data.bvn,
      password: data.password,
      // institutionId and tenantId are handled by the backend via JWT
    };

    console.log("Submitting payload to backend:", payload);

    // Mock registration logic
    toast({ title: "Registration Successful! (Bypassed)" });
    
    // In a real app, you would redirect to login or dashboard
    setTimeout(() => {
      window.location.href = `/${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`;
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10 flex flex-col items-center">
        {tenant.logo ? (
          <img
            src={tenant.logo}
            alt={tenant.name}
            className="h-14 object-contain mb-4 lg:hidden rounded-full"
          />
        ) : (
          <h1 className="text-3xl font-bold text-foreground tracking-tight lg:hidden mb-2">
            {tenant.name}
          </h1>
        )}
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Create an Account
        </h2>
        <p className="text-muted-foreground mt-2">Join {tenant.name} today</p>
      </div>

      <Card className="w-full border-border shadow-xl bg-card rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={methods.control}
                name="subjectRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John@123"
                        required
                        className="h-12 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        required
                        className="h-12 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="john@example.com"
                          required
                          className="h-12 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+1 234 567 8900"
                          required
                          className="h-12 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={methods.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          required
                          className="h-12 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="bvn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        BVN
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="11-digit BVN"
                          required
                          maxLength={11}
                          className="h-12 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          required
                          className="h-12 pr-10 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          required
                          className="h-12 pr-10 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-12 mt-4 font-medium rounded-xl transition-all shadow-md text-[15px] bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 text-white"
                type="submit"
              >
                Complete Registration
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <a
            href={`/${typeof window !== "undefined" && window.location.search ? window.location.search : ""}`}
            className="text-primary font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
