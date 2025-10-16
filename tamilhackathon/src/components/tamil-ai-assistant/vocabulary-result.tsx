'use client';

import type { SuggestSynonymsAndRemoveLoanwordsOutput } from '@/ai/flows/suggest-synonyms-remove-loanwords';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import React from 'react';

type VocabularyResultProps = {
  data: SuggestSynonymsAndRemoveLoanwordsOutput;
};

const HighlightedText = ({ text, changes }: { text: string, changes: { originalWord: string, replacementWord: string }[] }) => {
    if (!changes || changes.length === 0) {
        return <>{text}</>;
    }
    
    // Create a regex to find all original words
    const originalWords = changes.map(c => c.originalWord);
    // Escape special characters for regex
    const escapedWords = originalWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    
    return (
        <p className="leading-relaxed">
            {parts.map((part, index) => {
                const change = changes.find(c => c.originalWord.toLowerCase() === part.toLowerCase());
                if (change) {
                    return (
                        <mark key={index} className="bg-yellow-300/30 text-yellow-800 dark:text-yellow-200 px-1 rounded">
                            {part}
                        </mark>
                    );
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </p>
    );
};


export function VocabularyResult({ data }: VocabularyResultProps) {
  const hasLoanwords =
    data.removedLoanwords && data.removedLoanwords.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Enhanced Text</h4>
        <div className="p-4 bg-muted/50 rounded-md border text-base">
          <HighlightedText text={data.enhancedText} changes={data.appliedChanges || []} />
        </div>
      </div>

      {hasLoanwords && (
        <Accordion type="single" collapsible className="w-full" defaultValue='loanwords'>
          {hasLoanwords && (
            <AccordionItem value="loanwords">
              <AccordionTrigger className="text-sm">Removed English Loanwords</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 pt-2">
                  {data.removedLoanwords.map((word, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="line-through"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
}
