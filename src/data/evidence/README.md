# Evidence archive — Layer 3

One JSON record per piece of first-party evidence, plus its asset under
`public/evidence/<cluster>/`.

This is the layer that stays at zero unless someone deliberately keeps the
paperwork. Layer 1 (statute) writes itself from public sources; Layer 2
(observations) accumulates from the monthly audit; Layer 3 exists only because
the author went through the procedure and kept what came back.

## What belongs here

The difference between

> A bank may ask for additional KYC documents from a foreign-owned company.

and

> These were the seven documents the bank actually asked for in August 2026.

Only the second is un-copyable. Worth keeping:

- Hometax and Wetax screens from a filing that actually happened
- The four-major-insurance bill, with the real figures on it
- The document list a bank handed over, and the reason given for a refusal
- Real costs — what incorporation came to in total, what the first payroll
  actually cost the employer

## Redaction

Redact before the file leaves your machine. Business registration numbers,
account numbers, resident registration numbers, addresses, names, phone
numbers. `redaction` must state what was removed — a record without it fails
`npm run lint:data`, because a reader has to know what they are not seeing.

## Adding a record

```jsonc
// src/data/evidence/vat-2026-h1-filing.json
{
  "id": "vat-2026-h1-filing",          // must match the filename
  "type": "first_party",               // or "observed"
  "date": "2026-07-22",                // when it happened, not when published
  "title": "First-half VAT return as filed",
  "cluster": "vat",
  "asset": "/evidence/vat/2026-h1-filing.webp",
  "alt": "Hometax VAT return confirmation screen",
  "note": "What this shows and what to take from it.",
  "redaction": "Business registration number and company name masked.",
  "supports": ["vat-simplified-threshold"]   // optional observation keys
}
```

Then reference it from an article's frontmatter:

```yaml
evidence: [vat-2026-h1-filing]
```

It renders under the guide and on the history page of any observation series
it supports.
