import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Plus, 
  GitMerge, 
  GitGraph, 
  Table, 
  BarChart2, 
  Copy, 
  Trash2, 
  ExternalLink, 
  PlusCircle, 
  Minus, 
  RefreshCw,
  Loader2,
  ArrowDownIcon,
  ArrowUpIcon,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NewScenarioDialog } from '@/components/scenario/NewScenarioDialog';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type FinancialMetric = {
  metric: string;
  baseline: string;
  scenario: string;
  delta: string;
  direction: "up" | "down" | "neutral";
};

type ScenarioResults = {
  financialMetrics: FinancialMetric[];
  timestamp: string;
  insight: {
    type: "success" | "warning" | "info";
    message: string;
  };
};

const scenariosData = [
  {
    id: 1,
    name: "High Inflation",
    description: "Increased inflation rates affecting CAPEX and OPEX",
    type: "Economic",
    project: "Green Hydrogen Plant",
    changes: [
      { parameter: "Inflation Rate", baseline: "2.5%", scenario: "5.0%" },
      { parameter: "CAPEX Growth", baseline: "3.0%", scenario: "7.5%" },
      { parameter: "OPEX Annual Increase", baseline: "2.0%", scenario: "4.5%" }
    ],
    modules: {
      existing: [
        { id: 1, name: "Hydrogen Electrolyzer", status: "unchanged" },
        { id: 2, name: "Grid Connection", status: "unchanged" },
        { id: 3, name: "Compression Unit", status: "unchanged" }
      ],
      added: [],
      swapped: [],
      removed: []
    }
  },
  {
    id: 2,
    name: "No Policy Support",
    description: "Remove all policy incentives and subsidies",
    type: "Policy",
    project: "Solar + Storage",
    changes: [
      { parameter: "ITC", baseline: "30%", scenario: "0%" },
      { parameter: "PTC", baseline: "$25/MWh", scenario: "$0/MWh" },
      { parameter: "Carbon Credit", baseline: "$50/ton", scenario: "$0/ton" }
    ],
    modules: {
      existing: [
        { id: 1, name: "Solar Array", status: "unchanged" },
        { id: 2, name: "Battery System", status: "unchanged" }
      ],
      added: [],
      swapped: [],
      removed: []
    }
  },
  {
    id: 3,
    name: "Technology Breakthrough",
    description: "Improved efficiency and reduced costs due to tech advances",
    type: "Technology",
    project: "Battery Storage Facility",
    changes: [
      { parameter: "Round-trip Efficiency", baseline: "85%", scenario: "92%" },
      { parameter: "Battery Cost", baseline: "$300/kWh", scenario: "$200/kWh" },
      { parameter: "Cycle Life", baseline: "3,500", scenario: "5,000" }
    ],
    modules: {
      existing: [
        { id: 1, name: "Battery System", status: "unchanged" },
        { id: 2, name: "Inverter System", status: "unchanged" }
      ],
      added: [],
      swapped: [
        { id: 3, name: "Controller System", newModule: "Advanced Controller", benefits: "AI-optimized dispatch" }
      ],
      removed: []
    }
  },
  {
    id: 4,
    name: "Grid Backup Enabled",
    description: "Added backup systems for grid resilience",
    type: "Operations",
    project: "E-Fuel Production",
    changes: [
      { parameter: "Product Price", baseline: "$8.50/kg", scenario: "$6.25/kg" },
      { parameter: "Demand Growth", baseline: "8% p.a.", scenario: "3% p.a." },
      { parameter: "Capacity Factor", baseline: "90%", scenario: "75%" }
    ],
    modules: {
      existing: [
        { id: 1, name: "E-Fuel Synthesis", status: "unchanged" },
      ],
      added: [
        { id: 2, name: "Battery System (10 MWh)", count: 3 }
      ],
      swapped: [
        { id: 3, name: "Hydrogen System", newModule: "Advanced Hydrogen System (TRL 9)", benefits: "15% higher efficiency" }
      ],
      removed: [
        { id: 4, name: "Grid Connection", reason: "Redundant with battery backup" }
      ]
    }
  }
];

const availableModules = [
  { id: 1, name: "Battery System", category: "Storage", description: "Energy storage solution", icon: "Battery" },
  { id: 2, name: "Solar Array", category: "Generation", description: "Photovoltaic power system", icon: "Sun" },
  { id: 3, name: "Wind Turbine", category: "Generation", description: "Wind power generation", icon: "Wind" },
  { id: 4, name: "Hydrogen Electrolyzer", category: "Production", description: "Water electrolysis unit", icon: "Zap" },
  { id: 5, name: "CO2 Capture", category: "Process", description: "Carbon capture system", icon: "Cloud" },
  { id: 6, name: "Grid Connection", category: "Infrastructure", description: "Connection to power grid", icon: "Power" },
  { id: 7, name: "Desalination Unit", category: "Process", description: "Water purification system", icon: "Droplet" },
  { id: 8, name: "Heat Recovery", category: "Efficiency", description: "Waste heat utilization", icon: "Thermometer" }
];

const templateData = [
  { name: "High/Medium/Low Case", type: "General", parameters: 12 },
  { name: "Policy Changes", type: "Policy", parameters: 8 },
  { name: "Technology Evolution", type: "Technology", parameters: 10 },
  { name: "Market Volatility", type: "Market", parameters: 9 },
  { name: "Supply Chain Disruption", type: "Operations", parameters: 7 },
  { name: "Climate Scenarios", type: "Environmental", parameters: 11 }
];

const Scenarios: React.FC = () => {
  const { toast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [showAddModuleDialog, setShowAddModuleDialog] = useState(false);
  const [showNewScenarioDialog, setShowNewScenarioDialog] = useState(false);
  const [scenarios, setScenarios] = useState(scenariosData);
  const [runningScenarios, setRunningScenarios] = useState<number[]>([]);
  const [scenarioResults, setScenarioResults] = useState<Record<number, ScenarioResults>>({});

  const handleAddModule = (scenarioId: number) => {
    setSelectedScenario(scenarioId);
    setShowAddModuleDialog(true);
  };

  const handleCreateScenario = (scenarioData: any) => {
    const newScenario = {
      id: scenarios.length + 1,
      name: scenarioData.name,
      description: scenarioData.description,
      type: scenarioData.type,
      project: scenarioData.project,
      changes: [],
      modules: {
        existing: scenarioData.modules.existing.map((m: any) => ({ 
          id: m.id, 
          name: m.name, 
          status: 'unchanged'
        })),
        added: scenarioData.modules.added.map((m: any) => ({ 
          id: m.id, 
          name: m.name, 
          count: m.quantity || 1 
        })),
        swapped: scenarioData.modules.swapped.map((m: any) => ({ 
          id: m.id, 
          name: m.name, 
          newModule: m.swappedWith, 
          benefits: `Improved performance and efficiency` 
        })),
        removed: scenarioData.modules.removed.map((m: any) => ({ 
          id: m.id, 
          name: m.name, 
          reason: 'Removed in scenario configuration' 
        }))
      }
    };

    setScenarios([...scenarios, newScenario]);
  };

  const runScenario = (scenarioId: number) => {
    setRunningScenarios(prev => [...prev, scenarioId]);
    
    setTimeout(() => {
      const scenario = scenarios.find(s => s.id === scenarioId);
      
      if (!scenario) {
        setRunningScenarios(prev => prev.filter(id => id !== scenarioId));
        return;
      }
      
      let metrics: FinancialMetric[] = [];
      let insightMessage = "";
      let insightType: "success" | "warning" | "info" = "success";
      
      if (scenario.type === "Economic") {
        metrics = [
          {
            metric: "IRR",
            baseline: "12.4%",
            scenario: "10.8%",
            delta: "-12.9%",
            direction: "down"
          },
          {
            metric: "NPV",
            baseline: "$48.2M",
            scenario: "$42.6M",
            delta: "-11.6%",
            direction: "down"
          },
          {
            metric: "Payback Period",
            baseline: "7.1 years",
            scenario: "8.3 years",
            delta: "+16.9%",
            direction: "up"
          },
          {
            metric: "LCOH",
            baseline: "$3.50/kg",
            scenario: "$3.95/kg",
            delta: "+12.8%",
            direction: "up"
          }
        ];
        insightMessage = "NPV is down 11.6% vs. baseline. Consider running a sensitivity analysis.";
        insightType = "warning";
      } else if (scenario.type === "Policy") {
        metrics = [
          {
            metric: "IRR",
            baseline: "14.2%",
            scenario: "9.5%",
            delta: "-33.1%",
            direction: "down"
          },
          {
            metric: "NPV",
            baseline: "$52.8M",
            scenario: "$31.4M",
            delta: "-40.5%",
            direction: "down"
          },
          {
            metric: "Payback Period",
            baseline: "6.3 years",
            scenario: "9.7 years",
            delta: "+54.0%",
            direction: "up"
          },
          {
            metric: "LCOE",
            baseline: "$45/MWh",
            scenario: "$68/MWh",
            delta: "+51.1%",
            direction: "up"
          }
        ];
        insightMessage = "Significant decrease in profitability without policy support. Project may not be viable.";
        insightType = "warning";
      } else if (scenario.type === "Technology") {
        metrics = [
          {
            metric: "IRR",
            baseline: "11.8%",
            scenario: "14.3%",
            delta: "+21.2%",
            direction: "up"
          },
          {
            metric: "NPV",
            baseline: "$43.5M",
            scenario: "$56.2M",
            delta: "+29.2%",
            direction: "up"
          },
          {
            metric: "Payback Period",
            baseline: "7.5 years",
            scenario: "6.2 years",
            delta: "-17.3%",
            direction: "down"
          },
          {
            metric: "Round-trip Efficiency",
            baseline: "85%",
            scenario: "92%",
            delta: "+8.2%",
            direction: "up"
          }
        ];
        insightMessage = "Technology improvements significantly enhance project economics. Consider accelerating deployment.";
        insightType = "success";
      } else {
        metrics = [
          {
            metric: "IRR",
            baseline: "13.0%",
            scenario: "12.1%",
            delta: "-6.9%",
            direction: "down"
          },
          {
            metric: "NPV",
            baseline: "$45.0M",
            scenario: "$41.8M",
            delta: "-7.1%",
            direction: "down"
          },
          {
            metric: "Payback Period",
            baseline: "6.8 years",
            scenario: "7.4 years",
            delta: "+8.8%",
            direction: "up"
          },
          {
            metric: "Carbon Intensity",
            baseline: "120 gCO2e/kWh",
            scenario: "105 gCO2e/kWh",
            delta: "-12.5%",
            direction: "down"
          }
        ];
        insightMessage = "Scenario run complete. Financial metrics recalculated.";
        insightType = "info";
      }
      
      setScenarioResults(prev => ({
        ...prev,
        [scenarioId]: {
          financialMetrics: metrics,
          timestamp: new Date().toLocaleString(),
          insight: {
            type: insightType,
            message: insightMessage
          }
        }
      }));
      
      toast({
        title: "Scenario Analysis Complete",
        description: `The scenario "${scenario.name}" has been analyzed.`,
      });
      
      setRunningScenarios(prev => prev.filter(id => id !== scenarioId));
    }, 1500);
  };

  const getModuleBadgeColor = (status: string) => {
    switch (status) {
      case 'added':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'swapped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getModuleStatusIcon = (status: string) => {
    switch (status) {
      case 'added':
        return <PlusCircle className="h-3 w-3 mr-1" />;
      case 'swapped':
        return <RefreshCw className="h-3 w-3 mr-1" />;
      case 'removed':
        return <Minus className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const hasScenarioChanges = (scenario: any) => {
    return (
      scenario.changes.length > 0 ||
      scenario.modules.added.length > 0 ||
      scenario.modules.swapped.length > 0 ||
      scenario.modules.removed.length > 0
    );
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "success":
        return "default border-green-200 bg-green-50 text-green-800";
      case "warning":
        return "default border-yellow-200 bg-yellow-50 text-yellow-800";
      case "info":
      default:
        return "default";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
      default:
        return <GitMerge className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Management</h1>
          <p className="text-muted-foreground">
            Create and analyze different scenarios for your projects
          </p>
        </div>
        <Button className="eco-gradient" onClick={() => setShowNewScenarioDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Scenario
        </Button>
      </div>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scenarios">My Scenarios</TabsTrigger>
          <TabsTrigger value="templates">Scenario Templates</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scenarios" className="mt-0">
          <div className="grid gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{scenario.name}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {scenario.type}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {scenario.description}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">
                        Project: {scenario.project}
                      </p>
                    </div>
                    <div className="flex items-center mt-3 md:mt-0 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => runScenario(scenario.id)}
                        disabled={runningScenarios.includes(scenario.id) || !hasScenarioChanges(scenario)}
                      >
                        {runningScenarios.includes(scenario.id) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <GitMerge className="mr-2 h-4 w-4" />
                            Run Scenario
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <GitBranch className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart2 className="mr-2 h-4 w-4" />
                            <span>Compare</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Export</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium text-sm mb-2">Parameter Changes</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b text-sm">
                            <th className="py-2 px-4 text-left font-medium text-muted-foreground">Parameter</th>
                            <th className="py-2 px-4 text-left font-medium text-muted-foreground">Baseline Value</th>
                            <th className="py-2 px-4 text-left font-medium text-muted-foreground">Scenario Value</th>
                            <th className="py-2 px-4 text-left font-medium text-muted-foreground">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenario.changes.map((change, index) => {
                            const baseValue = parseFloat(change.baseline.replace(/[^0-9.-]+/g, ""));
                            const scenarioValue = parseFloat(change.scenario.replace(/[^0-9.-]+/g, ""));
                            const changeDirection = !isNaN(baseValue) && !isNaN(scenarioValue) 
                              ? (scenarioValue > baseValue ? "positive" : scenarioValue < baseValue ? "negative" : "neutral")
                              : "neutral";
                            
                            return (
                              <tr key={index} className="border-b text-sm">
                                <td className="py-2 px-4">{change.parameter}</td>
                                <td className="py-2 px-4">{change.baseline}</td>
                                <td className="py-2 px-4 font-medium">{change.scenario}</td>
                                <td className="py-2 px-4">
                                  <span className={`inline-flex items-center ${
                                    changeDirection === "positive" ? "text-eco-600" : 
                                    changeDirection === "negative" ? "text-red-500" : ""
                                  }`}>
                                    {changeDirection === "positive" && "▲ "}
                                    {changeDirection === "negative" && "▼ "}
                                    {!isNaN(baseValue) && !isNaN(scenarioValue) && 
                                      `${Math.abs(((scenarioValue - baseValue) / baseValue) * 100).toFixed(1)}%`}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-sm">Module Configuration</h3>
                      <Button onClick={() => handleAddModule(scenario.id)} variant="outline" size="sm" className="h-7 px-2 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Module
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {scenario.modules.existing.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Baseline Modules</p>
                          <div className="flex flex-wrap gap-2">
                            {scenario.modules.existing.map(module => (
                              <HoverCard key={module.id}>
                                <HoverCardTrigger>
                                  <Badge 
                                    variant="outline" 
                                    className={getModuleBadgeColor('existing')}
                                  >
                                    {module.name}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">{module.name}</h4>
                                    <p className="text-xs text-muted-foreground">Original module from baseline project configuration</p>
                                    <div className="flex justify-end">
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="sm" className="text-xs">
                                            <RefreshCw className="h-3 w-3 mr-1" /> Replace
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48">
                                          <div className="space-y-2">
                                            <h5 className="font-semibold text-sm">Replace with</h5>
                                            <div className="space-y-1">
                                              <Button variant="ghost" size="sm" className="w-full justify-start text-left text-xs">
                                                Advanced {module.name}
                                              </Button>
                                              <Button variant="ghost" size="sm" className="w-full justify-start text-left text-xs">
                                                High-Efficiency {module.name}
                                              </Button>
                                            </div>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                      )}

                      {scenario.modules.added.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Added Modules</p>
                          <div className="flex flex-wrap gap-2">
                            {scenario.modules.added.map(module => (
                              <HoverCard key={module.id}>
                                <HoverCardTrigger>
                                  <Badge 
                                    variant="outline" 
                                    className={getModuleBadgeColor('added')}
                                  >
                                    {getModuleStatusIcon('added')} {module.name} {module.count ? `× ${module.count}` : ''}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">{module.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {module.count ? `${module.count} units added to scenario` : 'Added to scenario'}
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" size="sm" className="text-xs text-red-600">
                                        <Minus className="h-3 w-3 mr-1" /> Remove
                                      </Button>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                      )}

                      {scenario.modules.swapped.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Replaced Modules</p>
                          <div className="flex flex-wrap gap-2">
                            {scenario.modules.swapped.map(module => (
                              <HoverCard key={module.id}>
                                <HoverCardTrigger>
                                  <Badge 
                                    variant="outline" 
                                    className={getModuleBadgeColor('swapped')}
                                  >
                                    {getModuleStatusIcon('swapped')} {module.name} → {module.newModule}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">{module.newModule}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      Replaced {module.name} with improved version
                                    </p>
                                    {module.benefits && (
                                      <div className="bg-blue-50 p-2 rounded text-xs">
                                        <span className="font-medium">Benefits:</span> {module.benefits}
                                      </div>
                                    )}
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" size="sm" className="text-xs">
                                        <RefreshCw className="h-3 w-3 mr-1" /> Revert
                                      </Button>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                      )}

                      {scenario.modules.removed.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Removed Modules</p>
                          <div className="flex flex-wrap gap-2">
                            {scenario.modules.removed.map(module => (
                              <HoverCard key={module.id}>
                                <HoverCardTrigger>
                                  <Badge 
                                    variant="outline" 
                                    className={getModuleBadgeColor('removed')}
                                  >
                                    {getModuleStatusIcon('removed')} {module.name}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">{module.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      Removed from scenario
                                    </p>
                                    {module.reason && (
                                      <div className="bg-red-50 p-2 rounded text-xs">
                                        <span className="font-medium">Reason:</span> {module.reason}
                                      </div>
                                    )}
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" size="sm" className="text-xs">
                                        <Plus className="h-3 w-3 mr-1" /> Restore
                                      </Button>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                        </div>
                      )}

                      {scenario.modules.added.length === 0 && 
                       scenario.modules.swapped.length === 0 && 
                       scenario.modules.removed.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">
                          No module changes in this scenario. Only parameter adjustments.
                        </p>
                      )}
                    </div>
                  </div>

                  {scenarioResults[scenario.id] && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Scenario Results</h3>
                        <p className="text-xs text-muted-foreground">
                          Run at {scenarioResults[scenario.id].timestamp}
                        </p>
                      </div>

                      <Alert className={getAlertVariant(scenarioResults[scenario.id].insight.type)}>
                        <div className="flex items-start">
                          {getAlertIcon(scenarioResults[scenario.id].insight.type)}
                          <div className="ml-3">
                            <AlertTitle className="text-sm font-medium">
                              {scenarioResults[scenario.id].insight.type === "success" ? "Positive Impact" : 
                               scenarioResults[scenario.id].insight.type === "warning" ? "Potential Risk" : 
                               "Analysis Complete"}
                            </AlertTitle>
                            <AlertDescription className="text-sm mt-1">
                              {scenarioResults[scenario.id].insight.message}
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-3">Financial Metrics Comparison</h4>
                        <UITable>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead>Baseline</TableHead>
                              <TableHead>Scenario</TableHead>
                              <TableHead>Change</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {scenarioResults[scenario.id].financialMetrics.map((metric, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{metric.metric}</TableCell>
                                <TableCell>{metric.baseline}</TableCell>
                                <TableCell className="font-medium">{metric.scenario}</TableCell>
                                <TableCell>
                                  <div className={`flex items-center ${
                                    metric.direction === "up" ? 
                                      (metric.metric === "Payback Period" || metric.metric === "LCOE" || metric.metric === "LCOH" ? 
                                        "text-red-500" : "text-eco-600") : 
                                    metric.direction === "down" ? 
                                      (metric.metric === "Payback Period" || metric.metric === "LCOE" || metric.metric === "LCOH" ? 
                                        "text-eco-600" : "text-red-500") : 
                                    ""
                                  }`}>
                                    {metric.direction === "up" && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                                    {metric.direction === "down" && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                                    {metric.delta}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </UITable>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <BarChart2 className="h-4 w-4 mr-2" />
                          Run Sensitivity Analysis
                        </Button>
                        <Button variant="outline" size="sm">
                          <GitBranch className="h-4 w-4 mr-2" />
                          Compare with Other Scenarios
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Export Results
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Templates</CardTitle>
              <CardDescription>
                Pre-defined templates that can be applied to any project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {templateData.map((template, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {template.type}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {template.parameters} parameters
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="collections" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Scenario Collections</CardTitle>
                  <CardDescription>Group related scenarios for batch analysis</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Collection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-6 text-center">
                <GitGraph className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No Collections Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create collections to group related scenarios for more comprehensive analysis
                </p>
                <Button className="mt-4">Create Your First Collection</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddModuleDialog} onOpenChange={setShowAddModuleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Module to Scenario</DialogTitle>
            <DialogDescription>
              Select a module to add to your scenario. This will only affect the scenario, not the baseline project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {availableModules.map(module => (
                <div key={module.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="bg-eco-100 p-2 rounded-full">
                    <div className="h-4 w-4 bg-eco-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{module.name}</h4>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {module.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {module.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="self-center">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModuleDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Custom Module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewScenarioDialog
        open={showNewScenarioDialog}
        onOpenChange={setShowNewScenarioDialog}
        availableModules={availableModules}
        projectName="Green Hydrogen Plant"
        onCreateScenario={handleCreateScenario}
      />
    </div>
  );
};

export default Scenarios;
