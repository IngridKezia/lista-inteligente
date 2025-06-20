// src/ai/flows/generate-product-name-suggestions.ts
'use server';
/**
 * @fileOverview Product name suggestion AI agent.
 *
 * - generateProductNameSuggestions - A function that handles the product name suggestion process.
 * - GenerateProductNameSuggestionsInput - The input type for the generateProductNameSuggestions function.
 * - GenerateProductNameSuggestionsOutput - The return type for the generateProductNameSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductNameSuggestionsInputSchema = z.object({
  category: z
    .enum(['alimentos', 'limpeza', 'higiene', 'outros'])
    .describe('The category of the product.'),
});
export type GenerateProductNameSuggestionsInput = z.infer<typeof GenerateProductNameSuggestionsInputSchema>;

const GenerateProductNameSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggested product names.'),
});
export type GenerateProductNameSuggestionsOutput = z.infer<typeof GenerateProductNameSuggestionsOutputSchema>;

export async function generateProductNameSuggestions(input: GenerateProductNameSuggestionsInput): Promise<GenerateProductNameSuggestionsOutput> {
  return generateProductNameSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductNameSuggestionsPrompt',
  input: {schema: GenerateProductNameSuggestionsInputSchema},
  output: {schema: GenerateProductNameSuggestionsOutputSchema},
  prompt: `You are a helpful assistant that suggests product names based on the category provided by the user.

  Suggest 5 product names for the following category:
  {{category}}

  Return the suggestions as a JSON array of strings.
  `,
});

const generateProductNameSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateProductNameSuggestionsFlow',
    inputSchema: GenerateProductNameSuggestionsInputSchema,
    outputSchema: GenerateProductNameSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
