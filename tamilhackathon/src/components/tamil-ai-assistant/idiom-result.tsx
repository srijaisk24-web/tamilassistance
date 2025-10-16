'use client';

import type { SuggestTamilIdiomsOutput } from '@/ai/flows/suggest-tamil-idioms';
import { Badge } from '@/components/ui/badge';

type IdiomResultProps = {
  data: SuggestTamilIdiomsOutput;
};

export function IdiomResult({ data }: IdiomResultProps) {
  return (
    <div>
      {data.suggestions && data.suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {data.suggestions.map((suggestion, index) => (
            <Badge key={index} variant="outline" className="text-sm font-normal p-2">
              {suggestion}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No idiom suggestions found for this text.
        </p>
      )}
    </div>
  );
}
