import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { sitePaths } from '../support/pages.js';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Formats violations so a failure names the rule and the offending markup.
 */
function summary(violations) {
  return violations.map(({ id, help, nodes }) => ({
    rule: id,
    help,
    nodes: nodes.map((node) => node.target.join(' ')),
  }));
}

test('pages have no WCAG 2.2 AA violations', async ({ page, request }) => {
  // Every page is checked before failing, so one run lists all problems.
  const violations = {};
  for (const path of await sitePaths(request)) {
    await test.step(path, async () => {
      await page.goto(path, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      if (results.violations.length) {
        violations[path] = summary(results.violations);
      }
    });
  }
  expect(violations).toEqual({});
});

test('the open favorites drawer has no WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('wudo-favorite-counter-trigger button').click();
  await expect(page.locator('#favorite-drawer')).toHaveAttribute('open', '');
  const results = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(summary(results.violations)).toEqual([]);
});
