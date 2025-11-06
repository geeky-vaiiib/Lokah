# Lokah System Prompt

This file documents the base system prompt used across Supabase functions.

Location in code:
- supabase/functions/chat-with-parallel-self/index.ts (system prompt + context)
- supabase/functions/generate-reflection/index.ts (lokahBasePrompt + task prompt)
- supabase/functions/extract-memory/index.ts (lokahBasePrompt + task prompt)
- supabase/functions/generate-alternate-self/index.ts (lokahBasePrompt + JSON-only system)

Defaults:
- Chat turns: temperature 0.7, max_tokens 800
- Reflections: temperature 0.4, max_tokens 300
- Memory extraction: temperature 0.35, max_tokens 250
- Parallel self generation: temperature 0.7, max_tokens 900

To tweak modes (friendly/practical/empathetic), adjust temperature and potentially prepend a short mode hint in the messages list.
