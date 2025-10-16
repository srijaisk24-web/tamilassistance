'use server';
/**
 * @fileOverview Suggests synonyms for Tamil words to enhance vocabulary and identifies overuse of English loanwords.
 *
 * - suggestSynonymsAndRemoveLoanwords - A function that suggests synonyms and removes loanwords.
 * - SuggestSynonymsAndRemoveLoanwordsInput - The input type for the suggestSynonymsAndRemoveLoanwords function.
 * - SuggestSynonymsAndRemoveLoanwordsOutput - The return type for the suggestSynonymsAndRemoveLoanwords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSynonymsAndRemoveLoanwordsInputSchema = z.object({
  text: z.string().describe('The Tamil text to analyze and enhance.'),
  tone: z.enum(['formal', 'informal']).describe('The desired tone for the vocabulary suggestions.'),
});
export type SuggestSynonymsAndRemoveLoanwordsInput = z.infer<
  typeof SuggestSynonymsAndRemoveLoanwordsInputSchema
>;

const SuggestSynonymsAndRemoveLoanwordsOutputSchema = z.object({
  enhancedText: z
    .string()
    .describe('The Tamil text with enhanced vocabulary and reduced English loanwords.'),
  removedLoanwords: z
    .array(z.string())
    .describe('A list of English loanwords that were removed or replaced.'),
  appliedChanges: z.array(z.object({
    originalWord: z.string(),
    replacementWord: z.string(),
  })).describe('A list of changes applied to the text.')
});
export type SuggestSynonymsAndRemoveLoanwordsOutput = z.infer<
  typeof SuggestSynonymsAndRemoveLoanwordsOutputSchema
>;

export async function suggestSynonymsAndRemoveLoanwords(
  input: SuggestSynonymsAndRemoveLoanwordsInput
): Promise<SuggestSynonymsAndRemoveLoanwordsOutput> {
  return suggestSynonymsAndRemoveLoanwordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSynonymsAndRemoveLoanwordsPrompt',
  input: {schema: SuggestSynonymsAndRemoveLoanwordsInputSchema},
  output: {schema: SuggestSynonymsAndRemoveLoanwordsOutputSchema},
  prompt: `You are a Tamil language expert. Your task is to correct the tone of the given Tamil text and identify and remove overused English loanwords. The tone of the output should be {{tone}}.

Analyze the following Tamil text:
{{{text}}}

Provide an enhanced version of the text with an adjusted tone, suitable for a {{tone}} context. Highlight the changes by providing a list of original words and their replacements. Also, provide a list of removed English loanwords.

Output the enhanced text, applied changes, and removed loanwords in the specified JSON format.

Removed loanwords should be a list of the english loanwords that were removed or replaced.
Applied changes should be a list of objects, each with the original word and the word that replaced it.
`,
});

const suggestSynonymsAndRemoveLoanwordsFlow = ai.defineFlow(
  {
    name: 'suggestSynonymsAndRemoveLoanwordsFlow',
    inputSchema: SuggestSynonymsAndRemoveLoanwordsInputSchema,
    outputSchema: SuggestSynonymsAndRemoveLoanwordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
