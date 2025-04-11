
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, GitBranch, ShieldAlert, Sigma, ArrowUpDown, 
  SlidersHorizontal, History, Clipboard, Plus, BarChart2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import SensitivityAnalysisDialog from '@/components/risk/SensitivityAnalysisDialog';

const RiskAnalysis: React.FC = () => {
  const [sensAnalysisOpen, setSensAnalysisOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Analysis</h1>
          <p className="text-muted-foreground">
            Analyze, quantify, and mitigate project risks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="hydrogen">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hydrogen">Green Hydrogen Plant</SelectItem>
              <SelectItem value="solar">Solar + Storage</SelectItem>
              <SelectItem value="efuel">E-Fuel Production</SelectItem>
              <SelectItem value="saf">SAF Refinery</SelectItem>
            </SelectContent>
          </Select>
          <Button className="eco-gradient">Run Analysis</Button>
        </div>
      </div>

      <Tabs defaultValue="toolkit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="toolkit">Analysis Toolkit</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
          <TabsTrigger value="montecarlo">Monte Carlo</TabsTrigger>
          <TabsTrigger value="register">Risk Register</TabsTrigger>
        </TabsList>

        <TabsContent value="toolkit" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSensAnalysisOpen(true)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Sensitivity Analysis</CardTitle>
                  <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Identify key input drivers that impact project outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Button className="w-full" onClick={() => setSensAnalysisOpen(true)}>
                    Run Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Monte Carlo Simulation</CardTitle>
                  <Sigma className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Probabilistic analysis with thousands of simulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Button className="w-full" asChild>
                    <a href="#montecarlo">Run Simulation</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Scenario Analysis</CardTitle>
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Compare defined what-if scenarios side by side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Button className="w-full" variant="outline">Run Comparison</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Risk Register</CardTitle>
                  <Clipboard className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Track identified risks and mitigation strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Button className="w-full" asChild>
                    <a href="#register">View Register</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">QRA Assessment</CardTitle>
                  <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Quantitative risk assessment to estimate financial exposure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Button className="w-full" variant="outline">Run QRA</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Reference Class Forecasting</CardTitle>
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  Compare to historical outcomes of similar projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <Button className="w-full" variant="outline">Start Comparison</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sensitivity" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <CardTitle>Sensitivity Analysis</CardTitle>
                  <CardDescription className="mt-1">
                    Analyze how changes in inputs affect key model outputs
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select defaultValue="irr">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Output metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irr">Project IRR</SelectItem>
                      <SelectItem value="npv">NPV</SelectItem>
                      <SelectItem value="lcoe">LCOE</SelectItem>
                      <SelectItem value="payback">Payback Period</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="eco-gradient">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Run Analysis
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="col-span-2 md:col-span-1">
                    <Label className="text-sm font-medium" htmlFor="range">Sensitivity Range</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input id="range" type="number" className="w-20 text-center" defaultValue={20} />
                      <span className="text-sm text-muted-foreground">%</span>
                      <span className="text-sm text-muted-foreground px-2">±</span>
                      <span className="text-sm">Base Case: 15.2% IRR</span>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <Label className="text-sm font-medium" htmlFor="params">Parameters to Test</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input id="params" type="number" className="w-20 text-center" defaultValue={8} />
                      <Button variant="outline" size="sm">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Parameter
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">IRR Sensitivity</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Hydrogen Price", impact: 85 },
                      { name: "Electrolyzer CAPEX", impact: -62 },
                      { name: "Electricity Price", impact: -58 },
                      { name: "Capacity Factor", impact: 45 },
                      { name: "Stack Efficiency", impact: 40 },
                      { name: "Stack Replacement", impact: -35 },
                      { name: "Tax Credits", impact: 30 },
                      { name: "O&M Costs", impact: -25 },
                    ].map((param, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{param.name}</span>
                          <span className={`font-medium ${param.impact > 0 ? 'text-eco-600' : 'text-red-500'}`}>
                            {param.impact > 0 ? '+' : ''}{param.impact}% change in IRR
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${param.impact > 0 ? 'bg-eco-500' : 'bg-red-500'}`} 
                            style={{ 
                              width: `${Math.abs(param.impact)}%`,
                              marginLeft: param.impact < 0 ? 'auto' : '0',
                              transform: param.impact < 0 ? 'scaleX(-1)' : 'none'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground italic">
                    Tornado chart showing impact of ±20% change in each parameter on Project IRR
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="montecarlo" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <CardTitle>Monte Carlo Simulation</CardTitle>
                  <CardDescription className="mt-1">
                    Probabilistic analysis with 10,000 iterations
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select defaultValue="irr">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Output metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irr">Project IRR</SelectItem>
                      <SelectItem value="npv">NPV</SelectItem>
                      <SelectItem value="lcoe">LCOE</SelectItem>
                      <SelectItem value="payback">Payback Period</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="eco-gradient">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Run Simulation
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-6 rounded-lg flex flex-col items-center justify-center">
                  <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Simulation Results Yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 text-center max-w-md">
                    Run a Monte Carlo simulation to see probability distributions of key model outputs
                  </p>
                  <Button className="mt-4">Run Simulation</Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Distribution Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Simulation Iterations:</span>
                          <span className="font-medium">10,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Random Variables:</span>
                          <span className="font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distribution Types:</span>
                          <span className="font-medium">Normal, Triangle, PERT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Confidence Level:</span>
                          <span className="font-medium">95%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Key Variables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {[
                          { name: "Hydrogen Price", dist: "Triangle", min: "$3.50/kg", max: "$7.50/kg" },
                          { name: "Electricity Price", dist: "Normal", min: "$45/MWh", max: "$85/MWh" },
                          { name: "CAPEX", dist: "PERT", min: "-20%", max: "+35%" },
                        ].map((variable, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span>{variable.name}</span>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 text-xs">
                                {variable.dist}
                              </Badge>
                              <span>{variable.min} to {variable.max}</span>
                            </div>
                          </div>
                        ))}
                        <Button variant="link" size="sm" className="text-xs mt-1 h-6 px-0">
                          View all 12 variables
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <CardTitle>Risk Register</CardTitle>
                  <CardDescription className="mt-1">
                    Track, categorize and mitigate project risks
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Risk
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-3 text-left text-sm font-medium">Risk Factor</th>
                      <th className="p-3 text-left text-sm font-medium">Category</th>
                      <th className="p-3 text-left text-sm font-medium">Probability</th>
                      <th className="p-3 text-left text-sm font-medium">Impact</th>
                      <th className="p-3 text-left text-sm font-medium">Risk Score</th>
                      <th className="p-3 text-left text-sm font-medium">Mitigation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        risk: "Electrolyzer cost overrun",
                        category: "CAPEX",
                        probability: "Medium",
                        impact: "High",
                        score: 12,
                        mitigation: "Fixed price contract with contingency"
                      },
                      {
                        risk: "Renewable electricity price volatility",
                        category: "OPEX",
                        probability: "High",
                        impact: "High",
                        score: 16,
                        mitigation: "Long-term PPA with price ceiling"
                      },
                      {
                        risk: "Delayed construction timeline",
                        category: "Schedule",
                        probability: "Medium",
                        impact: "Medium",
                        score: 9,
                        mitigation: "Experienced EPC with performance guarantees"
                      },
                      {
                        risk: "Hydrogen offtake uncertainty",
                        category: "Market",
                        probability: "Medium",
                        impact: "High",
                        score: 12,
                        mitigation: "Pre-signed offtake agreements with floor price"
                      },
                      {
                        risk: "Policy support reduction",
                        category: "Policy",
                        probability: "Low",
                        impact: "High",
                        score: 8,
                        mitigation: "Grandfathering provisions in project economics"
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">
                          <div className="font-medium text-sm">{item.risk}</div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant="outline"
                            className={`${
                              item.probability === "High" ? "bg-red-50 text-red-700 border-red-200" :
                              item.probability === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {item.probability}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant="outline"
                            className={`${
                              item.impact === "High" ? "bg-red-50 text-red-700 border-red-200" :
                              item.impact === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {item.impact}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              item.score >= 12 ? "text-red-600" :
                              item.score >= 8 ? "text-amber-600" :
                              "text-green-600"
                            }`}>
                              {item.score}
                            </span>
                            <div className="ml-2 bg-gray-100 w-10 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  item.score >= 12 ? "bg-red-500" :
                                  item.score >= 8 ? "bg-amber-500" :
                                  "bg-green-500"
                                }`} 
                                style={{ width: `${(item.score / 16) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{item.mitigation}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sensitivity Analysis Dialog */}
      <SensitivityAnalysisDialog 
        open={sensAnalysisOpen} 
        onOpenChange={setSensAnalysisOpen} 
      />
    </div>
  );
};

export default RiskAnalysis;
