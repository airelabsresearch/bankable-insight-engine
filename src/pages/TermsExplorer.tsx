import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Term {
  term: string;
  definition: string;
  value: number;
}

const TermsExplorer: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([
    { term: 'Discount Rate', definition: 'Rate used to discount future cash flows', value: 0.10 },
    { term: 'Inflation Rate', definition: 'Rate at which prices increase', value: 0.02 },
    { term: 'Tax Rate', definition: 'Percentage of income paid in taxes', value: 0.21 },
  ]);

  const addTerm = () => {
    setTerms([...terms, { term: '', definition: '', value: 0 }]);
  };

  const deleteTerm = (index: number) => {
    const newTerms = [...terms];
    newTerms.splice(index, 1);
    setTerms(newTerms);
  };

  // Fix the type issue by ensuring the editTerm function converts string values to numbers
  const editTerm = (termIndex: number, field: string, value: string | number) => {
    setTerms(prev => {
      const newTerms = [...prev];
      const updatedTerm = { ...newTerms[termIndex] };
      
      // Handle conversion for number values
      if (field === 'value') {
        if (typeof value === 'string') {
          // Convert string to number or preserve original if not a valid number
          const numValue = parseFloat(value);
          updatedTerm.value = isNaN(numValue) ? updatedTerm.value : numValue;
        } else {
          updatedTerm.value = value as number;
        }
      } else {
        // For other fields, just use the type assertion to handle the assignment
        (updatedTerm as any)[field] = value;
      }
      
      newTerms[termIndex] = updatedTerm;
      return newTerms;
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Terms Explorer</h1>
      <p className="mb-4">Explore and modify key financial terms used in project analysis.</p>

      {terms.map((term, index) => (
        <div key={index} className="mb-6 p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`term-${index}`}>Term</Label>
              <Input
                type="text"
                id={`term-${index}`}
                value={term.term}
                onChange={(e) => editTerm(index, 'term', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`definition-${index}`}>Definition</Label>
              <Input
                type="text"
                id={`definition-${index}`}
                value={term.definition}
                onChange={(e) => editTerm(index, 'definition', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`value-${index}`}>Value</Label>
              <Input
                type="number"
                id={`value-${index}`}
                value={term.value}
                onChange={(e) => editTerm(index, 'value', e.target.value)}
              />
            </div>
          </div>
          <Button variant="destructive" size="sm" className="mt-4" onClick={() => deleteTerm(index)}>
            Delete Term
          </Button>
        </div>
      ))}

      <Button onClick={addTerm}>Add Term</Button>
    </div>
  );
};

export default TermsExplorer;
