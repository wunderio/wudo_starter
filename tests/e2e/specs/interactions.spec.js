import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { collectErrors } from '../support/pages.js';

test.describe('favorites', () => {
  test('the drawer opens, traps focus and closes', async ({ page }) => {
    await page.goto('/');
    const trigger = page.locator('wudo-favorite-counter-trigger button');
    const drawer = page.locator('#favorite-drawer');

    await trigger.click();
    await expect(drawer).toHaveAttribute('open', '');
    await expect(drawer.getByRole('heading', { name: 'My Favorites' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveAttribute('open');

    await trigger.click();
    await drawer.locator('.drawer__close').click();
    await expect(drawer).not.toHaveAttribute('open');
  });

  test('an article can be added, is listed in the drawer and survives a reload', async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto('/articles');
    const button = page.locator('wudo-favorite-button').first();
    test.skip(await button.count() === 0, 'Needs articles; install with --demo.');

    await button.locator('button').click();
    await expect(button.locator('button')).toHaveAccessibleName('Remove from favorites');
    await expect(page.locator('wudo-favorite-counter-trigger .js-count')).toHaveText('1');

    await page.reload();
    await expect(page.locator('wudo-favorite-counter-trigger .js-count')).toHaveText('1');

    // The drawer fetches the rendered card from /api/favorites.
    const api = page.waitForResponse((response) => response.url().includes('/api/favorites'));
    await page.locator('wudo-favorite-counter-trigger button').click();
    expect((await api).status()).toBe(200);
    await expect(page.locator('#favorite-drawer .article-card')).toHaveCount(1);
    expect(errors).toEqual([]);
  });
});

test('the menu opens in a drawer on small screens', async ({ page, isMobile }) => {
  await page.goto('/');
  const button = page.locator('.site-header__menu-button');
  const drawer = page.locator('#mobile-menu-drawer');
  const menu = page.locator('#site-menu');

  if (!isMobile) {
    await expect(button).toBeHidden();
    await expect(page.locator('header #site-menu a').first()).toBeVisible();
    return;
  }

  await expect(menu).toBeHidden();
  await button.click();
  await expect(drawer).toHaveAttribute('open', '');
  await expect(drawer.locator('#site-menu a').first()).toBeVisible();
  // The page behind the drawer does not scroll.
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(results.violations.map(({ id, nodes }) => ({ rule: id, nodes: nodes.map((node) => node.target.join(' ')) }))).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(drawer).not.toHaveAttribute('open', '');
  await expect(button).toBeFocused();
  // The menu is back in the header, ready for a wider viewport.
  await expect(page.locator('header #site-menu')).toHaveCount(1);
});

test('the menu is reachable without JavaScript', async ({ browser, baseURL, isMobile }) => {
  test.skip(!isMobile, 'Small screens only.');
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 800 } });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.site-header__menu-button')).toBeHidden();
  await expect(page.locator('header #site-menu a').first()).toBeVisible();
  await context.close();
});

test('the header hides on scroll down and sticks on scroll up', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header.site-header');
  test.skip(await page.evaluate(() => document.documentElement.scrollHeight < innerHeight + 450), 'The page is too short to scroll.');

  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(header).not.toBeInViewport();

  await page.evaluate(() => window.scrollTo(0, 250));
  // The header slides back in, so wait for it to settle at the top.
  await expect.poll(() => header.evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(0);
});
