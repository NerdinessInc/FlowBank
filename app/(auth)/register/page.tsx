"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Contact, Lock, FileText, Check, ArrowLeft, ShieldCheck, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTenant } from "@/components/providers/TenantProvider";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SECTIONS = [
  {
    id: 1,
    title: "About you",
    subtitle: "Your personal information and contact details",
    icon: User,
    color: "#0ea5e9", // Light blue
    fields: ["displayName", "email", "phone"] as const,
  },
  {
    id: 2,
    title: "Your identity",
    subtitle: "Checking to make sure you and your ID match",
    icon: Contact,
    color: "#10b981", // Green
    fields: ["bvn", "dateOfBirth"] as const,
  },
  {
    id: 3,
    title: "Security",
    subtitle: "Setting up a secure password and username",
    icon: Lock,
    color: "#f59e0b", // Amber
    fields: ["subjectRef", "password", "confirmPassword"] as const,
  },
  {
    id: 4,
    title: "Terms & Conditions",
    subtitle: "Review our policies to proceed",
    icon: FileText,
    color: "#8b5cf6", // Purple
    fields: ["terms"] as const,
  },
];

const registerSchema = z.object({
  displayName: z.string().min(1, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Please enter your date of birth"),
  bvn: z.string().min(11, "BVN must be 11 digits").max(11, "BVN must be 11 digits"),
  subjectRef: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").regex(/[0-9]/, "Password must contain at least 1 number"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterHub() {
  const { toast } = useToast();
  const tenant = useTenant();

  const [activeScreen, setActiveScreen] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      displayName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      bvn: "",
      subjectRef: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const { handleSubmit, trigger, control, watch } = methods;

  const watchPassword = watch("password");
  const watchConfirmPassword = watch("confirmPassword");

  const isAllComplete = completedSections.length === SECTIONS.length;
  const nextAvailableSection = SECTIONS.find((s) => !completedSections.includes(s.id))?.id || null;

  const handleSectionPress = (sectionId: number) => {
    // Can only open if it's the next available one or already completed
    if (sectionId === nextAvailableSection || completedSections.includes(sectionId)) {
      setActiveScreen(sectionId);
    }
  };

  const handleSaveSection = async (sectionId: number) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    // Validate only the fields in this section
    const isSectionValid = await trigger(section.fields as any);
    
    if (isSectionValid) {
      if (!completedSections.includes(sectionId)) {
        setCompletedSections((prev) => [...prev, sectionId]);
      }
      setActiveScreen(0);
    } else {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const payload = {
      principalType: "CUSTOMER",
      subjectRef: data.subjectRef,
      displayName: data.displayName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      bvn: data.bvn,
      password: data.password,
    };

    console.log("Submitting payload to backend:", payload);
    toast({ title: "Registration Successful! Redirecting..." });
    
    setTimeout(() => {
      window.location.href = `/${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`;
    }, 1500);
  };

  // -----------------------------------------------------
  // RENDER: Main Hub
  // -----------------------------------------------------
  if (activeScreen === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-muted-foreground mb-4 text-[15px]">
          Each section should only take a couple of minutes to complete.
        </p>

        <div className="space-y-4 mb-4">
          {SECTIONS.map((section) => {
            const isCompleted = completedSections.includes(section.id);
            const isActive = section.id === nextAvailableSection;
            const isLocked = !isCompleted && !isActive;

            const Icon = isCompleted ? Check : section.icon;

            return (
              <button
                key={section.id}
                onClick={() => handleSectionPress(section.id)}
                disabled={isLocked}
                className={`w-full flex items-center px-4 py-3 rounded-2xl border transition-all text-left ${
                  isActive 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" 
                    : isLocked 
                      ? "border-border/50 bg-muted/30 opacity-70 cursor-not-allowed" 
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-4 transition-colors ${
                    isLocked ? "bg-muted text-muted-foreground" : "text-white"
                  }`}
                  style={{ backgroundColor: !isLocked ? section.color : undefined }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-[16px] font-bold mb-[2px] ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                    {section.title}
                  </h3>
                  <p className={`text-[12px] ${isLocked ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
                    {section.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl mb-4">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <p>We'll keep your information secure and confidential.</p>
        </div>

        <Button 
          className="w-full p-6 text-[15px] font-bold rounded-xl"
          disabled={!isAllComplete}
          onClick={handleSubmit(onSubmit)}
        >
          Get started
        </Button>
      </div>
    );
  }

  // -----------------------------------------------------
  // RENDER: Specific Sections
  // -----------------------------------------------------
  const activeSectionData = SECTIONS.find(s => s.id === activeScreen);

  const isPasswordValid = 
    watchPassword?.length >= 6 && 
    /[0-9]/.test(watchPassword || "") && 
    watchPassword === watchConfirmPassword && 
    watchConfirmPassword?.length > 0;

  const isSaveDisabled = activeScreen === 3 && !isPasswordValid;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 flex flex-col gap-2">
        <button 
          onClick={() => setActiveScreen(0)}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-1">
          {activeSectionData?.title}
        </h2>
      </div>

      <Form {...methods}>
        <div className="space-y-6">
          
          {/* Section 1: Personal */}
          {activeScreen === 1 && (
            <>
              <FormField control={control} name="displayName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. John Doe" className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="e.g. 08012345678" className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="e.g. john@example.com" className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {/* Section 2: Identity */}
          {activeScreen === 2 && (
            <>
              <FormField control={control} name="dateOfBirth" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-foreground font-medium mb-[2px]">Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker 
                      value={field.value} 
                      onChange={field.onChange} 
                      placeholder="Select your birth date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="bvn" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Bank Verification Number (BVN)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="11-digit BVN" maxLength={11} className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </>
          )}

          {/* Section 3: Security */}
          {activeScreen === 3 && (
            <>
              <FormField control={control} name="subjectRef" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. John123" className="h-12 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showPassword ? "text" : "password"} placeholder="Min 6 characters" className="h-12 pr-10 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type={showConfirmPassword ? "text" : "password"} placeholder="Repeat password" className="h-12 pr-10 border-border focus-visible:ring-1 focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="p-4 bg-muted/30 border rounded-xl space-y-2 text-sm mt-4">
                <p className="font-medium text-foreground mb-3">Password requirements:</p>
                <div className={`flex items-center gap-2 ${watchPassword?.length >= 6 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {watchPassword?.length >= 6 ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  <span>At least 6 characters</span>
                </div>
                <div className={`flex items-center gap-2 ${/[0-9]/.test(watchPassword || '') ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {/[0-9]/.test(watchPassword || '') ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  <span>Contains a number</span>
                </div>
                <div className={`flex items-center gap-2 ${(watchPassword === watchConfirmPassword && watchConfirmPassword?.length > 0) ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                  {(watchPassword === watchConfirmPassword && watchConfirmPassword?.length > 0) ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  <span>Passwords match</span>
                </div>
              </div>
            </>
          )}

          {/* Section 4: Terms */}
          {activeScreen === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-2xl h-64 overflow-y-auto border text-sm text-muted-foreground space-y-4">
                <p><strong>1. Acceptance of Terms</strong><br/>By accessing or using our services, you agree to be bound by these Terms and Conditions.</p>
                <p><strong>2. Privacy Policy</strong><br/>Your privacy is critical to us. Please review our Privacy Policy to understand how we handle your data securely.</p>
                <p><strong>3. Account Responsibilities</strong><br/>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
                <p><strong>4. Dispute Resolution</strong><br/>Any disputes arising out of your use of the service will be governed by the laws of the operating jurisdiction and settled in arbitration.</p>
              </div>
              <FormField control={control} name="terms" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 shadow-sm bg-card">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the terms and conditions
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      By checking this box, you agree to all the policies outlined above.
                    </p>
                  </div>
                </FormItem>
              )} />
            </div>
          )}

          <div className="pt-4 mt-6 border-t border-border">
            <Button 
              type="button" 
              disabled={isSaveDisabled}
              className="w-full p-6 text-[15px] font-bold rounded-xl"
              onClick={() => handleSaveSection(activeScreen)}
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
