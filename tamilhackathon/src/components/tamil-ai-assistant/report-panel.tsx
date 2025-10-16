'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Scan } from 'lucide-react';
import type { ValidationResults } from '@/app/page';
import { SpellCheckResult } from './spell-check-result';
import { TranslationResult } from './translation-result';
import { VocabularyResult } from './vocabulary-result';
import { IdiomResult } from './idiom-result';
import { BookText, Languages, Quote, SpellCheck as SpellCheckIcon } from 'lucide-react';


type ReportPanelProps = {
  isLoading: boolean;
  results: ValidationResults | null;
  onCorrect: (originalWord: string, newWord: string) => void;
};

const LoadingSkeleton = () => (
    <div className="p-6">
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Scan
        className="h-10 w-10 text-primary"
        strokeWidth={1.5}
      />
    </div>
    <h3 className="font-bold text-lg text-foreground">Validation Report</h3>
    <p className="text-muted-foreground mt-1 text-sm">
      Select your desired validations and click "Scan" to generate a report.
    </p>
  </div>
);


export function ReportPanel({
  isLoading,
  results,
  onCorrect,
}: ReportPanelProps) {

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (!results) {
      return <EmptyState />;
    }
    
    const activeResults = Object.entries(results).filter(([, value]) => value !== null);

    if (activeResults.length === 0) {
        return <EmptyState />;
    }

    return (
      <Accordion type="multiple" defaultValue={activeResults.map(([key]) => key)} className="w-full">
        {results['spell-check'] && (
          <AccordionItem value="spell-check">
            <AccordionTrigger className="text-base px-6">
                <div className="flex items-center gap-3">
                    <SpellCheckIcon className="w-5 h-5" />
                    Spelling
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <SpellCheckResult data={results['spell-check']} onCorrect={onCorrect} />
            </AccordionContent>
          </AccordionItem>
        )}
        {results.translation && (
          <AccordionItem value="translation">
            <AccordionTrigger className="text-base px-6">
                <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5" />
                    Translation
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <TranslationResult data={results.translation} />
            </AccordionContent>
          </AccordionItem>
        )}
        {results.vocabulary && (
          <AccordionItem value="vocabulary">
            <AccordionTrigger className="text-base px-6">
                <div className="flex items-center gap-3">
                    <BookText className="w-5 h-5" />
                    Vocabulary
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <VocabularyResult data={results.vocabulary} />
            </AccordionContent>
          </AccordionItem>
        )}
        {results.idioms && (
          <AccordionItem value="idioms">
            <AccordionTrigger className="text-base px-6">
                <div className="flex items-center gap-3">
                    <Quote className="w-5 h-5" />
                    Idioms
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pt-2 pb-4">
              <IdiomResult data={results.idioms} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    );
  };

  return (
     <Card className="flex-1 flex flex-col relative bg-card/50">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="font-headline text-lg">Validation Report</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col overflow-auto">
            {renderContent()}
        </CardContent>
    </Card>
  );
}
