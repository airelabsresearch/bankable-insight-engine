
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3, FileSpreadsheet, GitBranch, ShieldCheck, Package, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bankability Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze and improve the bankability of your energy infrastructure projects
          </p>
        </div>
        <Button className="eco-gradient">+ New Project</Button>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-value">7</div>
            <p className="stats-label flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-eco-600 mr-1" />
              <span className="text-eco-600">+2</span> this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Scenarios Created</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-value">24</div>
            <p className="stats-label flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-eco-600 mr-1" />
              <span className="text-eco-600">+8</span> this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Analysis</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-value">12</div>
            <p className="stats-label flex items-center mt-1">
              <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-orange-500">-3</span> from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Models Uploaded</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="stats-value">18</div>
            <p className="stats-label flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-eco-600 mr-1" />
              <span className="text-eco-600">+5</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Green Hydrogen Plant", score: 78, status: "Active", type: "Hydrogen" },
                { name: "Solar + Storage", score: 92, status: "Active", type: "Solar" },
                { name: "E-Fuel Production", score: 64, status: "Draft", type: "E-fuels" },
                { name: "SAF Refinery", score: 81, status: "Active", type: "SAF" },
              ].map((project) => (
                <div key={project.name} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.type}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                      project.status === "Active" ? "bg-eco-100 text-eco-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {project.status}
                    </span>
                    <div className="flex items-center mt-1">
                      <span className="text-sm mr-2">Bankability:</span>
                      <span className={`text-sm font-medium ${
                        project.score >= 80 ? "text-eco-600" : 
                        project.score >= 60 ? "text-amber-500" : "text-red-500"
                      }`}>
                        {project.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Link to="/projects">
                <Button variant="ghost" className="w-full mt-2">View All Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Bankability Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Technology Readiness", value: 85 },
                { name: "Financial Performance", value: 72 },
                { name: "Market & Offtake", value: 68 },
                { name: "Team Experience", value: 90 },
                { name: "Policy & Permitting", value: 65 },
              ].map((metric) => (
                <div key={metric.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{metric.name}</span>
                    <span className="font-medium">{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Bankability Score</span>
                  <span className="text-lg font-bold text-bankable-700">76%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  8% higher than industry average for similar projects
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/upload">
                <Button variant="outline" className="w-full h-full py-8 flex flex-col items-center justify-center space-y-2">
                  <FileSpreadsheet className="h-8 w-8 text-bankable-600" />
                  <span>Upload Model</span>
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="w-full h-full py-8 flex flex-col items-center justify-center space-y-2">
                  <Box className="h-8 w-8 text-bankable-600" />
                  <span>View Projects</span>
                </Button>
              </Link>
              <Link to="/scenarios">
                <Button variant="outline" className="w-full h-full py-8 flex flex-col items-center justify-center space-y-2">
                  <GitBranch className="h-8 w-8 text-bankable-600" />
                  <span>Manage Scenarios</span>
                </Button>
              </Link>
              <Link to="/risk">
                <Button variant="outline" className="w-full h-full py-8 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="h-8 w-8 text-bankable-600" />
                  <span>Risk Analysis</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
