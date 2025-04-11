
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, Plus, GitMerge, GitGraph, Table, BarChart2, Copy, Trash2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

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
    ]
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
    ]
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
    ]
  },
  {
    id: 4,
    name: "Market Downturn",
    description: "Decreased demand and market prices",
    type: "Market",
    project: "E-Fuel Production",
    changes: [
      { parameter: "Product Price", baseline: "$8.50/kg", scenario: "$6.25/kg" },
      { parameter: "Demand Growth", baseline: "8% p.a.", scenario: "3% p.a." },
      { parameter: "Capacity Factor", baseline: "90%", scenario: "75%" }
    ]
  }
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
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scenario Management</h1>
          <p className="text-muted-foreground">
            Create and analyze different scenarios for your projects
          </p>
        </div>
        <Button className="eco-gradient">
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
            {scenariosData.map((scenario) => (
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
                      <Button variant="outline" size="sm">
                        <GitMerge className="mr-2 h-4 w-4" />
                        Run Scenario
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
                          // Simple logic to calculate change direction
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
    </div>
  );
};

export default Scenarios;
