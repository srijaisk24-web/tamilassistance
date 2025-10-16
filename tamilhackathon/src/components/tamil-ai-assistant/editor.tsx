'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { ChangeEventHandler } from 'react';

type EditorProps = {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
};

export function Editor({
  value,
  onChange,
  disabled,
}: EditorProps) {

  return (
    <Card className="flex flex-col relative bg-card/50 flex-1">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="font-headline text-lg">Your Text</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-2 relative">
        <Textarea
            value={value}
            onChange={onChange}
            placeholder="Type or paste your text here..."
            className="flex-1 resize-none text-base bg-muted/20"
            disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}
