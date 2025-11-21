import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, Baby, Syringe, TrendingUp, Calendar, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AdminStats {
  totalBabies: number;
  totalUsers: number;
  totalVaccines: number;
  totalGrowthRecords: number;
  recentRegistrations: number;
}

interface BabyProfile {
  id: string;
  userId: string;
  babyName: string;
  birthDate: string;
  gender: string;
  bloodGroup: string | null;
  contactNumber: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem("supabase_token");
      if (!token) {
        setLocation("/login");
        return;
      }

      const response = await fetch("/api/admin/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!data.isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        setLocation("/dashboard");
        return;
      }

      setIsAdmin(true);
      fetchAdminData(token);
    } catch (error) {
      console.error("Admin check error:", error);
      setLocation("/login");
    }
  };

  const fetchAdminData = async (token: string) => {
    try {
      setLoading(true);

      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch babies list
      const babiesResponse = await fetch("/api/admin/babies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (babiesResponse.ok) {
        const babiesData = await babiesResponse.json();
        setBabies(babiesData);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                   (today.getMonth() - birth.getMonth());
    
    if (months < 12) {
      return `${months} months`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      localStorage.removeItem("supabase_token");
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLocation("/login");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor baby tracker statistics</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Babies</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBabies}</div>
              <p className="text-xs text-muted-foreground">Registered profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">User accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vaccines</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVaccines}</div>
              <p className="text-xs text-muted-foreground">Total records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Records</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGrowthRecords}</div>
              <p className="text-xs text-muted-foreground">Total entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent (30d)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentRegistrations}</div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Babies List */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Babies</CardTitle>
          <CardDescription>All baby profiles in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {babies.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No babies registered yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Baby Name</th>
                    <th className="text-left p-2 font-medium">Age</th>
                    <th className="text-left p-2 font-medium">Gender</th>
                    <th className="text-left p-2 font-medium">Blood Group</th>
                    <th className="text-left p-2 font-medium">Contact</th>
                    <th className="text-left p-2 font-medium">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {babies.map((baby) => (
                    <tr key={baby.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{baby.babyName}</td>
                      <td className="p-2">{calculateAge(baby.birthDate)}</td>
                      <td className="p-2 capitalize">{baby.gender}</td>
                      <td className="p-2">{baby.bloodGroup || "-"}</td>
                      <td className="p-2">{baby.contactNumber || "-"}</td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(baby.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
