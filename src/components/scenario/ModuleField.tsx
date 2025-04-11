
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Minus, RefreshCw, Trash2, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModuleFieldProps {
  module: {
    id: number;
    name: string;
    category: string;
    status: string;
    quantity?: number;
    swappedWith?: string;
  };
  onToggleStatus: (id: number, status: string) => void;
  onUpdateSwap: (id: number, newModule: string) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export function ModuleField({ 
  module, 
  onToggleStatus, 
  onUpdateSwap, 
  onUpdateQuantity 
}: ModuleFieldProps) {
  const getBackgroundColor = () => {
    switch(module.status) {
      case 'excluded': return 'bg-gray-50 border-gray-200';
      case 'swapped': return 'bg-blue-50 border-blue-200';
      case 'added': return 'bg-green-50 border-green-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className={`border rounded-lg p-3 transition-colors ${getBackgroundColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Switch 
            checked={module.status !== 'excluded'} 
            onCheckedChange={(checked) => 
              onToggleStatus(module.id, checked ? 'included' : 'excluded')
            }
          />
          <div>
            <div className="font-medium text-sm">
              {module.name}
              {module.status === 'added' && module.quantity && module.quantity > 1 && 
                <span className="ml-1 text-xs font-normal">(× {module.quantity})</span>
              }
            </div>
            <Badge variant="outline" className="text-xs">
              {module.category}
            </Badge>
          </div>
        </div>
        
        {module.status !== 'excluded' && (
          <div className="flex items-center space-x-2">
            {module.status === 'added' && (
              <div className="flex items-center space-x-1 mr-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onUpdateQuantity(module.id, Math.max(1, (module.quantity || 1) - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-5 text-center">{module.quantity || 1}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onUpdateQuantity(module.id, (module.quantity || 1) + 1)}
                >
                  <PlusCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onToggleStatus(module.id, 
                module.status === 'swapped' ? 'included' : 'swapped'
              )}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {module.status === 'swapped' ? 'Revert Swap' : 'Swap'}
            </Button>
            
            {module.status === 'added' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-red-600"
                onClick={() => onToggleStatus(module.id, 'excluded')}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove
              </Button>
            )}
          </div>
        )}
      </div>
      
      {module.status === 'swapped' && (
        <div className="mt-2 pl-9">
          <div className="flex items-center space-x-2">
            <ChevronRight className="h-3 w-3 text-blue-600" />
            <Select 
              value={module.swappedWith || ''} 
              onValueChange={(value) => onUpdateSwap(module.id, value)}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select replacement..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Advanced Version">Advanced Version</SelectItem>
                <SelectItem value="High-Efficiency Model">High-Efficiency Model</SelectItem>
                <SelectItem value="Next-Gen Technology">Next-Gen Technology</SelectItem>
                <SelectItem value="Upgraded System">Upgraded System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {module.swappedWith && (
            <div className="text-xs text-blue-700 mt-1 pl-5">
              Replacing with {module.swappedWith}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
