"use client";

import { useState, useEffect } from "react";

// hooks
import { useToast } from "@/hooks/use-toast";

// icons
import { EyeOff, HelpCircle, Eye } from "lucide-react";

// form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// query
import { useMutation } from "@tanstack/react-query";

// components
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// store
import { appStore } from "@/store";
import { authUser } from "@/services/apiAuth";
import { getApiToken } from "@/utils/axiosInstance";
import { Loading } from "@/components/Loader";

// services
import { useTenant } from "@/components/providers/TenantProvider";

const LoginForm = () => {
  // const router = useRouter();
  const { login } = appStore();
  const tenant = useTenant();

  const { toast } = useToast();

  const [sessionID, setSessionID] = useState(null);
  const [remoteIP, setRemoteIP] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = z.object({
    password: z.string().min(1, "Please enter your password"),
    userName: z.string().min(1, "Please enter your username"),
  });

  const defaultValues = {
    password: "",
    userName: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    async function init() {
      try {
        const token = await getApiToken();
        console.log("Token received:", token);

        const res = await fetch("/api/getSessionId");
        const data = await res.json();
        console.log("Session data:", data);

        setSessionID(data.sessionID);
        setRemoteIP(data.ip);
      } catch (err) {
        console.error("Error initializing:", err);
      }
    }

    init();
  }, []);

  const { handleSubmit } = methods;

  const authUserMutation = useMutation({
    mutationFn: authUser,
    onSuccess: (res: any) => {
      console.log("Login Response:", res);
      if (!res.success) {
        toast({
          title: res.errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
        });

        login(res);
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // BYPASS BACKEND - Mocking a successful login response
    const mockResponse = {
      success: true,
      userRec: { userName: data.userName, name: "Test User" },
      acctCollection: [],
      codProd: "mock-prod",
      companyUsers: [],
      acctBlocks: [],
      mmenuControls: [],
      xmainMenu: [],
      plimitsObject: {},
    };
    
    
    // Save institutionId to cookie so it persists across the app
    const searchParams = new URLSearchParams(window.location.search);
    const instId = searchParams.get('institutionId') || 'default';
    document.cookie = `institutionId=${instId}; path=/; max-age=31536000`;

    toast({ title: "Login Successful (Bypassed)" });
    login(mockResponse as any);
    
    // Original code:
    // await authUserMutation.mutateAsync({
    //   ...data,
    //   sessionId: sessionID,
    //   remote_IP: remoteIP,
    // });
  };

  return (
    <div className="w-full">
      <div className="text-center mb-10 flex flex-col items-center">
        {tenant.logo ? (
          <img src={tenant.logo} alt={tenant.name} className="h-14 object-contain mb-4 lg:hidden" />
        ) : (
          <h1 className="text-3xl font-bold text-foreground tracking-tight lg:hidden mb-2">{tenant.name}</h1>
        )}
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>
      <Card className="w-full border-border shadow-xl bg-card rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <Form {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={methods.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your username"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            className="h-12 pr-10 border-border focus-visible:ring-primary rounded-xl bg-background transition-all text-foreground"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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

                <Button
                  className="w-full h-12 font-medium rounded-xl transition-all shadow-md text-[15px] bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0"
                  type="submit"
                  disabled={authUserMutation.isPending}
                >
                  {authUserMutation.isPending ? "Authenticating..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            New to {tenant.name}?{" "}
            <a 
              href={`/register${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`} 
              className="text-primary font-semibold hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
  );
};

export default LoginForm;
// function wait(arg0: number) {
// 	throw new Error('Function not implemented.');
// }
