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

const LoginForm = () => {
  // const router = useRouter();
  const { login } = appStore();

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
    await authUserMutation.mutateAsync({
      ...data,
      sessionId: sessionID,
      remote_IP: remoteIP,
    });
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-sm py-6">
        <CardContent className="grid gap-4">
          <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={methods.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your username"
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4 text-gray-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                className="w-full font-semibold"
                type="submit"
                disabled={!sessionID || authUserMutation.isPending}
              >
                {authUserMutation.isPending ? "Loading..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginForm;
// function wait(arg0: number) {
// 	throw new Error('Function not implemented.');
// }
