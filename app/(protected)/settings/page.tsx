"use client";

import { useState } from "react";
import { User, Bell, Shield, KeyRound, Smartphone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { appStore } from "@/store";

export default function SettingsPage() {
  const { userData } = appStore();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        {/* Settings Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className="justify-start gap-3"
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4" />
              Profile Information
            </Button>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              className="justify-start gap-3"
              onClick={() => setActiveTab("security")}
            >
              <Shield className="h-4 w-4" />
              Security & Login
            </Button>
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              className="justify-start gap-3"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </nav>
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" defaultValue={userData?.userRec?.pUserName || ""} disabled />
                    <p className="text-xs text-muted-foreground">To change your legal name, please visit a branch.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email Address
                      </Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        Phone Number
                      </Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Ensure your account is using a long, random password to stay secure.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input id="current_password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input id="new_password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input id="confirm_password" type="password" />
                  </div>
                  <Button className="gap-2">
                    <KeyRound className="h-4 w-4" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">Authenticator App</p>
                      <p className="text-sm text-muted-foreground">Use an app like Google Authenticator to generate codes.</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">SMS Verification</p>
                      <p className="text-sm text-muted-foreground">Receive a text message with a verification code.</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what we get in touch about and how.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Account Alerts</h3>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="alert1" defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="alert1" className="font-medium">Large Transfers</Label>
                        <p className="text-sm text-muted-foreground">Notify me when a transfer over $1,000 occurs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="alert2" defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="alert2" className="font-medium">Failed Transactions</Label>
                        <p className="text-sm text-muted-foreground">Notify me if a payment fails to process.</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Marketing & Promos</h3>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox id="marketing1" />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="marketing1" className="font-medium">Special Offers</Label>
                        <p className="text-sm text-muted-foreground">Receive exclusive partner discounts and offers.</p>
                      </div>
                    </div>
                  </div>

                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
