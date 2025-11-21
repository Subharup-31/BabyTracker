import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, LogOut, Moon, Sun, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("supabase_token");
      console.log("Checking admin status with token:", token ? "Token exists" : "No token");
      
      const response = await fetch("/api/admin/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Admin check response:", data);
      setIsAdmin(data.isAdmin);
      
      if (data.isAdmin) {
        console.log("✅ User is admin - Admin button will be shown");
      } else {
        console.log("❌ User is not admin");
      }
    } catch (error) {
      console.error("Admin check error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href={isAdmin ? "/admin" : "/dashboard"}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Home className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold font-[Poppins] text-foreground hidden sm:inline">
                BabyTrack
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  data-testid="button-admin"
                  aria-label="Admin Panel"
                  className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Admin</span>
                </Button>
              </Link>
            )}
            <Link href="/profile">
              <Button
                size="icon"
                variant="ghost"
                data-testid="button-profile"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLogout}
              data-testid="button-logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>

      {/* Bottom Navigation - Hidden for admin users */}
      {!isAdmin && <BottomNav />}
    </div>
  );
}
