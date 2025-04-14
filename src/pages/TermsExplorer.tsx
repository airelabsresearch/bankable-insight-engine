
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Tag, 
  Filter, 
  Edit2, 
  X,
  Save,
  Layers,
  Folder
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormSection
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { TermCategoryCard } from "@/components/terms/TermCategoryCard";
import { TermItem } from "@/components/terms/TermItem";
import { CreateCategoryDialog } from "@/components/terms/CreateCategoryDialog";
import { TermsFilters } from "@/components/terms/TermsFilters";

// Mock data for the terms explorer
const mockTerms = [
  {
    "term": "Solar CapEx",
    "value": 950,
    "unit": "$/kW",
    "type": "numeric",
    "source": "manual",
    "tags": ["solar", "cost"],
    "categories": ["Solar > Cost", "CapEx > Technology"],
    "description": "Capital expenditure for solar PV installation per kilowatt"
  },
  {
    "term": "Electrolyzer Size",
    "value": 25,
    "unit": "MW",
    "type": "numeric",
    "source": "derived",
    "tags": ["hydrogen", "capacity"],
    "categories": ["Hydrogen > Technical"],
    "description": "Total capacity of hydrogen electrolyzer system"
  },
  {
    "term": "Inflation Rate",
    "value": 2.5,
    "unit": "%",
    "type": "shared",
    "source": "manual",
    "usedIn": ["O&M", "CapEx Escalation", "Revenue Growth"],
    "tags": ["macro", "policy-sensitive"],
    "categories": ["Financials > Macro", "O&M > Escalators"],
    "description": "Annual inflation rate used in financial calculations"
  },
  {
    "term": "Battery Efficiency",
    "value": 92,
    "unit": "%",
    "type": "numeric",
    "source": "manual",
    "tags": ["battery", "efficiency"],
    "categories": ["Battery > Technical"],
    "description": "Round-trip efficiency of battery storage system"
  },
  {
    "term": "Debt Ratio",
    "value": 70,
    "unit": "%",
    "type": "numeric",
    "source": "manual",
    "tags": ["financing", "capital structure"],
    "categories": ["Financing > Structure"],
    "description": "Portion of project financed with debt vs. equity"
  },
  {
    "term": "Electrolyzer Efficiency",
    "value": 65,
    "unit": "%",
    "type": "numeric",
    "source": "manual",
    "tags": ["hydrogen", "efficiency"],
    "categories": ["Hydrogen > Technical"],
    "description": "Conversion efficiency of the electrolyzer system"
  },
  {
    "term": "Battery CAPEX",
    "value": 275,
    "unit": "$/kWh",
    "type": "numeric",
    "source": "manual",
    "tags": ["battery", "cost"],
    "categories": ["Battery > Cost", "CapEx > Technology"],
    "description": "Capital cost per kilowatt-hour of battery storage"
  },
  {
    "term": "PPA Price",
    "value": 42,
    "unit": "$/MWh",
    "type": "numeric",
    "source": "manual",
    "tags": ["revenue", "contract"],
    "categories": ["Revenue > Power"],
    "description": "Power purchase agreement price per megawatt-hour"
  },
  {
    "term": "PTC Value",
    "value": 26,
    "unit": "$/MWh",
    "type": "numeric",
    "source": "manual",
    "tags": ["incentive", "policy"],
    "categories": ["Policy > Incentives", "Revenue > Subsidies"],
    "description": "Production tax credit value per megawatt-hour"
  },
  {
    "term": "ITC Rate",
    "value": 30,
    "unit": "%",
    "type": "numeric",
    "source": "manual",
    "tags": ["incentive", "policy", "tax"],
    "categories": ["Policy > Incentives", "Tax > Credits"],
    "description": "Investment tax credit percentage"
  },
  {
    "term": "WACC",
    "value": 7.5,
    "unit": "%",
    "type": "derived",
    "source": "calculated",
    "tags": ["financing", "returns"],
    "categories": ["Financing > Returns"],
    "description": "Weighted average cost of capital"
  },
  {
    "term": "Degradation Rate",
    "value": 0.5,
    "unit": "%/year",
    "type": "numeric",
    "source": "manual",
    "tags": ["solar", "performance"],
    "categories": ["Solar > Technical"],
    "description": "Annual degradation rate of solar panel output"
  },
  {
    "term": "Battery Cycles",
    "value": 4000,
    "unit": "cycles",
    "type": "numeric",
    "source": "manual",
    "tags": ["battery", "technical"],
    "categories": ["Battery > Technical"],
    "description": "Total battery cycle life before replacement"
  },
  {
    "term": "O&M Cost - Solar",
    "value": 12,
    "unit": "$/kW/year",
    "type": "numeric",
    "source": "manual",
    "tags": ["solar", "opex"],
    "categories": ["Solar > OpEx", "O&M > Technology"],
    "description": "Annual operations and maintenance cost for solar"
  },
  {
    "term": "O&M Cost - Battery",
    "value": 8,
    "unit": "$/kWh/year",
    "type": "numeric",
    "source": "manual", 
    "tags": ["battery", "opex"],
    "categories": ["Battery > OpEx", "O&M > Technology"],
    "description": "Annual operations and maintenance cost for battery"
  },
  {
    "term": "Project Life",
    "value": 25,
    "unit": "years",
    "type": "numeric",
    "source": "manual",
    "tags": ["project", "financial"],
    "categories": ["Project > Structure", "Financing > Terms"],
    "description": "Expected operational lifetime of the project"
  },
  {
    "term": "Discount Rate",
    "value": 8.5,
    "unit": "%",
    "type": "numeric",
    "source": "manual",
    "tags": ["financial", "returns"],
    "categories": ["Financing > Returns"],
    "description": "Discount rate used for NPV calculations"
  },
  {
    "term": "Land Cost",
    "value": 5000,
    "unit": "$/acre",
    "type": "numeric",
    "source": "manual",
    "tags": ["land", "cost"],
    "categories": ["Project > Site", "CapEx > Land"],
    "description": "Cost per acre for project land acquisition"
  },
  {
    "term": "Carbon Credit Price",
    "value": 35,
    "unit": "$/ton",
    "type": "numeric",
    "source": "manual",
    "tags": ["carbon", "revenue"],
    "categories": ["Revenue > Carbon", "Policy > Carbon"],
    "description": "Market price for carbon credits"
  },
  {
    "term": "Debt Term",
    "value": 15,
    "unit": "years",
    "type": "numeric", 
    "source": "manual",
    "tags": ["debt", "financing"],
    "categories": ["Financing > Structure", "Financing > Terms"],
    "description": "Term length for project debt"
  }
];

// Mock category structure
const mockCategories = [
  {
    name: "Solar",
    icon: "Sun",
    subcategories: [
      { name: "Technical", icon: "Settings" },
      { name: "Cost", icon: "DollarSign" },
      { name: "OpEx", icon: "TrendingUp" }
    ]
  },
  {
    name: "Battery",
    icon: "Battery",
    subcategories: [
      { name: "Technical", icon: "Settings" },
      { name: "Cost", icon: "DollarSign" },
      { name: "OpEx", icon: "TrendingUp" }
    ]
  },
  {
    name: "Hydrogen",
    icon: "Droplets",
    subcategories: [
      { name: "Technical", icon: "Settings" },
      { name: "Cost", icon: "DollarSign" }
    ]
  },
  {
    name: "Financing",
    icon: "PiggyBank",
    subcategories: [
      { name: "Structure", icon: "LayoutGrid" },
      { name: "Terms", icon: "FileText" },
      { name: "Returns", icon: "TrendingUp" }
    ]
  },
  {
    name: "Revenue",
    icon: "DollarSign",
    subcategories: [
      { name: "Power", icon: "Zap" },
      { name: "Carbon", icon: "Leaf" },
      { name: "Subsidies", icon: "BadgeCheck" }
    ]
  },
  {
    name: "Policy",
    icon: "FileText",
    subcategories: [
      { name: "Incentives", icon: "Gift" },
      { name: "Carbon", icon: "Leaf" }
    ]
  },
  {
    name: "O&M",
    icon: "Tool",
    subcategories: [
      { name: "Technology", icon: "Settings" },
      { name: "Escalators", icon: "TrendingUp" }
    ]
  },
  {
    name: "CapEx",
    icon: "DollarSign",
    subcategories: [
      { name: "Technology", icon: "Cpu" },
      { name: "Land", icon: "Map" }
    ]
  },
  {
    name: "Project",
    icon: "Layers",
    subcategories: [
      { name: "Structure", icon: "LayoutGrid" },
      { name: "Site", icon: "MapPin" }
    ]
  }
];

// Define available tags for filtering
const availableTags = [
  { id: "solar", label: "Solar" },
  { id: "battery", label: "Battery" },
  { id: "hydrogen", label: "Hydrogen" },
  { id: "cost", label: "Cost" },
  { id: "financing", label: "Financing" },
  { id: "revenue", label: "Revenue" },
  { id: "efficiency", label: "Efficiency" },
  { id: "policy", label: "Policy" },
  { id: "incentive", label: "Incentive" },
  { id: "tax", label: "Tax" },
  { id: "technical", label: "Technical" },
  { id: "opex", label: "OpEx" },
  { id: "capex", label: "CapEx" },
  { id: "macro", label: "Macroeconomic" },
  { id: "carbon", label: "Carbon" }
];

const TermsExplorer: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<string | null>(null);
  const [terms, setTerms] = useState(mockTerms);
  const [categories, setCategories] = useState(mockCategories);
  
  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Initialize all categories as expanded
  useEffect(() => {
    const expandedState: Record<string, boolean> = {};
    categories.forEach(category => {
      expandedState[category.name] = true;
      category.subcategories.forEach(sub => {
        expandedState[`${category.name}>${sub.name}`] = true;
      });
    });
    setExpandedCategories(expandedState);
  }, [categories]);

  // Filter terms based on search query and filters
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tag filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => term.tags.includes(tag));
      
      // Type filter
      const matchesTypes = selectedTypes.length === 0 || 
        selectedTypes.includes(term.type);
      
      // Source filter
      const matchesSources = selectedSources.length === 0 || 
        selectedSources.includes(term.source);
      
      // Category filter
      const matchesCategory = !selectedCategory || 
        term.categories.some(cat => cat.startsWith(selectedCategory));
      
      return matchesSearch && matchesTags && matchesTypes && matchesSources && matchesCategory;
    });
  }, [terms, searchQuery, selectedTags, selectedTypes, selectedSources, selectedCategory]);

  // Group terms by category and subcategory
  const groupedTerms = useMemo(() => {
    const grouped: Record<string, Record<string, typeof mockTerms>> = {};
    
    // Initialize categories and subcategories
    categories.forEach(category => {
      grouped[category.name] = {};
      category.subcategories.forEach(sub => {
        grouped[category.name][sub.name] = [];
      });
    });
    
    // Group terms
    filteredTerms.forEach(term => {
      term.categories.forEach(categoryPath => {
        const [category, subcategory] = categoryPath.split(' > ');
        if (grouped[category] && grouped[category][subcategory]) {
          if (!grouped[category][subcategory].some(t => t.term === term.term)) {
            grouped[category][subcategory].push(term);
          }
        }
      });
    });
    
    return grouped;
  }, [filteredTerms, categories]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubcategory = (category: string, subcategory: string) => {
    const key = `${category}>${subcategory}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleEditTerm = (term: string, value: number | string) => {
    setTerms(prev => 
      prev.map(t => 
        t.term === term 
          ? { ...t, value } 
          : t
      )
    );
    setEditingTerm(null);
    
    toast({
      title: "Term updated",
      description: `${term} has been updated to ${value}${terms.find(t => t.term === term)?.unit}`,
    });
  };

  const handleCreateCategory = (categoryData: any) => {
    // In a real app, we would save this to a database
    toast({
      title: "Category created",
      description: `New category "${categoryData.name}" has been created`,
    });
    setCreateCategoryOpen(false);
  };

  const handleFilterByTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedTypes([]);
    setSelectedSources([]);
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Terms Explorer</h1>
        <p className="text-muted-foreground">
          Browse, filter, and edit all project parameters organized by category
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        {/* Search and filters row */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms, tags, or descriptions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <TermsFilters 
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedSources={selectedSources}
            setSelectedSources={setSelectedSources}
            availableTags={availableTags}
            clearFilters={clearFilters}
          />
          
          <div className="flex justify-end">
            <CreateCategoryDialog 
              open={createCategoryOpen}
              onOpenChange={setCreateCategoryOpen}
              onSave={handleCreateCategory}
              existingTerms={terms}
            />
          </div>
        </div>

        {/* Active filters display */}
        {(selectedTags.length > 0 || selectedTypes.length > 0 || selectedSources.length > 0 || searchQuery) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchQuery && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Search className="h-3 w-3" />
                {searchQuery}
                <button className="ml-1" onClick={() => setSearchQuery('')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {selectedTags.map(tag => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
                <button className="ml-1" onClick={() => handleFilterByTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {selectedTypes.map(type => (
              <Badge key={type} variant="outline" className="flex items-center gap-1">
                Type: {type}
                <button 
                  className="ml-1" 
                  onClick={() => setSelectedTypes(prev => prev.filter(t => t !== type))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {selectedSources.map(source => (
              <Badge key={source} variant="outline" className="flex items-center gap-1">
                Source: {source}
                <button 
                  className="ml-1" 
                  onClick={() => setSelectedSources(prev => prev.filter(s => s !== source))}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {(selectedTags.length > 0 || selectedTypes.length > 0 || selectedSources.length > 0 || searchQuery) && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 gap-1 text-xs"
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Terms display */}
        <div className="grid grid-cols-1 gap-4">
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-4">
              {categories.map(category => (
                <TermCategoryCard
                  key={category.name}
                  category={category}
                  terms={groupedTerms[category.name] || {}}
                  expanded={expandedCategories[category.name]}
                  expandedSubcategories={expandedSubcategories}
                  onToggleCategory={() => toggleCategory(category.name)}
                  onToggleSubcategory={(subcat) => toggleSubcategory(category.name, subcat)}
                  onEditTerm={handleEditTerm}
                  editingTerm={editingTerm}
                  setEditingTerm={setEditingTerm}
                  onFilterByTag={handleFilterByTag}
                  selectedTags={selectedTags}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>All Project Terms</CardTitle>
                  <CardDescription>
                    Viewing {filteredTerms.length} of {terms.length} total terms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Term</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Categories</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTerms.map((term) => (
                          <TableRow key={term.term}>
                            <TableCell className="font-medium">{term.term}</TableCell>
                            <TableCell>
                              {editingTerm === term.term ? (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    className="w-20 h-8"
                                    defaultValue={term.value}
                                    onBlur={(e) => handleEditTerm(term.term, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleEditTerm(term.term, e.currentTarget.value);
                                      }
                                      if (e.key === 'Escape') {
                                        setEditingTerm(null);
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => setEditingTerm(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <span>{term.value}</span>
                              )}
                            </TableCell>
                            <TableCell>{term.unit}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {term.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {term.categories.map((category) => (
                                  <Badge 
                                    key={category} 
                                    variant="outline"
                                    className="bg-muted"
                                  >
                                    {category}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {term.tags.map((tag) => (
                                  <Badge 
                                    key={tag}
                                    variant="outline" 
                                    className={`cursor-pointer ${selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : ''}`}
                                    onClick={() => handleFilterByTag(tag)}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingTerm(term.term)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TermsExplorer;
