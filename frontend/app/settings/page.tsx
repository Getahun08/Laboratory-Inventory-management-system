"use client"

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
import { User, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
  });

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
        {/* Profile Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">
                Profile Settings
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-slate-500">
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  defaultValue="Admin User"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  defaultValue="admin@lab.com"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
              Save Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Notifications Card */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-semibold text-slate-900">
                Notifications
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-slate-500">
              Configure how you receive alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-blue-50 transition">
              <div className="space-y-0.5">
                <Label className="text-base font-medium text-slate-900">
                  Low Stock Alerts
                </Label>
                <p className="text-sm text-slate-500">
                  Receive notifications when items go below threshold.
                </p>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-blue-100">
                Enabled
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-blue-50 transition">
              <div className="space-y-0.5">
                <Label className="text-base font-medium text-slate-900">
                  Expiry Warnings
                </Label>
                <p className="text-sm text-slate-500">
                  Get warned about chemicals expiring soon.
                </p>
              </div>
              <Button variant="outline" size="sm" className="hover:bg-blue-100">
                Enabled
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
