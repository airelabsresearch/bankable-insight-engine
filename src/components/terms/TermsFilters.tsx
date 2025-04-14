
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Filter, X, Tag, Database, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TermsFiltersProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  selectedTags: string[];
  selectedType: string | null;
  onCategoryChange: React.Dispatch<React.SetStateAction<string | null>>;
  onTagSelect: (tag: string) => void;
  onTypeChange: React.Dispatch<React.SetStateAction<string | null>>;
  onClearFilters: () => void;
}

export const TermsFilters: React.FC<TermsFiltersProps> = ({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  selectedType,
  onCategoryChange,
  onTagSelect,
  onTypeChange,
  onClearFilters
}) => {
  const types = [
    { id: "financial", label: "Financial" },
    { id: "technical", label: "Technical" },
    { id: "commercial", label: "Commercial" },
    { id: "legal", label: "Legal" },
    { id: "other", label: "Other" }
  ];
  
  const hasFilters = selectedCategory !== null || selectedTags.length > 0 || selectedType !== null;

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Database className="h-4 w-4 mr-2" />
            Category
            {selectedCategory && (
              <Badge variant="secondary" className="ml-2 h-5 px-1">1</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={selectedCategory === category}
              onCheckedChange={() => {
                if (selectedCategory === category) {
                  onCategoryChange(null);
                } else {
                  onCategoryChange(category);
                }
              }}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedCategory && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => onCategoryChange(null)}
              >
                <X className="mr-2 h-4 w-4" />
                Clear category
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tags Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <Tag className="h-4 w-4 mr-2" />
            Tags
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag}
              checked={selectedTags.includes(tag)}
              onCheckedChange={() => onTagSelect(tag)}
            >
              {tag}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedTags.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => {
                  // Clear all selected tags
                  selectedTags.forEach(tag => onTagSelect(tag));
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear tags
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Types Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <FileEdit className="h-4 w-4 mr-2" />
            Type
            {selectedType && (
              <Badge variant="secondary" className="ml-2 h-5 px-1">1</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {types.map((type) => (
            <DropdownMenuCheckboxItem
              key={type.id}
              checked={selectedType === type.id}
              onCheckedChange={() => {
                if (selectedType === type.id) {
                  onTypeChange(null);
                } else {
                  onTypeChange(type.id);
                }
              }}
            >
              {type.label}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedType && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => onTypeChange(null)}
              >
                <X className="mr-2 h-4 w-4" />
                Clear type
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear All Filter */}
      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          className="h-10"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      )}
    </div>
  );
};
