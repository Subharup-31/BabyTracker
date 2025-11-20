import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrendingUp, Plus, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { GrowthRecord, BabyProfile, insertGrowthRecordSchema } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const growthFormSchema = insertGrowthRecordSchema.extend({
  date: z.string().min(1, "Date is required"),
});

type GrowthFormValues = z.infer<typeof growthFormSchema>;

export default function GrowthPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: growthRecords = [], isLoading } = useQuery<GrowthRecord[]>({
    queryKey: ["/api/growth-records"],
  });

  const { data: profile } = useQuery<BabyProfile>({
    queryKey: ["/api/baby-profile"],
  });

  const form = useForm<GrowthFormValues>({
    resolver: zodResolver(growthFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      height: 0,
      weight: 0,
      userId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: GrowthFormValues) => apiRequest("POST", "/api/growth-records", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/growth-records"] });
      toast({ title: "Record added!", description: "Growth record has been saved." });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/growth-records/${id}`, undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/growth-records"] });
      toast({ title: "Deleted", description: "Record has been removed." });
    },
  });

  const onSubmit = (data: GrowthFormValues) => {
    createMutation.mutate(data);
  };

  const sortedRecords = [...growthRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const chartData = [...growthRecords]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: format(new Date(record.date), "MM/dd"),
      height: record.height,
      weight: record.weight / 1000,
    }));

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Growth Report", 14, 22);

    if (profile) {
      doc.setFontSize(12);
      doc.text(`Baby Name: ${profile.babyName}`, 14, 35);
      doc.text(`Birth Date: ${format(new Date(profile.birthDate), "MMMM dd, yyyy")}`, 14, 42);
      doc.text(`Gender: ${profile.gender}`, 14, 49);
    }

    doc.setFontSize(14);
    doc.text("Growth Records", 14, 62);

    const tableData = sortedRecords.map((record) => [
      format(new Date(record.date), "MM/dd/yyyy"),
      `${record.height} cm`,
      `${(record.weight / 1000).toFixed(1)} kg`,
    ]);

    autoTable(doc, {
      startY: 68,
      head: [["Date", "Height", "Weight"]],
      body: tableData,
    });

    doc.save(`${profile?.babyName || "baby"}-growth-report.pdf`);

    toast({
      title: "PDF Generated!",
      description: "Your growth report has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[Poppins] text-foreground">Growth Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your baby's height and weight progress
          </p>
        </div>
        <div className="flex gap-2">
          {growthRecords.length > 0 && (
            <Button variant="outline" onClick={generatePDF} data-testid="button-download-pdf">
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => form.reset()} data-testid="button-add-record">
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-[Poppins]">Add Growth Record</DialogTitle>
                <DialogDescription>
                  Record your baby's latest height and weight measurement
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 55"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-height"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (grams)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 3500"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createMutation.isPending}
                    data-testid="button-save-record"
                  >
                    {createMutation.isPending ? "Saving..." : "Save Record"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-[Poppins]">Growth Chart</CardTitle>
            <CardDescription>Visual representation of your baby's growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--chart-1))"
                    label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--chart-2))"
                    label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="height"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                    name="Height (cm)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-[Poppins]">Growth Records</CardTitle>
          <CardDescription>All recorded measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : growthRecords.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold font-[Poppins] text-foreground">No Records Yet</h3>
              <p className="text-muted-foreground">Add your first growth record to start tracking</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRecords.map((record) => (
                    <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{record.height}</TableCell>
                      <TableCell>{(record.weight / 1000).toFixed(1)}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" data-testid={`button-delete-${record.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Record</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this growth record? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(record.id)}
                                data-testid={`button-confirm-delete-${record.id}`}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
