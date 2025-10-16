'use client';

import type { CorrectSpellingErrorsOutput } from '@/ai/flows/correct-spelling-errors';
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type SpellCheckResultProps = {
  data: CorrectSpellingErrorsOutput;
  onCorrect: (originalWord: string, newWord: string) => void;
};

export function SpellCheckResult({ data, onCorrect }: SpellCheckResultProps) {
  const { correctnessScore, corrections } = data;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Correctness Score</h4>
        <div className="flex items-center gap-3">
          <Progress value={correctnessScore} className="w-full h-2" />
          <span className="font-bold text-lg text-primary">{correctnessScore}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {correctnessScore === 100
            ? 'Excellent! No spelling errors found.'
            : 'Some spelling errors were found. See corrections below.'}
        </p>
      </div>

      {corrections && corrections.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Corrections</h4>
          <ScrollArea className="h-48 rounded-md border">
            <div className="p-2 text-sm">
              {corrections.map((correction, index) => (
                <div key={index} className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 p-2 rounded hover:bg-muted">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-red-500 dark:text-red-400 font-medium">
                      {correction.originalWord}
                    </span>
                    <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                    <div className="flex flex-wrap gap-1">
                      {correction.suggestedCorrections.length > 0 ? (
                        correction.suggestedCorrections.map(suggestion => (
                           <Button
                            key={suggestion}
                            variant="link"
                            size="sm"
                            onClick={() => onCorrect(correction.originalWord, suggestion)}
                            className="p-0 h-auto text-green-600 dark:text-green-500 font-medium hover:underline"
                           >
                            {suggestion}
                           </Button>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No suggestions</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
