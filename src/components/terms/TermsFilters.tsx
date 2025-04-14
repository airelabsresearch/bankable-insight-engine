
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
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSources: string[];
  setSelectedSources: React.Dispatch<React.SetStateAction<string[]>>;
  availableTags: { id: string; label: string }[];
  clearFilters: () => void;
}

export const TermsFilters: React.FC<TermsFiltersProps> = ({
  selectedTags,
  setSelectedTags,
  selectedTypes,
  setSelectedTypes,
  selectedSources,
  setSelectedSources,
  availableTags,
  clearFilters
}) => {
  const types = [
    { id: "numeric", label: "Numeric" },
    { id: "shared", label: "Shared" },
    { id: "derived", label: "Derived" }
  ];
  
  const sources = [
    { id: "manual", label: "Manual" },
    { id: "calculated", label: "Calculated" },
    { id: "derived", label: "Derived" }
  ];

  const hasFilters = selectedTags.length > 0 || selectedTypes.length > 0 || selectedSources.length > 0;
  
  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };
  
  const toggleSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="flex gap-2">
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
          {availableTags.map((tag) => (
            <DropdownMenuCheckboxItem
              key={tag.id}
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={() => toggleTag(tag.id)}
            >
              {tag.label}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedTags.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => setSelectedTags([])}
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
            <Database className="h-4 w-4 mr-2" />
            Types
            {selectedTypes.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1">
                {selectedTypes.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {types.map((type) => (
            <DropdownMenuCheckboxItem
              key={type.id}
              checked={selectedTypes.includes(type.id)}
              onCheckedChange={() => toggleType(type.id)}
            >
              {type.label}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedTypes.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => setSelectedTypes([])}
              >
                <X className="mr-2 h-4 w-4" />
                Clear types
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sources Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10">
            <FileEdit className="h-4 w-4 mr-2" />
            Sources
            {selectedSources.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1">
                {selectedSources.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by sources</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sources.map((source) => (
            <DropdownMenuCheckboxItem
              key={source.id}
              checked={selectedSources.includes(source.id)}
              onCheckedChange={() => toggleSource(source.id)}
            >
              {source.label}
            </DropdownMenuCheckboxItem>
          ))}
          {selectedSources.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8 px-2"
                onClick={() => setSelectedSources([])}
              >
                <X className="mr-2 h-4 w-4" />
                Clear sources
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
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      )}
    </div>
  );
};
