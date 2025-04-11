import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Copy, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
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
              {[
                { name: "Green Hydrogen Plant", completion: 78, status: "Active", type: "Hydrogen" },
                { name: "Solar + Storage", completion: 92, status: "Active", type: "Solar" },
                { name: "E-Fuel Production", completion: 64, status: "Draft", type: "E-fuels" },
                { name: "SAF Refinery", completion: 81, status: "Active", type: "SAF" },
              ].map((project) => (
                <div key={project.name} className="flex items-center justify-between p-3 border rounded-md">
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
    </div>
  );
};

export default Projects;
