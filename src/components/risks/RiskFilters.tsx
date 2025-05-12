import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { RiskFilters as RiskFiltersType } from "@/lib/types/risk";
import { cn } from "@/lib/utils";

interface RiskFiltersProps {
  onFilterChange: (filters: RiskFiltersType) => void;
}

export function RiskFilters({ onFilterChange }: RiskFiltersProps) {
  const [filters, setFilters] = useState<RiskFiltersType>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof RiskFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "gap-2",
              hasActiveFilters && "border-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear filters</span>
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
                <SelectItem value="Environmental">Environmental</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stage</label>
            <Select
              value={filters.stage}
              onValueChange={(value) => handleFilterChange('stage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feasibility">Feasibility</SelectItem>
                <SelectItem value="Pre-Financing">Pre-Financing</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Owner</label>
            <Input
              placeholder="Filter by owner"
              value={filters.owner || ''}
              onChange={(e) => handleFilterChange('owner', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mitigation Status</label>
            <Select
              value={filters.mitigationStatus}
              onValueChange={(value) => handleFilterChange('mitigationStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange?.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.start ? (
                      format(filters.dateRange.start, "PPP")
                    ) : (
                      <span>Start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange?.start}
                    onSelect={(date) =>
                      handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        start: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateRange?.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.end ? (
                      format(filters.dateRange.end, "PPP")
                    ) : (
                      <span>End date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange?.end}
                    onSelect={(date) =>
                      handleFilterChange('dateRange', {
                        ...filters.dateRange,
                        end: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 