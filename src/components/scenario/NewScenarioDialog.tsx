
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowRightCircle, 
  CheckCircle2, 
  ChevronRight, 
  CopyPlus,
  PlusCircle,
  Minus,
  RefreshCw,
  Save,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Types for scenario creation
type ScenarioType = 'Economic' | 'Market' | 'Technology' | 'Policy' | 'Operations';
type ModuleStatus = 'included' | 'excluded' | 'swapped' | 'added';

interface ModuleItem {
  id: number;
  name: string;
  category: string;
  description: string;
  status: ModuleStatus;
  swappedWith?: string;
  quantity?: number;
}

interface NewScenarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableModules: any[];
  projectName: string;
  onCreateScenario: (scenarioData: any) => void;
}

export function NewScenarioDialog({ 
  open, 
  onOpenChange, 
  availableModules, 
  projectName,
  onCreateScenario 
}: NewScenarioDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ScenarioType>('Economic');
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [activeTab, setActiveTab] = useState('modules');

  // Initialize modules when dialog opens
  React.useEffect(() => {
    if (open) {
      // Initialize with all modules included
      setModules(availableModules.map(module => ({
        ...module,
        status: 'included'
      })));
    }
  }, [open, availableModules]);

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your scenario.",
        variant: "destructive"
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const toggleModuleStatus = (moduleId: number, status: ModuleStatus) => {
    setModules(prev => 
      prev.map(m => 
        m.id === moduleId 
          ? { ...m, status } 
          : m
      )
    );
  };

  const updateModuleSwap = (moduleId: number, newModule: string) => {
    setModules(prev => 
      prev.map(m => 
        m.id === moduleId 
          ? { ...m, status: 'swapped', swappedWith: newModule } 
          : m
      )
    );
  };

  const updateModuleQuantity = (moduleId: number, quantity: number) => {
    setModules(prev => 
      prev.map(m => 
        m.id === moduleId 
          ? { ...m, quantity } 
          : m
      )
    );
  };

  const addNewModule = (moduleToAdd: any) => {
    setModules(prev => [
      ...prev,
      { 
        ...moduleToAdd,
        status: 'added',
        quantity: 1
      }
    ]);
  };

  const handleCreateScenario = () => {
    const scenarioData = {
      name,
      description,
      type,
      project: projectName,
      modules: {
        existing: modules.filter(m => m.status === 'included'),
        added: modules.filter(m => m.status === 'added'),
        swapped: modules.filter(m => m.status === 'swapped'),
        removed: modules.filter(m => m.status === 'excluded'),
      }
    };
    
    onCreateScenario(scenarioData);
    toast({
      title: "Scenario Created",
      description: `"${name}" has been created successfully.`,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setName('');
    setDescription('');
    setType('Economic');
    setModules([]);
    setActiveTab('modules');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Scenario</DialogTitle>
          <DialogDescription>
            {step === 1 ? 
              "Define the scenario details to explore alternative project configurations." :
              "Configure modules to include, exclude, or modify in this scenario."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Scenario Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="e.g., High Inflation Case"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the key assumptions or changes in this scenario..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Scenario Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as ScenarioType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economic">Economic</SelectItem>
                  <SelectItem value="Market">Market</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 rounded-md bg-muted/30 p-4 mt-4">
              <h4 className="font-medium text-sm mb-2">About Scenarios</h4>
              <p className="text-sm text-muted-foreground">
                Scenarios let you explore "what-if" questions by adjusting parameters or changing modules in your project. 
                Changes only affect the scenario, leaving your baseline model intact.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">{name}</h3>
                <Badge variant="outline" className="mt-1">
                  {type}
                </Badge>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="modules" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Configure which modules to include, add, or replace in this scenario.
                </div>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {modules.map((module) => (
                    <div 
                      key={module.id} 
                      className={`border rounded-lg p-3 transition-colors ${
                        module.status === 'excluded' ? 'bg-gray-50 border-gray-200' :
                        module.status === 'swapped' ? 'bg-blue-50 border-blue-200' :
                        module.status === 'added' ? 'bg-green-50 border-green-200' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Switch 
                            checked={module.status !== 'excluded'} 
                            onCheckedChange={(checked) => 
                              toggleModuleStatus(module.id, checked ? 'included' : 'excluded')
                            }
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {module.name}
                              {module.status === 'added' && module.quantity && module.quantity > 1 && 
                                <span className="ml-1 text-xs font-normal">(× {module.quantity})</span>
                              }
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {module.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {module.status !== 'excluded' && (
                          <div className="flex items-center space-x-2">
                            {module.status === 'added' && (
                              <div className="flex items-center space-x-1 mr-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => updateModuleQuantity(module.id, Math.max(1, (module.quantity || 1) - 1))}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm w-5 text-center">{module.quantity || 1}</span>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => updateModuleQuantity(module.id, (module.quantity || 1) + 1)}
                                >
                                  <PlusCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => toggleModuleStatus(module.id, 
                                module.status === 'swapped' ? 'included' : 'swapped'
                              )}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              {module.status === 'swapped' ? 'Revert Swap' : 'Swap'}
                            </Button>
                            
                            {module.status === 'added' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-red-600"
                                onClick={() => toggleModuleStatus(module.id, 'excluded')}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {module.status === 'swapped' && (
                        <div className="mt-2 pl-9">
                          <div className="flex items-center space-x-2">
                            <ChevronRight className="h-3 w-3 text-blue-600" />
                            <Select 
                              value={module.swappedWith || ''} 
                              onValueChange={(value) => updateModuleSwap(module.id, value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue placeholder="Select replacement..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Advanced Version">Advanced Version</SelectItem>
                                <SelectItem value="High-Efficiency Model">High-Efficiency Model</SelectItem>
                                <SelectItem value="Next-Gen Technology">Next-Gen Technology</SelectItem>
                                <SelectItem value="Upgraded System">Upgraded System</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {module.swappedWith && (
                            <div className="text-xs text-blue-700 mt-1 pl-5">
                              Replacing with {module.swappedWith}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    if (availableModules.length > 0) {
                      // Find a module that doesn't exist in the current list
                      const existingIds = modules.map(m => m.id);
                      const modulesToAdd = availableModules.filter(m => !existingIds.includes(m.id));
                      
                      if (modulesToAdd.length > 0) {
                        addNewModule(modulesToAdd[0]);
                      } else {
                        // If all modules are already included, create a new one
                        addNewModule({
                          id: Math.max(...existingIds) + 1,
                          name: "New Module",
                          category: "Custom",
                          description: "Custom module added to scenario"
                        });
                      }
                    }
                  }}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Module
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Adjust key parameters for this scenario (coming soon).
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/20">
                  <p className="text-center text-muted-foreground py-4">
                    Parameter adjustments will be available in a future update.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          {step === 2 ? (
            <Button variant="outline" onClick={handleBack}>
              Back to Details
            </Button>
          ) : (
            <div />
          )}
          
          <div className="flex space-x-2">
            {step === 1 ? (
              <Button onClick={handleNext} disabled={!name.trim()}>
                Configure Modules
                <ArrowRightCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreateScenario}>
                <Save className="mr-2 h-4 w-4" />
                Create Scenario
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
