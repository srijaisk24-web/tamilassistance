// src/ai/flows/suggest-tamil-idioms.ts
'use server';
/**
 * @fileOverview Suggests Tamil idioms or proverbs to enrich the input text.
 *
 * - suggestTamilIdioms - A function that suggests Tamil idioms or proverbs for the given text.
 * - SuggestTamilIdiomsInput - The input type for the suggestTamilIdioms function.
 * - SuggestTamilIdiomsOutput - The return type for the suggestTamilIdioms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTamilIdiomsInputSchema = z.object({
  text: z.string().describe('The Tamil text to enrich with idioms or proverbs.'),
});
export type SuggestTamilIdiomsInput = z.infer<typeof SuggestTamilIdiomsInputSchema>;

const SuggestTamilIdiomsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of Tamil idioms or proverbs that can enrich the text.'),
});
export type SuggestTamilIdiomsOutput = z.infer<typeof SuggestTamilIdiomsOutputSchema>;

export async function suggestTamilIdioms(input: SuggestTamilIdiomsInput): Promise<SuggestTamilIdiomsOutput> {
  return suggestTamilIdiomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTamilIdiomsPrompt',
  input: {schema: SuggestTamilIdiomsInputSchema},
  output: {schema: SuggestTamilIdiomsOutputSchema},
  prompt: `You are a Tamil language expert. You will receive a piece of Tamil text and suggest appropriate Tamil idioms or proverbs that would enrich the text, making it more culturally relevant and expressive. Provide a list of suggestions.

Text: {{{text}}}`,
});

const suggestTamilIdiomsFlow = ai.defineFlow(
  {
    name: 'suggestTamilIdiomsFlow',
    inputSchema: SuggestTamilIdiomsInputSchema,
    outputSchema: SuggestTamilIdiomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
