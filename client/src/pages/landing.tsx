import { Link } from "wouter";
import { Baby, Calendar, FileText, MessageCircle, ArrowRight, CheckCircle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";
import heroImage from "@assets/generated_images/hero_image_parent_with_baby.png";
import testimonial1 from "@assets/generated_images/testimonial_avatar_mother_1.png";
import testimonial2 from "@assets/generated_images/testimonial_avatar_father_1.png";
import testimonial3 from "@assets/generated_images/testimonial_avatar_mother_2.png";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-[Poppins] text-foreground">BabyTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Link href="/login">
              <Button variant="ghost" data-testid="link-login">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="link-signup">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb,59,130,246),0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--secondary-rgb,236,72,153),0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                ✨ SYSTEM V1.0 LIVE
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-[Poppins] text-foreground leading-tight">
              Track Your Baby's Health with{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Intelligence & Ease
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              The BabyTrack System simplifies tracking vaccines, monitoring growth, and managing health data—all in one secure platform.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300" data-testid="button-hero-get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-200" data-testid="button-hero-sign-in">
                  Parent Portal
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
            <div className="relative rounded-2xl border border-border shadow-2xl overflow-hidden bg-card">
              <img
                src={heroImage}
                alt="BabyTrack Dashboard Preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Parents", value: "10K+", color: "text-blue-600" },
              { label: "Vaccines Tracked", value: "50K+", color: "text-cyan-600" },
              { label: "Growth Records", value: "100K+", color: "text-indigo-600" },
              { label: "AI Consultations", value: "25K+", color: "text-purple-600" }
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2">
                <div className={`text-4xl md:text-5xl font-bold font-[Poppins] ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
              FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-[Poppins] text-foreground">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to make parenting easier and more organized
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">Vaccine Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Track upcoming, completed, and overdue vaccines with intelligent color-coded reminders and notifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                  <Baby className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">Growth Analytics</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Monitor height and weight with interactive charts and visual insights into your baby's development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">Export Reports</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Generate professional PDF reports to share with pediatricians and keep offline records.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">AI Assistant</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Get instant pediatric guidance 24/7 with our AI-powered chatbot trained on medical knowledge.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-[Poppins] text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">Simple steps to get started tracking your baby's health</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Profile", desc: "Sign up and add your baby's basic information" },
              { step: "2", title: "Track Vaccines", desc: "Add vaccination schedules and mark them as complete" },
              { step: "3", title: "Monitor Growth", desc: "Record height and weight measurements regularly" },
              { step: "4", title: "Ask AI Assistant", desc: "Get instant pediatric guidance anytime you need" }
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold font-[Poppins] mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-[Poppins] text-foreground">
              Loved by Parents Everywhere
            </h2>
            <p className="text-xl text-muted-foreground">See what parents are saying about BabyTrack</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <img src={testimonial1} alt="Sarah M." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold font-[Poppins] text-card-foreground">Sarah M.</h4>
                    <p className="text-sm text-muted-foreground">New Mom</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "BabyTrack has been a lifesaver! I never miss a vaccine appointment and the growth charts help me see my baby's progress clearly."
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CheckCircle key={star} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <img src={testimonial2} alt="James T." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold font-[Poppins] text-card-foreground">James T.</h4>
                    <p className="text-sm text-muted-foreground">First-Time Dad</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "The AI chatbot is amazing! It gives me peace of mind when I have questions at 2 AM. Highly recommend this app to all new parents."
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CheckCircle key={star} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <img src={testimonial3} alt="Emily R." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold font-[Poppins] text-card-foreground">Emily R.</h4>
                    <p className="text-sm text-muted-foreground">Mom of Two</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  "Beautiful design and so easy to use. The PDF reports are perfect for sharing with our pediatrician. This app is a must-have!"
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CheckCircle key={star} className="w-5 h-5 text-primary fill-primary" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
            <CardContent className="p-12 md:p-16 text-center space-y-8 relative z-10">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
                GET STARTED TODAY
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[Poppins] text-foreground">
                Ready to Track Your Baby's Journey?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join thousands of parents who trust BabyTrack to keep their little ones healthy and happy. Start free, no credit card required.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="text-lg px-10 py-7 shadow-lg shadow-primary/25"
                    data-testid="button-cta-create-account"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-10 py-7"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Baby className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-[Poppins] text-foreground">BabyTrack</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted companion for tracking your baby's health and growth milestones.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold font-[Poppins] text-foreground">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-login">Login</span>
                </Link>
                <Link href="/signup">
                  <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" data-testid="link-footer-signup">Sign Up</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold font-[Poppins] text-foreground">Legal</h4>
              <div className="flex flex-col gap-2">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BabyTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
