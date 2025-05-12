import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Risk, RiskCategory, ProjectStage, RiskLikelihood, MitigationStatus } from "@/lib/types/risk";

const riskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  stage: z.enum(['Feasibility', 'Pre-Financing', 'Development', 'Construction', 'Operations']),
  description: z.string().min(1, "Description is required"),
  owner: z.string().min(1, "Owner is required"),
  dateIdentified: z.string().transform(str => new Date(str)),
  assessment: z.object({
    likelihood: z.union([
      z.enum(['Low', 'Medium', 'High']),
      z.number().min(0).max(100)
    ]),
    impactCost: z.number().min(0),
  }),
  mitigation: z.object({
    description: z.string().min(1, "Mitigation plan is required"),
    status: z.enum(['Not Started', 'In Progress', 'Done']),
    residualLikelihood: z.union([
      z.enum(['Low', 'Medium', 'High']),
      z.number().min(0).max(100)
    ]),
    residualImpactCost: z.number().min(0),
    owner: z.string().min(1, "Mitigation owner is required"),
    dueDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  }),
});

type RiskFormValues = z.infer<typeof riskFormSchema>;

interface RiskFormProps {
  risk?: Risk;
  onSubmit: (data: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  onCancel: () => void;
}

export function RiskForm({ risk, onSubmit, onCancel }: RiskFormProps) {
  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: risk ? {
      ...risk,
      dateIdentified: risk.dateIdentified.toISOString().split('T')[0],
      mitigation: {
        ...risk.mitigation,
        dueDate: risk.mitigation.dueDate?.toISOString().split('T')[0],
      },
    } : {
      title: '',
      category: '',
      stage: 'Feasibility',
      description: '',
      owner: '',
      dateIdentified: new Date().toISOString().split('T')[0],
      assessment: {
        likelihood: 'Medium',
        impactCost: 0,
      },
      mitigation: {
        description: '',
        status: 'Not Started',
        residualLikelihood: 'Medium',
        residualImpactCost: 0,
        owner: '',
      },
    },
  });

  const handleSubmit = (data: RiskFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{risk ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Regulatory">Regulatory</SelectItem>
                        <SelectItem value="Environmental">Environmental</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="Operational">Operational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Feasibility">Feasibility</SelectItem>
                        <SelectItem value="Pre-Financing">Pre-Financing</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Owner</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateIdentified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Identified</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Assessment</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assessment.likelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likelihood</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select likelihood" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessment.impactCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Cost ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mitigation Plan</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mitigation.status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mitigation.owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitigation Owner</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mitigation.dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mitigation.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mitigation Plan</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mitigation.residualLikelihood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residual Likelihood</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select likelihood" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mitigation.residualImpactCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residual Impact Cost ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {risk ? 'Update Risk' : 'Add Risk'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 