import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Risk } from "@/lib/types/risk";
import { formatCurrency, getRiskLevel } from "@/lib/utils/risk-calculations";
import { RiskForm } from "./RiskForm";

interface RiskTableProps {
  risks: Risk[];
  onUpdate: (id: string, updates: Partial<Risk>) => void;
  onDelete: (id: string) => void;
}

export function RiskTable({ risks, onUpdate, onDelete }: RiskTableProps) {
  const [editingRisk, setEditingRisk] = useState<Risk | undefined>();

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMitigationStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead>Impact Cost</TableHead>
            <TableHead>Mitigation Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {risks.map((risk) => {
            const riskLevel = getRiskLevel(risk.assessment.riskScore);
            return (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.title}</TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>{risk.stage}</TableCell>
                <TableCell>{risk.owner}</TableCell>
                <TableCell>
                  <Badge className={getRiskLevelColor(riskLevel)}>
                    {riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(risk.assessment.impactCost)}</TableCell>
                <TableCell>
                  <Badge className={getMitigationStatusColor(risk.mitigation.status)}>
                    {risk.mitigation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingRisk(risk)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(risk.id)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {editingRisk && (
        <RiskForm
          risk={editingRisk}
          onSubmit={(data) => {
            onUpdate(editingRisk.id, data);
            setEditingRisk(undefined);
          }}
          onCancel={() => setEditingRisk(undefined)}
        />
      )}
    </div>
  );
} 