
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Folder, Edit2, X, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TermItem } from "@/components/terms/TermItem";

interface TermCategoryCardProps {
  category: {
    name: string;
    icon: string;
    description?: string;
    count?: number;
  };
  onView: () => void;
}

export const TermCategoryCard: React.FC<TermCategoryCardProps> = ({
  category,
  onView
}) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="rounded-full bg-primary-100 p-2">
            <Folder className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h3 className="font-medium text-lg">{category.name}</h3>
        <p className="text-sm text-muted-foreground">
          {category.description || "No description provided."}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex justify-between items-center mt-2">
          <Badge variant="outline">
            {category.count || 0} {(category.count || 0) === 1 ? 'term' : 'terms'}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4 mr-2" />
            View Terms
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
