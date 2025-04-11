
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, Filter, ArrowUpDown, Eye, Edit, Trash2, 
  Download, Share2, MoreHorizontal, FileSpreadsheet, Calendar 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const projectData = [
  { 
    id: 1,
    name: "Green Hydrogen Plant",
    type: "Hydrogen",
    location: "California, USA",
    score: 78,
    status: "Active",
    lastUpdated: "2025-03-25",
    model: "Hydrogen-TEA-v3.xlsx"
  },
  { 
    id: 2,
    name: "Solar + Storage",
    type: "Solar",
    location: "Arizona, USA",
    score: 92,
    status: "Active",
    lastUpdated: "2025-04-02",
    model: "SolarStorage-PF-v2.xlsx"
  },
  { 
    id: 3,
    name: "E-Fuel Production",
    type: "E-fuels",
    location: "Texas, USA",
    score: 64,
    status: "Draft",
    lastUpdated: "2025-03-15",
    model: "eFuels-Model-v1.xlsx"
  },
  { 
    id: 4,
    name: "SAF Refinery",
    type: "SAF",
    location: "Washington, USA",
    score: 81,
    status: "Active",
    lastUpdated: "2025-03-28",
    model: "SAF-Finance-v4.xlsx"
  },
  { 
    id: 5,
    name: "Battery Storage Facility",
    type: "Storage",
    location: "Nevada, USA",
    score: 87,
    status: "Active",
    lastUpdated: "2025-04-05",
    model: "Battery-Economics-v2.xlsx"
  },
  { 
    id: 6,
    name: "DAC Installation",
    type: "Carbon Capture",
    location: "Colorado, USA",
    score: 59,
    status: "Draft",
    lastUpdated: "2025-03-10",
    model: "DAC-Financial-v1.xlsx"
  },
  { 
    id: 7,
    name: "Low-Carbon Cement Plant",
    type: "Green Materials",
    location: "Michigan, USA",
    score: 72,
    status: "Active",
    lastUpdated: "2025-03-20",
    model: "Cement-TEA-v2.xlsx"
  }
];

const Projects: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and analyze your energy infrastructure projects
          </p>
        </div>
        <Button className="eco-gradient">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8 w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bankability Score</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectData.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{project.name}</span>
                            <span className="text-xs text-muted-foreground">{project.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{project.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              project.status === "Active"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : project.status === "Draft"
                                ? "border-amber-500 text-amber-700 bg-amber-50"
                                : "border-gray-500 text-gray-700 bg-gray-50"
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={project.score} 
                              className="h-2 w-24" 
                              indicatorClassName={`${
                                project.score >= 80 ? "bg-green-500" : 
                                project.score >= 60 ? "bg-amber-500" : "bg-red-500"
                              }`}
                            />
                            <span className="text-sm">{project.score}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {project.lastUpdated}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileSpreadsheet className="h-3 w-3" />
                            {project.model}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  <span>Export</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Display active projects here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="draft" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Display draft projects here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="archived" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Display archived projects here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
