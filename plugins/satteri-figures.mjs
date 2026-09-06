import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OBSERVATIONS_DIR = 'src/data/observations';
const TOKEN = /\{\{fig:([a-z0-9-]+)\}\}/g;

function loadDisplays() {
  const map = new Map();
  for (const file of readdirSync(OBSERVATIONS_DIR).filter((f) => f.endsWith('.json'))) {
    const series = JSON.parse(readFileSync(join(OBSERVATIONS_DIR, file), 'utf8'));
    const latest = series.history?.[series.history.length - 1];
    if (latest?.display) map.set(series.key, latest.display);
  }
  return map;
}

/**
 * Substitutes `{{fig:some-key}}` in a post body with that observation series'
 * current display value.
 *
 * A figure should have exactly one home. `latest()` already serves the
 * tracked-figures block under every article and the /tracked/ pages from
 * src/data/observations/*.json; before this, the body prose kept its own copy,
 * so a rate change meant editing the JSON and then hunting for every article
 * that had typed the number out. Tedious at forty articles; a guarantee of a
 * stale number surviving somewhere at four hundred.
 *
 * Written against Sätteri's mdast API rather than as a remark plugin because
 * setting `markdown.remarkPlugins` switches Astro back to the legacy unified
 * processor for the whole site — re-rendering every existing article through a
 * different pipeline for the sake of a text substitution.
 *
 * Frontmatter never reaches the processor, so a token there would publish
 * literally; scripts/lint-data.mjs fails the build on that.
 */
export function satteriFigures() {
  // A dev server should follow an edit to a JSON file, so the map is not cached
  // across documents in development.
  const cached = process.env.NODE_ENV === 'production' ? loadDisplays() : null;

  const substitute = (value, where, context) =>
    value.replace(TOKEN, (match, key) => {
      const display = (cached ?? loadDisplays()).get(key);
      if (display === undefined) {
        context.addDiagnostic({
          message:
            `${where}: {{fig:${key}}} — no observation series with that key. ` +
            `Add ${OBSERVATIONS_DIR}/${key}.json, or fix the key.`,
          severity: 'error',
        });
        return match;
      }
      return display;
    });

  const visit = (type) => (node, context) => {
    if (!node.value.includes('{{fig:')) return;
    const where = context.fileURL ? context.fileURL.pathname : 'unknown file';
    return { type, value: substitute(node.value, where, context) };
  };

  return {
    name: 'expatwon-figures',
    // Raw HTML nodes carry the figure and callout blocks, so both types matter.
    text: visit('text'),
    html: visit('html'),
  };
}
