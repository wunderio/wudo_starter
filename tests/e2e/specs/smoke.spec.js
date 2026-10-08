import { test, expect } from '@playwright/test';
import { collectErrors, sitePaths } from '../support/pages.js';

test('every page renders without script or CSP errors', async ({ page, request }) => {
  for (const path of await sitePaths(request)) {
    await test.step(path, async () => {
      const errors = collectErrors(page);
      const response = await page.goto(path, { waitUntil: 'networkidle' });
      const expected = path === '/this-page-does-not-exist' ? 404 : 200;

      expect(response.status(), 'status').toBe(expected);
      await expect(page.locator('h1'), 'exactly one h1').toHaveCount(1);
      await expect(page.locator('html'), 'language').toHaveAttribute('lang', /.+/);
      await expect(page, 'title').toHaveTitle(/.+/);
      // The 404 response itself is logged by the browser as a failed resource.
      expect(errors.filter((error) => !(expected === 404 && /404/.test(error))), 'console errors').toEqual([]);
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
    });
  }
});

test('security headers are sent', async ({ request }) => {
  const headers = (await request.get('/')).headers();
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['content-security-policy']).not.toContain("script-src 'self' 'unsafe-inline'");
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['x-content-type-options']).toBe('nosniff');
});

test('the skip link is the first focusable element', async ({ page, browserName, isMobile }) => {
  test.skip(isMobile, 'Keyboard navigation.');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
});
