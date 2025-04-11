
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Copy, Trash2, ArrowUpDown, BarChart, LineChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data for the projects
const projectsData = [
  { id: 1, name: "Green Hydrogen Plant", completion: 78, status: "Active", type: "Hydrogen", irr: 12.4, npv: 3.8, payback: 4.2, co2Reduction: 15000 },
  { id: 2, name: "Solar + Storage", completion: 92, status: "Active", type: "Solar", irr: 15.1, npv: 5.2, payback: 3.5, co2Reduction: 8000 },
  { id: 3, name: "E-Fuel Production", completion: 64, status: "Draft", type: "E-fuels", irr: 9.8, npv: 2.1, payback: 5.6, co2Reduction: 12000 },
  { id: 4, name: "SAF Refinery", completion: 81, status: "Active", type: "SAF", irr: 11.3, npv: 4.5, payback: 4.8, co2Reduction: 18000 },
];

// Configuration for the chart colors
const chartConfig = {
  irr: { label: "IRR (%)", theme: { light: "#4ade80" } },
  npv: { label: "NPV ($M)", theme: { light: "#60a5fa" } },
  payback: { label: "Payback (Years)", theme: { light: "#f97316" } },
  co2Reduction: { label: "CO2 Reduction (tons)", theme: { light: "#8b5cf6" } },
};

const Projects: React.FC = () => {
  const [kpiView, setKpiView] = useState<'table' | 'chart'>('chart');
  const [selectedKPI, setSelectedKPI] = useState<'irr' | 'npv' | 'payback' | 'co2Reduction'>('irr');

  // Chart data preparation
  const getChartData = () => {
    if (kpiView === 'chart') {
      return projectsData.map(project => ({
        name: project.name,
        [selectedKPI]: project[selectedKPI],
      }));
    }
    return [];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and monitor your bankability projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="search" placeholder="Search projects..." className="max-w-md" />
          <Button className="eco-gradient">+ New Project</Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="mt-6">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Projects</CardTitle>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date Created</SelectItem>
                      <SelectItem value="score">Bankability Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsData.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                          project.status === "Active" ? "bg-eco-100 text-eco-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {project.status}
                        </span>
                        <div className="flex items-center mt-1">
                          <span className="text-sm mr-2">Completion:</span>
                          <span className="text-sm font-medium">{project.completion}%</span>
                        </div>
                        
                        <Progress 
                          value={project.completion} 
                          className="h-2 bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full mt-2">Load More Projects</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    This section could contain a summary of all projects, key metrics, and overall status.
                    Consider adding charts or graphs to visualize project data.
                  </p>
                  <div className="border rounded-md p-4 bg-muted">
                    <h4 className="font-medium">Total Projects: 4</h4>
                    <p className="text-sm text-muted-foreground">
                      Active: 3, Draft: 1
                    </p>
                  </div>
                  <div className="border rounded-md p-4 bg-muted">
                    <h4 className="font-medium">Average Completion: 79%</h4>
                    <Progress value={79} className="h-2 bg-gray-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="kpis" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Project Key Performance Indicators</h2>
                <p className="text-muted-foreground">Compare performance metrics across all projects</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2 rounded-md border p-1">
                  <Button 
                    variant={kpiView === 'chart' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setKpiView('chart')}
                    className="gap-1"
                  >
                    <BarChart className="h-4 w-4" />
                    Chart
                  </Button>
                  <Button 
                    variant={kpiView === 'table' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setKpiView('table')}
                    className="gap-1"
                  >
                    <LineChart className="h-4 w-4" />
                    Table
                  </Button>
                </div>
                <Select value={selectedKPI} onValueChange={(value: any) => setSelectedKPI(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="irr">IRR (%)</SelectItem>
                    <SelectItem value="npv">NPV ($M)</SelectItem>
                    <SelectItem value="payback">Payback Period (Years)</SelectItem>
                    <SelectItem value="co2Reduction">CO2 Reduction (tons)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {kpiView === 'table' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project KPI Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            IRR (%)
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            NPV ($M)
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Payback (Years)
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            CO2 Reduction (tons)
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectsData.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>{project.irr}%</TableCell>
                          <TableCell>${project.npv}M</TableCell>
                          <TableCell>{project.payback} years</TableCell>
                          <TableCell>{project.co2Reduction.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{chartConfig[selectedKPI].label} by Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ChartContainer config={chartConfig}>
                      <RechartsBarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey={selectedKPI} fill={`var(--color-${selectedKPI})`} name={chartConfig[selectedKPI].label} />
                      </RechartsBarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>KPI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Average IRR</p>
                    <h3 className="text-2xl font-bold mt-1">12.15%</h3>
                    <p className="text-xs text-green-600 mt-1">+2.3% above target</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Average NPV</p>
                    <h3 className="text-2xl font-bold mt-1">$3.9M</h3>
                    <p className="text-xs text-green-600 mt-1">+$0.4M above target</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Average Payback</p>
                    <h3 className="text-2xl font-bold mt-1">4.5 years</h3>
                    <p className="text-xs text-amber-600 mt-1">0.5 years above target</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Total CO2 Reduction</p>
                    <h3 className="text-2xl font-bold mt-1">53,000 tons</h3>
                    <p className="text-xs text-green-600 mt-1">+8,000 tons above target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
