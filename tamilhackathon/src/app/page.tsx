'use client';

import { useState } from 'react';
import type { CorrectSpellingErrorsOutput } from '@/ai/flows/correct-spelling-errors';
import type { SuggestTamilIdiomsOutput } from '@/ai/flows/suggest-tamil-idioms';
import type { SuggestSynonymsAndRemoveLoanwordsOutput } from '@/ai/flows/suggest-synonyms-remove-loanwords';
import type { TranslateTextOutput } from '@/ai/flows/translate-text';
import { Editor } from '@/components/tamil-ai-assistant/editor';
import { ValidationPanel } from '@/components/tamil-ai-assistant/validation-panel';
import { Header } from '@/components/tamil-ai-assistant/header';
import { ReportPanel } from '@/components/tamil-ai-assistant/report-panel';
import { useToast } from '@/hooks/use-toast';
import {
  runIdiomSuggester,
  runSpellCheck,
  runSynonymSuggester,
  runTranslator,
} from '@/lib/actions';
import type { Feature, VocabularyTone } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import type { CheckedState } from '@radix-ui/react-checkbox';

export type ValidationStates = {
  'spell-check': CheckedState;
  translation: CheckedState;
  vocabulary: CheckedState;
  idioms: CheckedState;
};

export type ValidationResults = {
  'spell-check': CorrectSpellingErrorsOutput | null;
  translation: TranslateTextOutput | null;
  vocabulary: SuggestSynonymsAndRemoveLoanwordsOutput | null;
  idioms: SuggestTamilIdiomsOutput | null;
};

export default function Home() {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ValidationResults | null>(null);
  const [vocabularyTone, setVocabularyTone] = useState<VocabularyTone>('formal');

  const [validationStates, setValidationStates] = useState<ValidationStates>({
    'spell-check': true,
    translation: false,
    vocabulary: false,
    idioms: false,
  });

  const { toast } = useToast();

  const handleValidationChange = (feature: Feature, checked: CheckedState) => {
    setValidationStates((prev) => ({ ...prev, [feature]: checked }));
  };

  const handleScan = async () => {
    if (isLoading) return;
    if (!text.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please enter some text before scanning.',
        variant: 'destructive',
      });
      return;
    }

    const activeValidations = Object.entries(validationStates)
      .filter(([, checked]) => checked)
      .map(([feature]) => feature as Feature);

    if (activeValidations.length === 0) {
      toast({
        title: 'No Validations Selected',
        description: 'Please select at least one validation to run.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const promises = activeValidations.map((feature) => {
        switch (feature) {
          case 'spell-check':
            return runSpellCheck(text);
          case 'translation':
            return runTranslator(text);
          case 'vocabulary':
            return runSynonymSuggester(text, vocabularyTone);
          case 'idioms':
            return runIdiomSuggester(text);
          default:
            return Promise.resolve(null);
        }
      });

      const settledResults = await Promise.allSettled(promises);
      
      const newResults: ValidationResults = {
        'spell-check': null,
        translation: null,
        vocabulary: null,
        idioms: null,
      };

      settledResults.forEach((result, index) => {
        const feature = activeValidations[index];
        if (result.status === 'fulfilled') {
          const value = result.value as any;
          if (value?.error) {
             toast({
              title: `Error in ${feature}`,
              description: value.error,
              variant: 'destructive',
            });
          } else {
            (newResults as any)[feature] = value;
          }
        } else {
          toast({
            title: `Error in ${feature}`,
            description: 'An unexpected error occurred.',
            variant: 'destructive',
          });
        }
      });
      
      setResults(newResults);

    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Error',
        description: `Failed to run scan: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCorrection = (originalWord: string, newWord: string) => {
    setText(currentText => currentText.replace(new RegExp(`\\b${originalWord}\\b`, 'gi'), newWord));
  };


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground p-4 md:p-8">
      <Header />
      <div className="flex flex-1 gap-8 mt-6">
        <main className="flex-[2] flex flex-col gap-6">
          <div className="flex-1 flex flex-col">
            <Editor
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex-1 flex flex-col">
            <ReportPanel
              isLoading={isLoading}
              results={results}
              onCorrect={handleCorrection}
            />
          </div>
        </main>
        <aside className="flex-1 flex flex-col gap-6">
          <ValidationPanel
            validationStates={validationStates}
            onValidationChange={handleValidationChange}
            vocabularyTone={vocabularyTone}
            onVocabularyToneChange={setVocabularyTone}
            disabled={isLoading}
          />
          <Button onClick={handleScan} disabled={isLoading} size="lg" className="w-full">
            <Scan className="mr-2 h-5 w-5" />
            {isLoading ? 'Scanning...' : 'Scan Text'}
          </Button>
        </aside>
      </div>
    </div>
  );
}
