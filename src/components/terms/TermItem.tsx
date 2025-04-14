
import React, { useState } from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Edit2, 
  Save, 
  X,
  Info,
  Tag,
  Link as LinkIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TermItemProps {
  term: {
    term: string;
    value: number | string;
    unit: string;
    type: string;
    source: string;
    tags: string[];
    categories: string[];
    description?: string;
    usedIn?: string[];
  };
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: number | string) => void;
  onCancelEdit: () => void;
  onFilterByTag: (tag: string) => void;
  selectedTags: string[];
}

export const TermItem: React.FC<TermItemProps> = ({
  term,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onFilterByTag,
  selectedTags
}) => {
  const [editValue, setEditValue] = useState<string | number>(term.value);
  
  const handleSave = () => {
    onSave(editValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">{term.term}</span>
              
              {term.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{term.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {term.usedIn && term.usedIn.length > 0 && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="cursor-help">
                      <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-medium">Used in:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {term.usedIn.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
              
              <Badge variant="outline" className="text-xs">
                {term.type}
              </Badge>
              
              {term.categories.length > 1 && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Badge variant="outline" className="bg-muted text-xs cursor-help">
                      +{term.categories.length - 1} categories
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-medium">Also appears in:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {term.categories.slice(1).map((category) => (
                          <li key={category}>{category}</li>
                        ))}
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
            
            <div className="flex items-center mt-1.5">
              <div className="flex-1 flex items-center">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-7 w-24 text-sm"
                      autoFocus
                    />
                    <span className="text-xs text-muted-foreground">{term.unit}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={handleSave}
                    >
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={onCancelEdit}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{term.value}</span>
                    <span className="text-xs text-muted-foreground">{term.unit}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 ml-1" 
                      onClick={onEdit}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              
              {term.tags && term.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  {term.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-5 cursor-pointer ${
                        selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => onFilterByTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
