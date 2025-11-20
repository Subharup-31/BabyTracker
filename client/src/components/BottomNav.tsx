import { Link, useLocation } from "wouter";
import { Home, User, Calendar, TrendingUp, MessageCircle } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home", testId: "nav-dashboard" },
    { href: "/profile", icon: User, label: "Profile", testId: "nav-profile" },
    { href: "/vaccines", icon: Calendar, label: "Vaccines", testId: "nav-vaccines" },
    { href: "/growth", icon: TrendingUp, label: "Growth", testId: "nav-growth" },
    { href: "/chat", icon: MessageCircle, label: "Chat", testId: "nav-chat" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors hover-elevate cursor-pointer ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid={item.testId}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
