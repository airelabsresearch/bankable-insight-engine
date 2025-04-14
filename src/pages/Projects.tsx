
import React, { useState } from 'react';
import { PlusCircle, Search, SlidersHorizontal, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Chart } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const chartConfig = {
  irr: { 
    label: 'IRR', 
    theme: { 
      light: '#2563eb',
      dark: '#3b82f6' 
    } 
  },
  npv: { 
    label: 'NPV', 
    theme: { 
      light: '#16a34a',
      dark: '#22c55e' 
    } 
  },
  payback: { 
    label: 'Payback Period', 
    theme: { 
      light: '#ea580c',
      dark: '#f97316' 
    } 
  },
  co2Reduction: { 
    label: 'CO2 Reduction', 
    theme: { 
      light: '#7c3aed',
      dark: '#8b5cf6' 
    } 
  }
};

// Sample project data
const projects = [
  {
    id: 1,
    name: 'Solar Farm - Phase 1',
    location: 'Arizona, USA',
    capacity: '50 MW',
    technology: 'Solar PV',
    developer: 'SunPower Inc.',
    status: 'Active',
    progress: 75,
    lastUpdated: '2025-04-10',
    roi: 12.7,
    metrics: {
      irr: 15.2,
      npv: 24.5,
      payback: 5.3,
      co2Reduction: 42.8
    },
    tags: ['Renewable', 'Solar', 'Utility-Scale']
  },
  {
    id: 2,
    name: 'Offshore Wind Farm',
    location: 'North Sea, UK',
    capacity: '300 MW',
    technology: 'Wind',
    developer: 'WindForce Ltd.',
    status: 'Planning',
    progress: 30,
    lastUpdated: '2025-04-08',
    roi: 9.5,
    metrics: {
      irr: 11.8,
      npv: 86.2,
      payback: 7.1,
      co2Reduction: 127.4
    },
    tags: ['Renewable', 'Wind', 'Offshore']
  },
  {
    id: 3,
    name: 'Hydroelectric Dam Upgrade',
    location: 'Quebec, Canada',
    capacity: '150 MW',
    technology: 'Hydro',
    developer: 'HydroQuebec',
    status: 'Review',
    progress: 50,
    lastUpdated: '2025-04-12',
    roi: 8.2,
    metrics: {
      irr: 9.7,
      npv: 42.3,
      payback: 8.5,
      co2Reduction: 63.1
    },
    tags: ['Renewable', 'Hydro', 'Refurbishment']
  },
  {
    id: 4,
    name: 'Geothermal Plant',
    location: 'Iceland',
    capacity: '75 MW',
    technology: 'Geothermal',
    developer: 'GeoIce Energy',
    status: 'Active',
    progress: 90,
    lastUpdated: '2025-04-05',
    roi: 11.3,
    metrics: {
      irr: 13.5,
      npv: 37.8,
      payback: 6.2,
      co2Reduction: 52.9
    },
    tags: ['Renewable', 'Geothermal']
  },
  {
    id: 5,
    name: 'Battery Storage Facility',
    location: 'California, USA',
    capacity: '100 MWh',
    technology: 'Li-ion Storage',
    developer: 'StorageTech',
    status: 'Planning',
    progress: 15,
    lastUpdated: '2025-04-11',
    roi: 10.8,
    metrics: {
      irr: 12.4,
      npv: 18.6,
      payback: 5.8,
      co2Reduction: 34.2
    },
    tags: ['Storage', 'Energy Storage', 'Grid Support']
  }
];

const ProjectCard = ({ project }: { project: any }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Planning': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="mr-2">{project.location}</span>
              <Badge variant="outline" className="ml-2">
                {project.capacity}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {project.technology}
              </Badge>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-28">
          <Chart
            type="bar"
            series={[
              {
                name: "Metrics",
                data: [
                  project.metrics.irr,
                  project.metrics.npv / 10, // Scale down for visualization
                  project.metrics.payback,
                  project.metrics.co2Reduction / 10 // Scale down for visualization
                ]
              }
            ]}
            categories={["IRR (%)", "NPV ($M)", "Payback (Yrs)", "CO2 (kt)"]}
            height={100}
            colors={["#6366f1"]}
            className="mt-2"
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {project.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between text-sm text-muted-foreground">
        <div>
          Updated: {project.lastUpdated}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="h-auto p-0 font-medium text-primary">
            {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </CardFooter>
      {showDetails && (
        <div className="px-6 pb-4">
          <div className="border rounded-md p-3 bg-muted/50">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Developer</div>
                <div className="font-medium">{project.developer}</div>
              </div>
              <div>
                <div className="text-muted-foreground">ROI</div>
                <div className="font-medium">{project.roi}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">IRR</div>
                <div className="font-medium">{project.metrics.irr}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">NPV</div>
                <div className="font-medium">${project.metrics.npv}M</div>
              </div>
              <div>
                <div className="text-muted-foreground">Payback Period</div>
                <div className="font-medium">{project.metrics.payback} years</div>
              </div>
              <div>
                <div className="text-muted-foreground">CO2 Reduction</div>
                <div className="font-medium">{project.metrics.co2Reduction} kt/year</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const Projects = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectView, setProjectView] = useState("grid");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your project portfolio and monitor performance metrics.
          </p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-end">
          <div className="flex-1 md:w-80">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-8"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>
                <span>Status: Active</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Type: Renewable</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Location: All</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>
                <span>Name (A-Z)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Date (Newest)</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>ROI (Highest)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={projectView === "grid" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setProjectView("grid")}
            className="h-8 w-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
            </svg>
          </Button>
          <Button
            variant={projectView === "list" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setProjectView("list")}
            className="h-8 w-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new project to your portfolio.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="Solar Farm - Phase 2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="technology">Technology</Label>
                <Select>
                  <SelectTrigger id="technology">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Solar PV</SelectItem>
                    <SelectItem value="wind">Wind</SelectItem>
                    <SelectItem value="hydro">Hydro</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="California, USA" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" placeholder="100 MW" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
