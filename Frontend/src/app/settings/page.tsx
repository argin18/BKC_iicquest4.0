"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Moon, Sun, Monitor, User, Shield, Key, Users, CreditCard, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  const handleAction = (key: string, message: string) => {
    setIsSaving(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setIsSaving(prev => ({ ...prev, [key]: false }));
      alert(message);
    }, 600);
  };
  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Update your account details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="BKC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Admin" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="admin@bkc.edu.np" />
              </div>
              <Button onClick={() => handleAction('profile', 'Profile updated successfully')} disabled={isSaving['profile']}>
                {isSaving['profile'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <CardTitle>Appearance & Theme</CardTitle>
              </div>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label>Theme Preference</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Manage how you receive alerts and updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-4 rounded-lg border border-border">
                <input type="checkbox" id="emailNotif" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-lg border border-border">
                <input type="checkbox" id="pushNotif" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotif">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get instant alerts in your browser.</p>
                </div>
              </div>
              <Button onClick={() => handleAction('notif', 'Notification preferences saved')} disabled={isSaving['notif']}>
                {isSaving['notif'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <Button variant="default" onClick={() => handleAction('security', 'Password updated successfully')} disabled={isSaving['security']}>
                {isSaving['security'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>API Access</CardTitle>
              </div>
              <CardDescription>Manage keys to connect third-party integrations to IIROS.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Active Token</Label>
                <div className="flex gap-2">
                  <Input readOnly value="iiros_sk_live_9a8b7c6d5e4f3g2h1" className="font-mono text-muted-foreground" />
                  <Button variant="outline" onClick={() => handleAction('api', 'New API key generated')} disabled={isSaving['api']}>
                    {isSaving['api'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Regenerate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Team Members</CardTitle>
              </div>
              <CardDescription>Invite and manage users who have access to your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm font-medium">BKC Admin (You)</p>
                  <p className="text-xs text-muted-foreground">admin@bkc.edu.np</p>
                </div>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">Owner</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Operations Team</p>
                  <p className="text-xs text-muted-foreground">ops@bkc.edu.np</p>
                </div>
                <span className="text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-1 rounded">Viewer</span>
              </div>
              <Button variant="outline" className="w-full border-dashed" onClick={() => handleAction('invite', 'Invitation sent')} disabled={isSaving['invite']}>
                {isSaving['invite'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Invite Member
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Billing & Plan</CardTitle>
              </div>
              <CardDescription>Manage your IIROS subscription and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-primary flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Enterprise Plan
                  </p>
                  <p className="text-sm text-muted-foreground">Unlimited devices, Advanced AI Insights</p>
                </div>
                <Button variant="default" onClick={() => handleAction('plan', 'Redirecting to billing portal...')} disabled={isSaving['plan']}>
                  {isSaving['plan'] && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
