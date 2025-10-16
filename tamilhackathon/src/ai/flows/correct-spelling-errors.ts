'use server';
/**
 * @fileOverview Implements spell check and autocorrect for Tamil text.
 *
 * - correctSpellingErrors - A function that checks Tamil text for spelling errors and suggests corrections.
 * - CorrectSpellingErrorsInput - The input type for the correctSpellingErrors function.
 * - CorrectSpellingErrorsOutput - The return type for the correctSpellingErrors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CorrectSpellingErrorsInputSchema = z.object({
  tamilText: z.string().describe('The Tamil text to check for spelling errors.'),
});
export type CorrectSpellingErrorsInput = z.infer<typeof CorrectSpellingErrorsInputSchema>;

const CorrectSpellingErrorsOutputSchema = z.object({
  correctedText: z.string().describe('The Tamil text with spelling errors corrected.'),
  corrections: z.array(
    z.object({
      originalWord: z.string().describe('The original misspelled word.'),
      suggestedCorrections: z.array(z.string()).describe('Suggested corrections for the misspelled word.'),
    })
  ).describe('A list of spelling corrections made.'),
  correctnessScore: z.number().min(0).max(100).describe('A score from 0 to 100 representing the correctness of the original text.'),
});
export type CorrectSpellingErrorsOutput = z.infer<typeof CorrectSpellingErrorsOutputSchema>;

export async function correctSpellingErrors(input: CorrectSpellingErrorsInput): Promise<CorrectSpellingErrorsOutput> {
  return correctSpellingErrorsFlow(input);
}

const correctSpellingErrorsPrompt = ai.definePrompt({
  name: 'correctSpellingErrorsPrompt',
  input: {schema: CorrectSpellingErrorsInputSchema},
  output: {schema: CorrectSpellingErrorsOutputSchema},
  prompt: `You are a Tamil language expert. You will receive Tamil text and must perform two tasks:
1.  Calculate a "correctness score" from 0 to 100, where 100 is perfectly written and 0 is completely incorrect. Base this score on the number and severity of spelling mistakes.
2.  Identify all spelling errors and provide corrections.

Tamil Text: {{{tamilText}}}

Output a JSON object containing:
- The correctness score.
- The corrected version of the text.
- A list of correction objects, where each object has the original misspelled word and an array of suggested corrections.

Be specific and only focus on actual spelling mistakes. Ensure that the output is valid JSON.`,
});

const correctSpellingErrorsFlow = ai.defineFlow(
  {
    name: 'correctSpellingErrorsFlow',
    inputSchema: CorrectSpellingErrorsInputSchema,
    outputSchema: CorrectSpellingErrorsOutputSchema,
  },
  async input => {
    const {output} = await correctSpellingErrorsPrompt(input);
    return output!;
  }
);
