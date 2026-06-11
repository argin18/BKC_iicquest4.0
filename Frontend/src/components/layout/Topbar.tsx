"use client";

import { Bell, Search, Sparkles, User, Settings, LogOut, CheckCircle2, Calculator, Menu, LayoutDashboard, BarChart3, Cpu, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import CalculatorWidget from "@/components/CalculatorWidget";
// Using merged imports above

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/devices", label: "Devices", icon: Cpu },
  { href: "/recommendations", label: "AI Insights", icon: Sparkles },
  { href: "/reports", label: "Impact Reports", icon: FileText },
];

export default function Topbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "High Consumption Alert",
      desc: "HVAC Unit-3 is using 20% more power than usual.",
      time: "2 mins ago",
      type: "warning",
      icon: Bell,
    },
    {
      id: 2,
      title: "Optimization Successful",
      desc: "Solar offset reached 35% target.",
      time: "1 hour ago",
      type: "success",
      icon: CheckCircle2,
    }
  ]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/devices?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const markAllRead = () => setNotifications([]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6 no-print transition-all">
      <div className="flex items-center gap-2">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0 flex flex-col">
            <Link href="/" className="flex h-16 items-center gap-3 border-b border-border px-4 transition-colors hover:bg-accent/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <span className="text-sm font-bold tracking-tight text-foreground">IIROS</span>
              </div>
            </Link>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="space-y-1 border-t border-border px-3 py-4">
              <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                <Settings className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search devices, analytics... (Press Enter)"
            className="h-9 w-72 rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* AI Status */}
        <div className="mr-2 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
          <div className="relative">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Gemini <span className="text-success">Active</span>
          </span>
        </div>

        {/* Calculator Widget */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Calculator className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalculatorWidget />
          </PopoverContent>
        </Popover>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-border">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <span onClick={markAllRead} className="text-xs text-primary cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer" onClick={() => router.push("/analytics")}>
                    <div className={`rounded-full p-2 ${notif.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      <notif.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))
              )}

              <Button variant="outline" className="w-full mt-2 text-xs h-8" onClick={() => router.push("/reports")}>
                View All Activity
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 ml-2 pl-3 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
              <div className="hidden md:block text-right">
                <p className="text-xs font-medium text-foreground">BKC Admin</p>
                <p className="text-[10px] text-muted-foreground">Energy Manager</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-xs font-bold text-white">BK</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
