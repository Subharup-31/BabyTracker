import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Baby, Calendar, TrendingUp, MessageCircle, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BabyProfile, Vaccine, GrowthRecord } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, isBefore, isToday } from "date-fns";

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useQuery<BabyProfile>({
    queryKey: ["/api/baby-profile"],
  });

  const { data: vaccines = [], isLoading: vaccinesLoading } = useQuery<Vaccine[]>({
    queryKey: ["/api/vaccines"],
  });

  const { data: growthRecords = [], isLoading: growthLoading } = useQuery<GrowthRecord[]>({
    queryKey: ["/api/growth-records"],
  });

  const upcomingVaccine = vaccines
    .filter(v => v.status === "Pending" && !isBefore(new Date(v.dueDate), new Date()))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const pendingCount = vaccines.filter(v => v.status === "Pending").length;
  const completedCount = vaccines.filter(v => v.status === "Completed").length;

  const latestGrowth = growthRecords.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const chartData = growthRecords
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-5)
    .map(record => ({
      date: format(new Date(record.date), "MM/dd"),
      weight: record.weight / 1000,
    }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[Poppins] text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your baby's overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Baby Profile Card */}
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baby Profile</CardTitle>
            <Baby className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : profile ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold font-[Poppins]" data-testid="text-baby-name">
                  {profile.babyName}
                </div>
                <p className="text-xs text-muted-foreground">
                  Born: {format(new Date(profile.birthDate), "MMM dd, yyyy")}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {profile.gender}
                </Badge>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No profile yet</p>
                <Link href="/profile">
                  <Button size="sm" variant="outline" data-testid="button-create-profile">
                    Create Profile
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Vaccine Card */}
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Vaccine</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {vaccinesLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : upcomingVaccine ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold font-[Poppins]" data-testid="text-next-vaccine">
                  {upcomingVaccine.vaccineName}
                </div>
                <p className="text-xs text-muted-foreground">
                  Due: {format(new Date(upcomingVaccine.dueDate), "MMM dd, yyyy")}
                </p>
                {isToday(new Date(upcomingVaccine.dueDate)) && (
                  <Badge className="text-xs bg-chart-4 text-white">Due Today</Badge>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vaccine Status Card */}
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {vaccinesLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold font-[Poppins]">
                  <span className="text-chart-4" data-testid="text-pending-count">{pendingCount}</span>
                  {" / "}
                  <span className="text-chart-1" data-testid="text-completed-count">{completedCount}</span>
                </div>
                <p className="text-xs text-muted-foreground">Pending / Completed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Growth Card */}
        <Card className="hover-elevate transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : latestGrowth ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold font-[Poppins]" data-testid="text-latest-weight">
                  {(latestGrowth.weight / 1000).toFixed(1)} kg
                </div>
                <p className="text-xs text-muted-foreground">
                  Height: {latestGrowth.height} cm
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(latestGrowth.date), "MMM dd, yyyy")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No records yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mini Growth Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-[Poppins]">Weight Progress (Last 5 Records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/vaccines">
          <Button className="w-full h-auto py-6" variant="outline" data-testid="button-add-vaccine">
            <div className="flex flex-col items-center gap-2">
              <Plus className="w-6 h-6" />
              <span>Add Vaccine</span>
            </div>
          </Button>
        </Link>
        <Link href="/growth">
          <Button className="w-full h-auto py-6" variant="outline" data-testid="button-add-growth">
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Add Growth Record</span>
            </div>
          </Button>
        </Link>
        <Link href="/chat">
          <Button className="w-full h-auto py-6" variant="outline" data-testid="button-open-chat">
            <div className="flex flex-col items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <span>Ask AI Assistant</span>
            </div>
          </Button>
        </Link>
        <Link href="/profile">
          <Button className="w-full h-auto py-6" variant="outline" data-testid="button-edit-profile">
            <div className="flex flex-col items-center gap-2">
              <User className="w-6 h-6" />
              <span>Edit Profile</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}
