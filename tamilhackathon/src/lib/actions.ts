'use server';

import { correctSpellingErrors } from '@/ai/flows/correct-spelling-errors';
import { suggestTamilIdioms } from '@/ai/flows/suggest-tamil-idioms';
import { suggestSynonymsAndRemoveLoanwords } from '@/ai/flows/suggest-synonyms-remove-loanwords';
import { translateText } from '@/ai/flows/translate-text';
import type { VocabularyTone } from './types';

type ErrorResult = { error: string };

export async function runSpellCheck(text: string) {
  if (!text) return null;
  try {
    const result = await correctSpellingErrors({ tamilText: text });
    return result;
  } catch (e) {
    console.error('Spell check failed:', e);
    return { error: 'Failed to run spell check.' } as ErrorResult;
  }
}

export async function runTranslator(text: string) {
  if (!text) return null;
  try {
    const result = await translateText({ text });
    return result;
  } catch (e) {
    console.error('Translation failed:', e);
    return { error: 'Failed to translate text.' } as ErrorResult;
  }
}


export async function runSynonymSuggester(text: string, tone: VocabularyTone) {
  if (!text) return null;
  try {
    const result = await suggestSynonymsAndRemoveLoanwords({ text, tone });
    return result;
  } catch (e) {
    console.error('Synonym suggestion failed:', e);
    return { error: 'Failed to suggest synonyms.' } as ErrorResult;
  }
}

export async function runIdiomSuggester(text: string) {
  if (!text) return null;
  try {
    const result = await suggestTamilIdioms({ text });
    return result;
  } catch (e) {
    console.error('Idiom suggestion failed:', e);
    return { error: 'Failed to suggest idioms.' } as ErrorResult;
  }
}
