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
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-[Poppins] text-foreground leading-tight">
              Track Your Baby's Journey with Love
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Monitor vaccines, growth milestones, and get AI-powered pediatric guidance—all in one beautiful, easy-to-use platform built for modern parents.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6" data-testid="button-hero-get-started">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-hero-sign-in">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
            <img
              src={heroImage}
              alt="Parent using BabyTrack app with baby"
              className="relative rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold font-[Poppins] text-foreground">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to make parenting easier and more organized
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">Vaccine Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Never miss a vaccination date. Track upcoming, completed, and overdue vaccines with color-coded reminders.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Baby className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">Growth Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Record height and weight measurements and visualize your baby's growth with beautiful interactive charts.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">PDF Reports</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate professional PDF reports of your baby's profile, growth data, and vaccination history to share with doctors.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-chart-2/10 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-card-foreground">AI Pediatric Assistant</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant answers to your baby health questions with our friendly AI-powered pediatric chatbot.
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
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-0 text-primary-foreground">
            <CardContent className="p-12 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold font-[Poppins]">
                Start Tracking Today
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of parents who trust BabyTrack to keep their little ones healthy and happy.
              </p>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6"
                  data-testid="button-cta-create-account"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
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
