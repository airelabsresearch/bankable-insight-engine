
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRisk } from '@/context/RiskContext';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { RiskLikelihood, RiskCategory, RiskStage, MitigationStatus } from '@/types/risk';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface RiskCreationWizardProps {
  open: boolean;
  onClose: () => void;
}

const riskCategories: RiskCategory[] = [
  'Technical', 'Environmental', 'Regulatory', 'Financial', 
  'Social', 'Commercial', 'Legal', 'Operational'
];

const riskStages: RiskStage[] = [
  'Pre-Development', 'Development', 'Construction', 'Operation'
];

const riskLikelihoods: RiskLikelihood[] = ['Low', 'Medium', 'High'];

const mitigationStatuses: MitigationStatus[] = ['Not Started', 'In Progress', 'Done'];

// Base schema with common validations
const baseSchema = {
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
};

const stepOneSchema = z.object({
  title: baseSchema.title,
  category: baseSchema.category,
  stage: baseSchema.stage,
  description: baseSchema.description,
  owner: baseSchema.owner,
  dateIdentified: baseSchema.dateIdentified,
});

const stepTwoSchema = z.object({
  likelihood: baseSchema.likelihood,
  impactCost: baseSchema.impactCost,
});

const stepThreeSchema = z.object({
  mitigationPlan: baseSchema.mitigationPlan,
  mitigationStatus: baseSchema.mitigationStatus,
  residualLikelihood: baseSchema.residualLikelihood,
  residualImpactCost: baseSchema.residualImpactCost,
});

// Combined schema for the final submission
const formSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
});

type FormValues = z.infer<typeof formSchema>;

export const RiskCreationWizard: React.FC<RiskCreationWizardProps> = ({ open, onClose }) => {
  const { addRisk, calculateRiskScore, calculateContingency } = useRisk();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormValues>>({
    dateIdentified: new Date().toISOString().split('T')[0],
    likelihood: 'Medium',
    mitigationStatus: 'Not Started',
    residualLikelihood: 'Low',
  });
  
  const stepOneForm = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      title: '',
      category: undefined,
      stage: undefined,
      description: '',
      owner: '',
      dateIdentified: new Date().toISOString().split('T')[0],
    },
  });
  
  const stepTwoForm = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      likelihood: 'Medium',
      impactCost: 0,
    },
  });
  
  const stepThreeForm = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      mitigationPlan: '',
      mitigationStatus: 'Not Started',
      residualLikelihood: 'Low',
      residualImpactCost: 0,
    },
  });
  
  const onStepOneSubmit = (data: z.infer<typeof stepOneSchema>) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };
  
  const onStepTwoSubmit = (data: z.infer<typeof stepTwoSchema>) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };
  
  const onStepThreeSubmit = (data: z.infer<typeof stepThreeSchema>) => {
    const finalData = { ...formData, ...data } as FormValues;
    
    addRisk({
      title: finalData.title,
      category: finalData.category,
      stage: finalData.stage,
      description: finalData.description,
      owner: finalData.owner,
      dateIdentified: finalData.dateIdentified,
      likelihood: finalData.likelihood,
      impactCost: finalData.impactCost,
      mitigationPlan: finalData.mitigationPlan,
      mitigationStatus: finalData.mitigationStatus,
      residualLikelihood: finalData.residualLikelihood,
      residualImpactCost: finalData.residualImpactCost,
      createdBy: 'Current User',
    });
    
    resetWizard();
    onClose();
  };
  
  const resetWizard = () => {
    setStep(1);
    setFormData({
      dateIdentified: new Date().toISOString().split('T')[0],
      likelihood: 'Medium',
      mitigationStatus: 'Not Started',
      residualLikelihood: 'Low',
    });
    stepOneForm.reset();
    stepTwoForm.reset();
    stepThreeForm.reset();
  };
  
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetWizard();
        onClose();
      }
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Risk</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-between w-full max-w-md">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-primary text-primary-foreground border-primary'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : 1}
              </div>
              <span className="text-xs mt-1">Basic Info</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step > 1 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'bg-primary text-primary-foreground border-primary' : step > 2 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-gray-200'}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : 2}
              </div>
              <span className="text-xs mt-1">Assessment</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${step > 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 3 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-gray-200'}`}>
                3
              </div>
              <span className="text-xs mt-1">Mitigation</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <Form {...stepOneForm}>
              <form onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)} className="space-y-5">
                <FormField
                  control={stepOneForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter risk title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A concise name for the risk (e.g., "Permit Delay")
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={stepOneForm.control}
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
                        <FormDescription>
                          The type of risk being identified
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepOneForm.control}
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
                        <FormDescription>
                          When this risk might impact the project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={stepOneForm.control}
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
                      <FormDescription>
                        More detailed explanation of what the risk entails
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={stepOneForm.control}
                    name="owner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Owner*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter owner name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Person responsible for monitoring this risk
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepOneForm.control}
                    name="dateIdentified"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Identified*</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          When this risk was first identified
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button type="submit">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
          
          {step === 2 && (
            <Form {...stepTwoForm}>
              <form onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={stepTwoForm.control}
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
                        <FormDescription>
                          Probability of this risk occurring
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepTwoForm.control}
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
                        <FormDescription>
                          Estimated financial impact if risk occurs
                        </FormDescription>
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
                        {stepTwoForm.watch('likelihood') && stepTwoForm.watch('impactCost') 
                          ? calculateRiskScore(
                              stepTwoForm.watch('likelihood') as RiskLikelihood, 
                              stepTwoForm.watch('impactCost')
                            ) 
                          : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Based on likelihood and impact</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Suggested Contingency</div>
                      <div className="text-lg font-bold">
                        {stepTwoForm.watch('likelihood') && stepTwoForm.watch('impactCost') 
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(calculateContingency(
                              stepTwoForm.watch('likelihood') as RiskLikelihood, 
                              stepTwoForm.watch('impactCost')
                            )) 
                          : 'N/A'}
                      </div>
                      <p className="text-xs text-muted-foreground">Recommended financial buffer</p>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="pt-4">
                  <div className="flex w-full justify-between">
                    <Button variant="outline" onClick={goBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          )}
          
          {step === 3 && (
            <Form {...stepThreeForm}>
              <form onSubmit={stepThreeForm.handleSubmit(onStepThreeSubmit)} className="space-y-5">
                <FormField
                  control={stepThreeForm.control}
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
                      <FormDescription>
                        Actions planned to reduce impact or likelihood
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={stepThreeForm.control}
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
                      <FormDescription>
                        Current status of the mitigation efforts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <h3 className="text-base font-medium">Residual Risk (After Mitigation)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={stepThreeForm.control}
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
                        <FormDescription>
                          Expected likelihood after mitigation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepThreeForm.control}
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
                        <FormDescription>
                          Estimated financial impact after mitigation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter className="pt-4">
                  <div className="flex w-full justify-between">
                    <Button variant="outline" onClick={goBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit">
                      Complete
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
