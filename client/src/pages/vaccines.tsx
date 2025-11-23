import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Plus, Edit, Trash2, CheckCircle, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Vaccine, insertVaccineSchema } from "@shared/schema";
import { z } from "zod";
import { format, isBefore, isToday, addMonths } from "date-fns";

const vaccineFormSchema = insertVaccineSchema.extend({
  dueDate: z.string().min(1, "Due date is required"),
});

type VaccineFormValues = z.infer<typeof vaccineFormSchema>;

export default function VaccinesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<Vaccine | null>(null);
  const [createNextDose, setCreateNextDose] = useState(true);

  const { data: vaccines = [], isLoading } = useQuery<Vaccine[]>({
    queryKey: ["/api/vaccines"],
  });

  const form = useForm<VaccineFormValues>({
    resolver: zodResolver(vaccineFormSchema),
    defaultValues: {
      vaccineName: "",
      dueDate: "",
      status: "Pending",
      userId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: VaccineFormValues) => apiRequest("POST", "/api/vaccines", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
      toast({ title: "Vaccine added!", description: "Vaccine has been added to your tracker." });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vaccine> }) =>
      apiRequest("PATCH", `/api/vaccines/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
      toast({ title: "Updated!", description: "Vaccine has been updated." });
      setIsDialogOpen(false);
      setEditingVaccine(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/vaccines/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
      toast({ title: "Deleted", description: "Vaccine has been removed." });
    },
  });

  const onSubmit = (data: VaccineFormValues) => {
    if (editingVaccine) {
      updateMutation.mutate({ id: editingVaccine.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (vaccine: Vaccine) => {
    setEditingVaccine(vaccine);
    form.reset({
      vaccineName: vaccine.vaccineName,
      dueDate: vaccine.dueDate,
      status: vaccine.status,
      userId: vaccine.userId,
    });
    setIsDialogOpen(true);
  };

  const handleMarkComplete = async (vaccine: Vaccine) => {
    // Mark current vaccine as completed
    updateMutation.mutate({
      id: vaccine.id,
      data: { status: "Completed" },
    });

    // Create next dose automatically (1 month later)
    if (createNextDose) {
      const nextDueDate = addMonths(new Date(vaccine.dueDate), 1);
      const nextDoseName = vaccine.vaccineName.includes("(Dose") 
        ? vaccine.vaccineName.replace(/\(Dose \d+\)/, (match) => {
            const doseNum = parseInt(match.match(/\d+/)?.[0] || "1");
            return `(Dose ${doseNum + 1})`;
          })
        : `${vaccine.vaccineName} (Dose 2)`;

      try {
        await apiRequest("POST", "/api/vaccines", {
          vaccineName: nextDoseName,
          dueDate: nextDueDate.toISOString().split("T")[0],
          status: "Pending",
          userId: vaccine.userId,
        });
        
        toast({
          title: "Next dose scheduled!",
          description: `${nextDoseName} scheduled for ${format(nextDueDate, "MMMM dd, yyyy")}`,
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/vaccines"] });
      } catch (error) {
        console.error("Failed to create next dose:", error);
      }
    }
  };

  const getStatusBadge = (vaccine: Vaccine) => {
    const dueDate = new Date(vaccine.dueDate);
    const today = new Date();

    if (vaccine.status === "Completed") {
      return <Badge className="bg-chart-1 text-white" data-testid={`badge-status-${vaccine.id}`}>Completed</Badge>;
    }
    if (isToday(dueDate)) {
      return <Badge className="bg-chart-4 text-white" data-testid={`badge-status-${vaccine.id}`}>Due Today</Badge>;
    }
    if (isBefore(dueDate, today)) {
      return <Badge variant="destructive" data-testid={`badge-status-${vaccine.id}`}>Overdue</Badge>;
    }
    return <Badge className="bg-chart-3 text-white" data-testid={`badge-status-${vaccine.id}`}>Pending</Badge>;
  };

  const sortedVaccines = [...vaccines].sort((a, b) => {
    if (a.status === "Completed" && b.status !== "Completed") return 1;
    if (a.status !== "Completed" && b.status === "Completed") return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const addToGoogleCalendar = (vaccine: Vaccine) => {
    const startDate = new Date(vaccine.dueDate);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour duration

    // Format dates for Google Calendar (YYYYMMDDTHHmmss)
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = encodeURIComponent(`Vaccine: ${vaccine.vaccineName}`);
    const details = encodeURIComponent(`Vaccine appointment for ${vaccine.vaccineName}. Don't forget to bring your baby's vaccination card!`);
    const location = encodeURIComponent('Pediatric Clinic');
    const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;

    window.open(googleCalendarUrl, '_blank');
    
    toast({
      title: "Opening Google Calendar",
      description: "Add this vaccine appointment to your calendar",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[Poppins] text-foreground">Vaccine Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Keep track of your baby's vaccination schedule
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="auto-next-dose" 
              checked={createNextDose}
              onCheckedChange={(checked) => setCreateNextDose(checked as boolean)}
            />
            <label
              htmlFor="auto-next-dose"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Auto-schedule next dose
            </label>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingVaccine(null); form.reset(); }} data-testid="button-add-vaccine">
                <Plus className="w-4 h-4 mr-2" />
                Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-[Poppins]">
                {editingVaccine ? "Edit Vaccine" : "Add New Vaccine"}
              </DialogTitle>
              <DialogDescription>
                {editingVaccine ? "Update vaccine details" : "Add a new vaccine to your tracker"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="vaccineName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vaccine Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hepatitis B" {...field} data-testid="input-vaccine-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-due-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-vaccine"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save Vaccine"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : vaccines.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold font-[Poppins] text-foreground">No Vaccines Yet</h3>
            <p className="text-muted-foreground">Add your first vaccine to start tracking</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVaccines.map((vaccine) => (
            <Card key={vaccine.id} className="hover-elevate transition-all" data-testid={`card-vaccine-${vaccine.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-[Poppins]">{vaccine.vaccineName}</CardTitle>
                  {getStatusBadge(vaccine)}
                </div>
                <CardDescription>
                  Due: {format(new Date(vaccine.dueDate), "MMMM dd, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    {vaccine.status !== "Completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkComplete(vaccine)}
                        className="flex-1"
                        data-testid={`button-complete-${vaccine.id}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(vaccine)}
                      data-testid={`button-edit-${vaccine.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" data-testid={`button-delete-${vaccine.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vaccine</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this vaccine? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(vaccine.id)}
                          data-testid={`button-confirm-delete-${vaccine.id}`}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  </div>
                  {vaccine.status !== "Completed" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => addToGoogleCalendar(vaccine)}
                      className="w-full"
                      data-testid={`button-calendar-${vaccine.id}`}
                    >
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Add to Google Calendar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
