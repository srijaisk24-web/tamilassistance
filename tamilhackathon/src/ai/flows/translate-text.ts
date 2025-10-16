'use server';

/**
 * @fileOverview A multi-language translation agent.
 *
 * This agent detects the source language of the input text (either Tamil or English)
 * and translates it to the other language.
 *
 * - translateText - A function that handles the translation process.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated, can be Tamil or English.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

// Output Schema
const TranslateTextOutputSchema = z.object({
  sourceLanguage: z.enum(['Tamil', 'English']).describe('The detected source language of the input text.'),
  englishTranslation: z.string().optional().describe('The English translation. Present if the source is Tamil.'),
  tamilTranslation: z.string().optional().describe('The Tamil translation. Present if the source is English.'),
  thanglishTranscription: z.string().optional().describe('The Thanglish (Tamil in Latin script) transcription. Present if the source is English.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


export async function translateText(
  input: TranslateTextInput
): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}


// Shared prompt for language detection
const languageDetectionPrompt = ai.definePrompt({
    name: 'languageDetectionPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: z.object({ language: z.enum(['Tamil', 'English', 'Unknown']) }) },
    prompt: `Detect the primary language of the following text. Respond with "Tamil", "English", or "Unknown".

Text: {{{text}}}
`,
});

// Tamil to English Translation Prompt
const tamilToEnglishPrompt = ai.definePrompt({
    name: 'tamilToEnglishPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: z.object({ englishTranslation: z.string() }) },
    prompt: 'Translate the following Tamil text to English: {{{text}}}',
});

// English to Tamil and Thanglish Prompt
const englishToTamilPrompt = ai.definePrompt({
    name: 'englishToTamilPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: z.object({
        tamilTranslation: z.string(),
        thanglishTranscription: z.string().describe('Phonetic transliteration of the Tamil translation into Latin script.'),
    }) },
    prompt: `Translate the following English text to Tamil. Also provide a Thanglish (phonetic transliteration in Latin script) version of the Tamil translation.

English Text: {{{text}}}`,
});


// Main translation flow
const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async ({ text }) => {
    // 1. Detect language
    const { output: detectionResult } = await languageDetectionPrompt({ text });
    const sourceLanguage = detectionResult!.language;

    if (sourceLanguage === 'Tamil') {
      const { output: translationResult } = await tamilToEnglishPrompt({ text });
      return {
        sourceLanguage: 'Tamil',
        englishTranslation: translationResult!.englishTranslation,
      };
    } else if (sourceLanguage === 'English') {
      const { output: translationResult } = await englishToTamilPrompt({ text });
      return {
        sourceLanguage: 'English',
        tamilTranslation: translationResult!.tamilTranslation,
        thanglishTranscription: translationResult!.thanglishTranscription,
      };
    } else {
        throw new Error("Could not determine the language of the provided text. Please provide either Tamil or English text.");
    }
  }
);
