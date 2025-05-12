
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRisk } from '@/context/RiskContext';
import { Risk, RiskCategory, RiskLikelihood, RiskStage, MitigationStatus } from '@/types/risk';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil } from 'lucide-react';

interface EditRiskDialogProps {
  risk: Risk;
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(['Technical', 'Environmental', 'Regulatory', 'Financial', 'Social', 'Commercial', 'Legal', 'Operational']),
  stage: z.enum(['Pre-Development', 'Development', 'Construction', 'Operation']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  owner: z.string().min(2, 'Owner name must be at least 2 characters'),
  dateIdentified: z.string(),
  likelihood: z.enum(['Low', 'Medium', 'High']),
  impactCost: z.number().min(0, 'Impact cost must be a positive number'),
  mitigationPlan: z.string(),
  mitigationStatus: z.enum(['Not Started', 'In Progress', 'Done']),
  residualLikelihood: z.enum(['Low', 'Medium', 'High']),
  residualImpactCost: z.number().min(0, 'Residual impact cost must be a positive number'),
});

const riskCategories: RiskCategory[] = [
  'Technical', 'Environmental', 'Regulatory', 'Financial', 
  'Social', 'Commercial', 'Legal', 'Operational'
];

const riskStages: RiskStage[] = [
  'Pre-Development', 'Development', 'Construction', 'Operation'
];

const riskLikelihoods: RiskLikelihood[] = ['Low', 'Medium', 'High'];

const mitigationStatuses: MitigationStatus[] = ['Not Started', 'In Progress', 'Done'];

type FormValues = z.infer<typeof formSchema>;

export const EditRiskDialog: React.FC<EditRiskDialogProps> = ({ risk, open, onClose }) => {
  const { updateRisk, calculateRiskScore, calculateContingency } = useRisk();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: risk.title,
      category: risk.category,
      stage: risk.stage,
      description: risk.description,
      owner: risk.owner,
      dateIdentified: risk.dateIdentified.split('T')[0],
      likelihood: risk.likelihood,
      impactCost: risk.impactCost,
      mitigationPlan: risk.mitigationPlan,
      mitigationStatus: risk.mitigationStatus,
      residualLikelihood: risk.residualLikelihood,
      residualImpactCost: risk.residualImpactCost,
    },
  });
  
  const onSubmit = (data: FormValues) => {
    const riskScore = calculateRiskScore(data.likelihood, data.impactCost);
    const contingencyAmount = calculateContingency(data.likelihood, data.impactCost);
    
    updateRisk({
      ...risk,
      ...data,
      riskScore,
      contingencyAmount,
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex items-start">
          <div className="flex items-center">
            <Pencil className="h-5 w-5 mr-2 text-muted-foreground" />
            <DialogTitle className="text-xl">Edit Risk</DialogTitle>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Risk Details</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter risk title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Category*</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {riskCategories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Stage*</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {riskStages.map((stage) => (
                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a detailed description of the risk"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Owner*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter owner name" {...field} />
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
                        <FormLabel>Date Identified*</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="likelihood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Likelihood*</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select likelihood" />
                            </SelectTrigger>
                            <SelectContent>
                              {riskLikelihoods.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="impactCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Cost ($)*</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium">Risk Score & Contingency</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Calculated Risk Score</div>
                      <div className="text-lg font-bold">
                        {form.watch('likelihood') && form.watch('impactCost') 
                          ? calculateRiskScore(
                              form.watch('likelihood') as RiskLikelihood, 
                              form.watch('impactCost')
                            ) 
                          : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Based on likelihood and impact</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Suggested Contingency</div>
                      <div className="text-lg font-bold">
                        {form.watch('likelihood') && form.watch('impactCost') 
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(calculateContingency(
                              form.watch('likelihood') as RiskLikelihood, 
                              form.watch('impactCost')
                            )) 
                          : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Recommended financial buffer</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="mitigation" className="space-y-4">
                <FormField
                  control={form.control}
                  name="mitigationPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitigation Plan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how this risk will be mitigated"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mitigationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitigation Status</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {mitigationStatuses.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <h3 className="text-base font-medium">Residual Risk (After Mitigation)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="residualLikelihood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residual Likelihood</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select likelihood" />
                            </SelectTrigger>
                            <SelectContent>
                              {riskLikelihoods.map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="residualImpactCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residual Impact Cost ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
              
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
