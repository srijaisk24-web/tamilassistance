import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-tamil-idioms.ts';
import '@/ai/flows/correct-spelling-errors.ts';
import '@/ai/flows/suggest-synonyms-remove-loanwords.ts';
import '@/ai/flows/translate-text.ts';
