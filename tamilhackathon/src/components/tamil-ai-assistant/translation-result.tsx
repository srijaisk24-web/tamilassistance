'use client';

import type { TranslateTextOutput } from '@/ai/flows/translate-text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TranslationResultProps = {
  data: TranslateTextOutput;
};

export function TranslationResult({ data }: TranslationResultProps) {
  const { sourceLanguage, englishTranslation, tamilTranslation, thanglishTranscription } = data;

  if (sourceLanguage === 'English') {
    return (
      <div>
        <h4 className="font-medium mb-2">Translation to Tamil</h4>
        <Tabs defaultValue="tamil" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tamil">Tamil</TabsTrigger>
            <TabsTrigger value="thanglish">Thanglish</TabsTrigger>
          </TabsList>
          <TabsContent value="tamil">
            <div className="p-4 bg-muted/50 rounded-md border mt-2">
              <p className="text-base leading-relaxed">{tamilTranslation}</p>
            </div>
          </TabsContent>
          <TabsContent value="thanglish">
            <div className="p-4 bg-muted/50 rounded-md border mt-2">
              <p className="text-base leading-relaxed font-mono">{thanglishTranscription}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div>
        <h4 className="font-medium mb-2">Translation to English</h4>
        <div className="p-4 bg-muted/50 rounded-md border">
          <p className="text-base leading-relaxed">
            {englishTranslation}
          </p>
        </div>
    </div>
  );
}
