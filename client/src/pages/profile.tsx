import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Baby, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BabyProfile, insertBabyProfileSchema } from "@shared/schema";
import { z } from "zod";

const profileFormSchema = insertBabyProfileSchema.extend({
  birthDate: z.string().min(1, "Birth date is required"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const { data: profile, isLoading } = useQuery<BabyProfile>({
    queryKey: ["/api/baby-profile"],
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      babyName: profile?.babyName || "",
      birthDate: profile?.birthDate || "",
      gender: profile?.gender || "Male",
      photoUrl: profile?.photoUrl || "",
      bloodGroup: profile?.bloodGroup || "",
      contactNumber: profile?.contactNumber || "",
      userId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      // Remove userId from the data - backend will use the authenticated user's ID
      const { userId, ...profileData } = data;
      if (profile) {
        return apiRequest("PUT", "/api/baby-profile", profileData);
      } else {
        return apiRequest("POST", "/api/baby-profile", profileData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/baby-profile"] });
      toast({
        title: "Profile saved!",
        description: "Your baby's profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Could not save profile",
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        form.setValue("photoUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile && !form.getValues("babyName")) {
    form.reset({
      babyName: profile.babyName,
      birthDate: profile.birthDate,
      gender: profile.gender,
      photoUrl: profile.photoUrl || "",
      bloodGroup: profile.bloodGroup || "",
      contactNumber: profile.contactNumber || "",
      userId: profile.userId,
    });
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-[Poppins] text-foreground">Baby Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your baby's information and photo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-[Poppins]">
            {profile ? "Edit Profile" : "Create Profile"}
          </CardTitle>
          <CardDescription>
            {profile
              ? "Update your baby's details below"
              : "Add your baby's information to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <input
                type="file"
                ref={(ref) => fileInputRef[1](ref)}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={photoPreview || form.watch("photoUrl") || undefined} />
                    <AvatarFallback className="bg-secondary text-4xl">
                      <Baby className="w-16 h-16" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full shadow-md"
                    onClick={() => fileInputRef[0]?.click()}
                    data-testid="button-upload-photo"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name="babyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baby's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter baby's name" {...field} data-testid="input-baby-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-birth-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group (optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-blood-group">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter contact number"
                        {...field}
                        value={field.value || ""}
                        data-testid="input-contact-number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="button-save-profile"
              >
                <Save className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
