
import React, { useState } from 'react';
import { useRisk } from '@/context/RiskContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Edit, Trash2, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Risk, RiskCategory, MitigationStatus } from '@/types/risk';
import { EditRiskDialog } from './EditRiskDialog';
import { Input } from "@/components/ui/input";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getLikelihoodColor = (likelihood: string) => {
  switch (likelihood) {
    case 'Low': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'High': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMitigationStatusColor = (status: MitigationStatus) => {
  switch (status) {
    case 'Not Started': return 'bg-gray-100 text-gray-800';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Done': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: RiskCategory) => {
  switch (category) {
    case 'Technical': return 'bg-indigo-100 text-indigo-800';
    case 'Environmental': return 'bg-emerald-100 text-emerald-800';
    case 'Regulatory': return 'bg-amber-100 text-amber-800';
    case 'Financial': return 'bg-violet-100 text-violet-800';
    case 'Social': return 'bg-sky-100 text-sky-800';
    case 'Commercial': return 'bg-orange-100 text-orange-800';
    case 'Legal': return 'bg-rose-100 text-rose-800';
    case 'Operational': return 'bg-teal-100 text-teal-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const RiskTable: React.FC = () => {
  const { risks, deleteRisk } = useRisk();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'All'>('All');
  const [mitigationFilter, setMitigationFilter] = useState<MitigationStatus | 'All'>('All');
  
  const handleEdit = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsEditDialogOpen(true);
  };
  
  const filteredRisks = risks.filter(risk => {
    const matchesSearch = 
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      risk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'All' || risk.category === categoryFilter;
    const matchesMitigation = mitigationFilter === 'All' || risk.mitigationStatus === mitigationFilter;
    
    return matchesSearch && matchesCategory && matchesMitigation;
  });
  
  const riskCategories: RiskCategory[] = [
    'Technical', 'Environmental', 'Regulatory', 'Financial', 
    'Social', 'Commercial', 'Legal', 'Operational'
  ];
  
  const mitigationStatuses: MitigationStatus[] = ['Not Started', 'In Progress', 'Done'];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Category: {categoryFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCategoryFilter('All')}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {riskCategories.map((category) => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status: {mitigationFilter}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMitigationFilter('All')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {mitigationStatuses.map((status) => (
                <DropdownMenuItem 
                  key={status} 
                  onClick={() => setMitigationFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Risk</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Likelihood</TableHead>
              <TableHead>Impact Cost</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Mitigation Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No risks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRisks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell>
                    <div className="font-medium">{risk.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{risk.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getCategoryColor(risk.category)}`}>
                      {risk.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{risk.owner}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getLikelihoodColor(risk.likelihood)}>
                      {risk.likelihood}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(risk.impactCost)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-bold">{risk.riskScore}</span>
                      {risk.riskScore >= 6 && (
                        <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getMitigationStatusColor(risk.mitigationStatus)}>
                      {risk.mitigationStatus === 'Done' && <Check className="h-3 w-3 mr-1" />}
                      {risk.mitigationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(risk)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteRisk(risk.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedRisk && (
        <EditRiskDialog
          risk={selectedRisk}
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedRisk(null);
          }}
        />
      )}
    </div>
  );
};
