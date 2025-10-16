'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Feature, VocabularyTone } from '@/lib/types';
import { BookText, Languages, Quote, SpellCheck } from 'lucide-react';
import type { ValidationStates } from '@/app/page';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type Validation = {
  id: Feature;
  name: string;
  description: string;
  icon: React.ElementType;
};

const validations: Validation[] = [
  { id: 'spell-check', name: 'Spelling', description: 'Check for spelling errors and get corrections.', icon: SpellCheck },
  { id: 'translation', name: 'Translation', description: 'Translate between Tamil and English.', icon: Languages },
  { id: 'vocabulary', name: 'Vocabulary', description: 'Enhance text with richer words and tone.', icon: BookText },
  { id: 'idioms', name: 'Idioms', description: 'Get suggestions for relevant Tamil idioms.', icon: Quote },
];

type ValidationPanelProps = {
  validationStates: ValidationStates;
  onValidationChange: (feature: Feature, checked: CheckedState) => void;
  vocabularyTone: VocabularyTone;
  onVocabularyToneChange: (tone: VocabularyTone) => void;
  disabled?: boolean;
};

export function ValidationPanel({ 
    validationStates, 
    onValidationChange,
    vocabularyTone,
    onVocabularyToneChange,
    disabled 
}: ValidationPanelProps) {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Validations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {validations.map((validation) => (
          <div key={validation.id}>
            <div className="flex items-center space-x-4">
              <Switch
                id={validation.id}
                checked={validationStates[validation.id]}
                onCheckedChange={(checked) => onValidationChange(validation.id, checked)}
                disabled={disabled}
              />
              <Label htmlFor={validation.id} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-3">
                  <validation.icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-base">{validation.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{validation.description}</p>
              </Label>
            </div>
            {validation.id === 'vocabulary' && validationStates.vocabulary && (
                 <div className="pl-12 pt-4">
                    <p className="text-sm font-medium mb-2">Tone</p>
                    <RadioGroup 
                        value={vocabularyTone} 
                        onValueChange={(value) => onVocabularyToneChange(value as VocabularyTone)}
                        className="flex space-x-4"
                        disabled={disabled}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="formal" id="formal" />
                            <Label htmlFor="formal" className="font-normal cursor-pointer">Formal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="informal" id="informal" />
                            <Label htmlFor="informal" className="font-normal cursor-pointer">Informal</Label>
                        </div>
                    </RadioGroup>
                 </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
