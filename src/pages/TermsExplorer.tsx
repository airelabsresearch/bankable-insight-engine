
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Tag, FileText, Edit, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TermItem } from '@/components/terms/TermItem';
import { TermsFilters } from '@/components/terms/TermsFilters';
import { TermCategoryCard } from '@/components/terms/TermCategoryCard';
import { CreateCategoryDialog } from '@/components/terms/CreateCategoryDialog';

// Mock data for project terms
const initialTerms = [
  {
    term: 'DSCR',
    value: 1.2,
    unit: 'ratio',
    type: 'financial',
    source: 'Lender',
    tags: ['Debt', 'Coverage', 'Ratio'],
    categories: ['Financial Covenants'],
    description: 'Debt Service Coverage Ratio - The ratio of operating income available to debt servicing for interest, principal and lease payments.'
  },
  {
    term: 'IRR',
    value: 15,
    unit: '%',
    type: 'financial',
    source: 'Model',
    tags: ['Return', 'Investment'],
    categories: ['Financial Metrics'],
    description: 'Internal Rate of Return - A metric used in financial analysis to estimate the profitability of potential investments.'
  },
  {
    term: 'Capacity Factor',
    value: 35,
    unit: '%',
    type: 'technical',
    source: 'Model',
    tags: ['Performance', 'Generation'],
    categories: ['Technical Parameters'],
    description: 'The ratio of actual energy output over a period to the maximum possible energy output over that period.'
  },
  {
    term: 'LCOE',
    value: 45,
    unit: '$/MWh',
    type: 'financial',
    source: 'Model',
    tags: ['Cost', 'Energy'],
    categories: ['Financial Metrics'],
    description: 'Levelized Cost of Energy - The average net present cost of electricity generation for a generating plant over its lifetime.'
  },
  {
    term: 'PPA Term',
    value: 20,
    unit: 'years',
    type: 'commercial',
    source: 'Contract',
    tags: ['Agreement', 'Duration'],
    categories: ['Contract Terms'],
    description: 'The duration of the Power Purchase Agreement between the project and the offtaker.'
  },
  {
    term: 'Debt Tenor',
    value: 15,
    unit: 'years',
    type: 'financial',
    source: 'Lender',
    tags: ['Debt', 'Duration'],
    categories: ['Financial Covenants'],
    description: 'The length of time until the full repayment of a loan is due.'
  },
  {
    term: 'Availability',
    value: 98,
    unit: '%',
    type: 'technical',
    source: 'Manufacturer',
    tags: ['Performance', 'Uptime'],
    categories: ['Technical Parameters'],
    description: 'The percentage of time that the plant is available to generate electricity.'
  },
  {
    term: 'Degradation Rate',
    value: 0.5,
    unit: '%/year',
    type: 'technical',
    source: 'Manufacturer',
    tags: ['Performance', 'Efficiency'],
    categories: ['Technical Parameters'],
    description: 'The rate at which the system\'s output capacity decreases over time.'
  },
  {
    term: 'O&M Cost',
    value: 10,
    unit: '$/kW/year',
    type: 'financial',
    source: 'Contract',
    tags: ['Operations', 'Maintenance', 'Cost'],
    categories: ['Financial Metrics', 'Contract Terms'],
    description: 'Operations and Maintenance costs for the project per kilowatt of installed capacity per year.'
  },
  {
    term: 'P90',
    value: 85,
    unit: 'GWh/year',
    type: 'technical',
    source: 'Resource Assessment',
    tags: ['Generation', 'Probability'],
    categories: ['Technical Parameters'],
    description: 'The annual production level that has a 90% probability of being exceeded.'
  },
  {
    term: 'EPC Cost',
    value: 1200,
    unit: '$/kW',
    type: 'financial',
    source: 'Contract',
    tags: ['Capital', 'Construction'],
    categories: ['Financial Metrics', 'Contract Terms'],
    description: 'Engineering, Procurement, and Construction cost per kilowatt of installed capacity.',
    usedIn: ['Financial Model', 'Budget']
  },
  {
    term: 'Debt-to-Equity Ratio',
    value: 75,
    unit: '%',
    type: 'financial',
    source: 'Lender',
    tags: ['Debt', 'Equity', 'Structure'],
    categories: ['Financial Covenants'],
    description: 'The ratio of total debt to total equity in the project financing structure.',
    usedIn: ['Financial Model']
  }
];

// Categories from terms
const initialCategories = [
  {
    name: 'Financial Covenants',
    description: 'Terms that define the financial requirements set by lenders.',
    count: 3,
    icon: 'shield-check'
  },
  {
    name: 'Financial Metrics',
    description: 'Key financial indicators used to evaluate project performance.',
    count: 3,
    icon: 'bar-chart'
  },
  {
    name: 'Technical Parameters',
    description: 'Technical specifications and performance metrics for the project.',
    count: 4,
    icon: 'settings'
  },
  {
    name: 'Contract Terms',
    description: 'Key terms and conditions from project contracts and agreements.',
    count: 3,
    icon: 'file-text'
  }
];

// All unique tags from terms
const allTags = Array.from(new Set(initialTerms.flatMap(term => term.tags)));

const TermsExplorer = () => {
  const { toast } = useToast();
  const [terms, setTerms] = useState(initialTerms);
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddTermOpen, setIsAddTermOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<number | null>(null);

  // New term form state
  const [newTerm, setNewTerm] = useState({
    term: '',
    value: '',
    unit: '',
    type: 'financial',
    source: '',
    tags: [] as string[],
    categories: [] as string[],
    description: ''
  });

  // Filter terms based on search, category, tags, and type
  const filteredTerms = terms.filter(term => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = !selectedCategory || term.categories.includes(selectedCategory);
    
    // Tags filter - term must include ALL selected tags
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => term.tags.includes(tag));
    
    // Type filter
    const matchesType = !selectedType || term.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesTags && matchesType;
  });
  
  // Handle adding a new term
  const handleAddTerm = () => {
    // Validate required fields
    if (!newTerm.term || newTerm.value === '' || !newTerm.unit || !newTerm.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const valueAsNumber = parseFloat(String(newTerm.value));
    
    // Add new term to the list
    setTerms(prev => [...prev, {
      ...newTerm,
      value: valueAsNumber,
      tags: newTerm.tags.length > 0 ? newTerm.tags : ['Uncategorized'],
      categories: newTerm.categories.length > 0 ? newTerm.categories : []
    }]);
    
    // Reset form
    setNewTerm({
      term: '',
      value: '',
      unit: '',
      type: 'financial',
      source: '',
      tags: [],
      categories: [],
      description: ''
    });
    
    // Close dialog
    setIsAddTermOpen(false);
    
    toast({
      title: "Term added",
      description: `'${newTerm.term}' has been added to the project terms.`
    });
  };
  
  // Handle adding a new category
  const handleAddCategory = (categoryData: any) => {
    setCategories(prev => [...prev, {
      ...categoryData,
      count: 0
    }]);
    
    setIsAddCategoryOpen(false);
    
    toast({
      title: "Category added",
      description: `'${categoryData.name}' has been added to categories.`
    });
  };
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Handle term deletion
  const confirmDeleteTerm = (index: number) => {
    setTermToDelete(index);
    setIsDeleteConfirmOpen(true);
  };
  
  const deleteTerm = () => {
    if (termToDelete !== null) {
      // Create a new array without the term to delete
      setTerms(prev => prev.filter((_, idx) => idx !== termToDelete));
      
      setIsDeleteConfirmOpen(false);
      setTermToDelete(null);
      
      toast({
        title: "Term deleted",
        description: "The term has been removed from the project."
      });
    }
  };
  
  // Add tag to new term
  const handleAddTagToTerm = (tag: string) => {
    if (!newTerm.tags.includes(tag)) {
      setNewTerm(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };
  
  // Remove tag from new term
  const handleRemoveTagFromTerm = (tag: string) => {
    setNewTerm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Add category to new term
  const handleAddCategoryToTerm = (category: string) => {
    if (!newTerm.categories.includes(category)) {
      setNewTerm(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }));
    }
  };
  
  // Remove category from new term
  const handleRemoveCategoryFromTerm = (category: string) => {
    setNewTerm(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Terms</h1>
          <p className="text-muted-foreground">
            Manage and explore key terms and parameters used in your project.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsAddCategoryOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Category
          </Button>
          <Button onClick={() => setIsAddTermOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Term
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Terms</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <div className="relative w-full max-w-sm ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={activeTab === "all" ? "Search terms..." : "Search categories..."}
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">Project Terms</CardTitle>
              <CardDescription>
                View and manage all terms used in your project. Filter by category, type, or tags.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <TermsFilters 
                categories={categories.map(c => c.name)}
                tags={allTags}
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
                selectedType={selectedType}
                onCategoryChange={setSelectedCategory}
                onTagSelect={handleTagSelect}
                onTypeChange={setSelectedType}
                onClearFilters={() => {
                  setSelectedCategory(null);
                  setSelectedTags([]);
                  setSelectedType(null);
                }}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term, index) => (
                <TermItem 
                  key={index}
                  term={term}
                  onDelete={() => confirmDeleteTerm(index)}
                  onEdit={() => {}}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">No terms found</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mt-1 mb-4">
                    {searchQuery || selectedCategory || selectedTags.length > 0 || selectedType 
                      ? "No terms match your current filters. Try changing or clearing your filters."
                      : "Start by adding terms to your project. Terms help define key parameters and assumptions."}
                  </p>
                  {searchQuery || selectedCategory || selectedTags.length > 0 || selectedType ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedTags([]);
                        setSelectedType(null);
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button onClick={() => setIsAddTermOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Term
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter(cat => !searchQuery || cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((category, index) => (
                <TermCategoryCard 
                  key={index}
                  category={category}
                  onView={() => {
                    setActiveTab("all");
                    setSelectedCategory(category.name);
                  }}
                />
              ))}
              
            <Card className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsAddCategoryOpen(true)}>
              <div className="rounded-full bg-muted p-4 mb-4">
                <PlusCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Add New Category</h3>
              <p className="text-sm text-center text-muted-foreground mt-1">
                Create a new category to organize your terms
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Term Dialog */}
      <Dialog open={isAddTermOpen} onOpenChange={setIsAddTermOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Term</DialogTitle>
            <DialogDescription>
              Add a new term or parameter to your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="term-name">Term Name*</Label>
                <Input 
                  id="term-name" 
                  placeholder="DSCR"
                  value={newTerm.term}
                  onChange={(e) => setNewTerm({...newTerm, term: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="term-type">Type*</Label>
                <Select 
                  value={newTerm.type}
                  onValueChange={(value) => setNewTerm({...newTerm, type: value})}
                >
                  <SelectTrigger id="term-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="term-value">Value*</Label>
                <Input 
                  id="term-value" 
                  placeholder="1.2"
                  value={newTerm.value}
                  onChange={(e) => setNewTerm({...newTerm, value: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="term-unit">Unit*</Label>
                <Input 
                  id="term-unit" 
                  placeholder="ratio"
                  value={newTerm.unit}
                  onChange={(e) => setNewTerm({...newTerm, unit: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="term-source">Source</Label>
              <Input 
                id="term-source" 
                placeholder="Lender"
                value={newTerm.source}
                onChange={(e) => setNewTerm({...newTerm, source: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Categories</Label>
              <ScrollArea className="h-20 border rounded-md p-2">
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <Badge 
                        key={index}
                        variant={newTerm.categories.includes(category.name) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          if (newTerm.categories.includes(category.name)) {
                            handleRemoveCategoryFromTerm(category.name);
                          } else {
                            handleAddCategoryToTerm(category.name);
                          }
                        }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground py-1 text-center">
                    No categories created yet.
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  id="new-tag"
                  placeholder="Add tag"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleAddTagToTerm(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('new-tag') as HTMLInputElement;
                    if (input.value) {
                      handleAddTagToTerm(input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              <ScrollArea className="h-20 border rounded-md p-2">
                <div className="flex flex-wrap gap-2">
                  {newTerm.tags.length > 0 ? (
                    newTerm.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTagFromTerm(tag)}
                      >
                        {tag}
                        <span className="ml-1 text-muted-foreground hover:text-foreground">×</span>
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground py-1">
                      No tags added yet. Type a tag and press Enter.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="term-description">Description*</Label>
              <Textarea 
                id="term-description" 
                placeholder="Describe this term and its significance..."
                rows={3}
                value={newTerm.description}
                onChange={(e) => setNewTerm({...newTerm, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTermOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTerm}>Add Term</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <CreateCategoryDialog 
        open={isAddCategoryOpen}
        onOpenChange={setIsAddCategoryOpen}
        onSubmit={handleAddCategory}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this term? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTerm}>
              Delete Term
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TermsExplorer;
