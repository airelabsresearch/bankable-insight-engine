
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Folder, Edit2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TermItem } from "@/components/terms/TermItem";

interface TermCategoryCardProps {
  category: {
    name: string;
    icon: string;
    subcategories: {
      name: string;
      icon: string;
    }[];
  };
  terms: Record<string, any[]>;
  expanded: boolean;
  expandedSubcategories: Record<string, boolean>;
  onToggleCategory: () => void;
  onToggleSubcategory: (subcategory: string) => void;
  onEditTerm: (term: string, value: number | string) => void;
  editingTerm: string | null;
  setEditingTerm: (term: string | null) => void;
  onFilterByTag: (tag: string) => void;
  selectedTags: string[];
}

export const TermCategoryCard: React.FC<TermCategoryCardProps> = ({
  category,
  terms,
  expanded,
  expandedSubcategories,
  onToggleCategory,
  onToggleSubcategory,
  onEditTerm,
  editingTerm,
  setEditingTerm,
  onFilterByTag,
  selectedTags
}) => {
  // Check if there are any terms in this category's subcategories
  const hasTerms = Object.values(terms).some(subcatTerms => subcatTerms.length > 0);
  
  // If no terms match the filter, don't show the category
  if (!hasTerms) return null;

  // Count total terms in this category
  const totalTerms = Object.values(terms).reduce(
    (sum, subcatTerms) => sum + subcatTerms.length, 
    0
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <Button
          variant="ghost"
          className="flex w-full justify-between p-2 h-auto"
          onClick={onToggleCategory}
        >
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{category.name}</span>
            <Badge variant="outline" className="ml-2">
              {totalTerms} {totalTerms === 1 ? 'term' : 'terms'}
            </Badge>
          </div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-4 pt-0">
          {category.subcategories.map((subcategory) => {
            const subcatTerms = terms[subcategory.name] || [];
            if (subcatTerms.length === 0) return null;
            
            const subcatKey = `${category.name}>${subcategory.name}`;
            const isSubcatExpanded = expandedSubcategories[subcatKey] !== false; // Default to expanded
            
            return (
              <div key={subcategory.name} className="mt-2 border-l-2 pl-4 pb-2">
                <Button
                  variant="ghost"
                  className="flex w-full justify-between p-2 h-auto"
                  onClick={() => onToggleSubcategory(subcategory.name)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{subcategory.name}</span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {subcatTerms.length} {subcatTerms.length === 1 ? 'term' : 'terms'}
                    </Badge>
                  </div>
                  {isSubcatExpanded ? (
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                </Button>
                
                {isSubcatExpanded && (
                  <div className="space-y-2 mt-2">
                    {subcatTerms.map((term) => (
                      <TermItem
                        key={`${category.name}-${subcategory.name}-${term.term}`}
                        term={term}
                        isEditing={editingTerm === term.term}
                        onEdit={() => setEditingTerm(term.term)}
                        onSave={(value) => onEditTerm(term.term, value)}
                        onCancelEdit={() => setEditingTerm(null)}
                        onFilterByTag={onFilterByTag}
                        selectedTags={selectedTags}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
};
