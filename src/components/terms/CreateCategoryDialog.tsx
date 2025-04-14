
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Folder, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  existingTerms: any[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters."
  }),
  description: z.string().optional(),
  terms: z.array(z.string()).optional(),
  parentCategory: z.string().optional(),
  isSubcategory: z.boolean().default(false)
});

export const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  existingTerms
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      terms: [],
      parentCategory: "",
      isSubcategory: false
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
  };

  const watchIsSubcategory = form.watch("isSubcategory");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Create a new category or subcategory to organize your project terms.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormSection className="space-y-4">
              <FormField
                control={form.control}
                name="isSubcategory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Create as subcategory</FormLabel>
                      <FormDescription>
                        Create this as a subcategory of an existing category
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {watchIsSubcategory && (
                <FormField
                  control={form.control}
                  name="parentCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="" disabled>
                          Select a parent category
                        </option>
                        <option value="Solar">Solar</option>
                        <option value="Battery">Battery</option>
                        <option value="Hydrogen">Hydrogen</option>
                        <option value="Financing">Financing</option>
                        <option value="CapEx">CapEx</option>
                        <option value="Revenue">Revenue</option>
                      </select>
                      <FormDescription>
                        Select the parent category for this subcategory
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name for your new {watchIsSubcategory ? 'subcategory' : 'category'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description for this category"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <FormSection>
              <FormLabel>Select Terms to Include</FormLabel>
              <FormDescription>
                Choose which terms should appear in this {watchIsSubcategory ? 'subcategory' : 'category'}
              </FormDescription>
              <div className="h-[200px] overflow-y-auto border rounded-md p-4 mt-2 space-y-2">
                {existingTerms.map((term) => (
                  <div key={term.term} className="flex items-start space-x-2">
                    <Checkbox
                      id={`term-${term.term}`}
                      value={term.term}
                      onCheckedChange={(checked) => {
                        const currentTerms = form.getValues("terms") || [];
                        if (checked) {
                          form.setValue("terms", [...currentTerms, term.term]);
                        } else {
                          form.setValue(
                            "terms",
                            currentTerms.filter((t) => t !== term.term)
                          );
                        }
                      }}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`term-${term.term}`}
                        className="text-sm font-medium"
                      >
                        {term.term}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {term.value} {term.unit} - {term.categories[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>

            <DialogFooter>
              <Button onClick={() => onOpenChange(false)} variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
