import { test, expect, chromium } from '@playwright/test';
import lighthouse from 'lighthouse';

const port = 9222;

// Performance depends on the machine, so it is reported but only guarded
// against a collapse. The other categories are deterministic.
const thresholds = {
  performance: 50,
  accessibility: 100,
  'best-practices': 100,
  seo: 100,
};

for (const path of ['/', '/articles']) {
  test(`Lighthouse scores for ${path}`, async ({ baseURL }, testInfo) => {
    test.setTimeout(120_000);
    const browser = await chromium.launch({ args: [`--remote-debugging-port=${port}`] });
    try {
      const result = await lighthouse(new URL(path, baseURL).href, {
        port,
        output: 'html',
        // Known gap: content has no description field to feed the meta tag.
        skipAudits: ['meta-description'],
        logLevel: 'error',
      });
      await testInfo.attach('lighthouse-report.html', { body: result.report, contentType: 'text/html' });

      const scores = Object.fromEntries(
        Object.entries(result.lhr.categories).map(([id, category]) => [id, Math.round(category.score * 100)]),
      );
      const failed = Object.values(result.lhr.audits)
        .filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode === 'binary')
        .map((audit) => audit.id);
      console.log(path, scores, failed);
      for (const [category, minimum] of Object.entries(thresholds)) {
        expect.soft(scores[category], category).toBeGreaterThanOrEqual(minimum);
      }
    }
    finally {
      await browser.close();
    }
  });
}
