import type { Express } from "express";
import { supabase, supabaseAdmin } from "./db";

// Middleware to check if user is admin
const requireAdmin = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }

  // Check if user has admin role in user_metadata
  const isAdmin = user.user_metadata?.role === 'admin' || user.email === process.env.ADMIN_EMAIL;
  
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  
  req.userId = user.id;
  req.user = user;
  next();
};

export function registerAdminRoutes(app: Express) {
  // Get admin statistics
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      console.log("📊 Fetching admin stats with service role key...");
      
      // Use admin client with service role key to bypass RLS
      const { count: totalBabies, error: babiesError } = await supabaseAdmin
        .from('baby_profiles')
        .select('*', { count: 'exact', head: true });

      if (babiesError) {
        console.error("❌ Error fetching babies count:", babiesError);
        throw babiesError;
      }
      console.log("✅ Total babies:", totalBabies);

      // Get unique user count from baby profiles
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('baby_profiles')
        .select('user_id');
      
      const uniqueUsers = profiles ? new Set(profiles.map(p => p.user_id)).size : 0;
      console.log("✅ Unique users:", uniqueUsers);

      // Get total vaccines
      const { count: totalVaccines, error: vaccinesError } = await supabaseAdmin
        .from('vaccines')
        .select('*', { count: 'exact', head: true });

      if (vaccinesError) throw vaccinesError;
      console.log("✅ Total vaccines:", totalVaccines);

      // Get total growth records
      const { count: totalGrowthRecords, error: growthError } = await supabaseAdmin
        .from('growth_records')
        .select('*', { count: 'exact', head: true });

      if (growthError) throw growthError;
      console.log("✅ Total growth records:", totalGrowthRecords);

      // Get recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: recentRegistrations, error: recentError } = await supabaseAdmin
        .from('baby_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (recentError) throw recentError;
      console.log("✅ Recent registrations:", recentRegistrations);

      const stats = {
        totalBabies: totalBabies || 0,
        totalUsers: uniqueUsers,
        totalVaccines: totalVaccines || 0,
        totalGrowthRecords: totalGrowthRecords || 0,
        recentRegistrations: recentRegistrations || 0,
      };
      
      console.log("📊 Sending stats:", stats);
      res.json(stats);
    } catch (error: any) {
      console.error('❌ Admin stats error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get all baby profiles (admin only)
  app.get("/api/admin/babies", requireAdmin, async (req, res) => {
    try {
      console.log("👶 Fetching all baby profiles with service role key...");
      
      // Use admin client with service role key to bypass RLS
      const { data, error } = await supabaseAdmin
        .from('baby_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error fetching babies:', error);
        throw error;
      }

      console.log(`✅ Admin fetched ${data?.length || 0} baby profiles`);
      if (data && data.length > 0) {
        console.log("👶 Baby names:", data.map(b => b.baby_name).join(", "));
      }

      // Map to camelCase
      const babies = data?.map(profile => ({
        id: profile.id,
        userId: profile.user_id,
        babyName: profile.baby_name,
        birthDate: profile.birth_date,
        gender: profile.gender,
        photoUrl: profile.photo_url,
        bloodGroup: profile.blood_group,
        contactNumber: profile.contact_number,
        createdAt: profile.created_at,
      })) || [];

      console.log("📤 Sending", babies.length, "babies to frontend");
      res.json(babies);
    } catch (error: any) {
      console.error('❌ Admin babies list error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get all feedbacks (admin only)
  app.get("/api/admin/feedbacks", requireAdmin, async (req, res) => {
    try {
      console.log("💬 Fetching all feedbacks with service role key...");
      
      const { data, error } = await supabaseAdmin
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error fetching feedbacks:', error);
        throw error;
      }

      console.log(`✅ Admin fetched ${data?.length || 0} feedbacks`);

      // Map to camelCase
      const feedbacks = data?.map(feedback => ({
        id: feedback.id,
        userId: feedback.user_id,
        name: feedback.name,
        email: feedback.email,
        rating: feedback.rating,
        message: feedback.message,
        createdAt: feedback.created_at,
      })) || [];

      console.log("📤 Sending", feedbacks.length, "feedbacks to frontend");
      res.json(feedbacks);
    } catch (error: any) {
      console.error('❌ Admin feedbacks list error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Check if current user is admin
  app.get("/api/admin/check", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.log("❌ Admin check: No token provided");
        return res.json({ isAdmin: false });
      }

      // Try to get user with the token
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.log("❌ Admin check: Token validation error:", error.message);
        return res.json({ isAdmin: false });
      }

      if (!user) {
        console.log("❌ Admin check: No user found");
        return res.json({ isAdmin: false });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      const hasAdminRole = user.user_metadata?.role === 'admin';
      const isAdminEmail = user.email?.toLowerCase() === adminEmail?.toLowerCase();
      const isAdmin = hasAdminRole || isAdminEmail;
      
      console.log("🔍 Admin check for user:", user.email);
      console.log("   - ADMIN_EMAIL env:", adminEmail || "NOT SET");
      console.log("   - User email:", user.email);
      console.log("   - User metadata role:", user.user_metadata?.role || "none");
      console.log("   - Has admin role:", hasAdminRole);
      console.log("   - Matches admin email:", isAdminEmail);
      console.log("   - Final result:", isAdmin ? "✅ IS ADMIN" : "❌ NOT ADMIN");
      
      res.json({ isAdmin, userEmail: user.email, adminEmail });
    } catch (error: any) {
      console.error("❌ Admin check error:", error);
      res.json({ isAdmin: false });
    }
  });
}
