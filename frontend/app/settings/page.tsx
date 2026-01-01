"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Bell, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    router.replace("/login");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-slate-500">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* ================= Profile ================= */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold">
                Profile Settings
              </CardTitle>
            </div>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="admin@lab.com" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Profile
            </Button>
          </CardFooter>
        </Card>

        
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold">
                Notifications
              </CardTitle>
            </div>
            <CardDescription>Control how you receive alerts.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="font-medium">Low Stock Alerts</Label>
                <p className="text-sm text-slate-500">
                  Notify when quantity is below minimum.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="font-medium">Expiry Warnings</Label>
                <p className="text-sm text-slate-500">
                  Alert when chemicals are expired or expiring soon.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enabled
              </Button>
            </div>
          </CardContent>
        </Card>

        
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold">Security</CardTitle>
            </div>
            <CardDescription>
              Manage account security and sessions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </CardContent>

          <CardFooter className="border-t flex justify-between">
            <p className="text-sm text-slate-500">
              Logging out will end your session.
            </p>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
