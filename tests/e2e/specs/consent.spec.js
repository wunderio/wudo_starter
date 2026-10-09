import { test, expect } from '@playwright/test';

// The consent notice is optional: ddev add-consent [G-XXXXXXXXXX].
const GOOGLE = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/;

/**
 * Records requests to Google and answers them locally, so the tests neither
 * depend on the network nor send anything.
 */
async function watchGoogle(context) {
  const requests = [];
  await context.route(GOOGLE, (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  });
  return requests;
}

async function open(page, path = '/') {
  await page.goto(path, { waitUntil: 'networkidle' });
  test.skip(await page.locator('#klaro-js').count() === 0, 'Consent is not installed.');
}

test('nothing is loaded from Google before consent or after declining', async ({ page, context }) => {
  const requests = await watchGoogle(context);
  await open(page);

  const notice = page.locator('#klaro .cookie-notice');
  await expect(notice).toBeVisible();
  expect(requests).toEqual([]);
  expect((await context.cookies()).filter(({ name }) => name.startsWith('_ga'))).toEqual([]);

  await notice.getByRole('button', { name: 'Decline' }).click();
  await expect(notice).toBeHidden();

  // The choice is remembered: no notice and still no requests on other pages.
  await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' });
  await expect(page.locator('#klaro .cookie-notice')).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('Google Analytics loads only after accepting', async ({ page, context }) => {
  const requests = await watchGoogle(context);
  await open(page);
  test.skip(await page.locator('script[data-name="ga4"]').count() === 0, 'Google Analytics is not installed.');
  expect(requests).toEqual([]);

  await page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Accept' }).click();
  await expect.poll(() => requests.length).toBeGreaterThan(0);
  expect(requests[0]).toMatch(/googletagmanager\.com\/gtag\/js\?id=G-/);

  // It keeps loading on later pages, without asking again.
  const before = requests.length;
  await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' });
  await expect(page.locator('#klaro .cookie-notice')).toHaveCount(0);
  expect(requests.length).toBeGreaterThan(before);
});

test('consent can be withdrawn from the footer link', async ({ page, context }) => {
  const requests = await watchGoogle(context);
  await open(page);
  test.skip(await page.locator('script[data-name="ga4"]').count() === 0, 'Google Analytics is not installed.');

  await page.locator('#klaro .cookie-notice').getByRole('button', { name: 'Accept' }).click();
  await expect.poll(() => requests.length).toBeGreaterThan(0);

  await page.getByRole('link', { name: 'Cookie settings' }).click();
  const dialog = page.locator('#klaro .cm-modal');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('checkbox', { name: 'Google Analytics' }).uncheck({ force: true });
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(dialog).toBeHidden();

  const before = requests.length;
  await page.goto('/this-page-does-not-exist', { waitUntil: 'networkidle' });
  expect(requests.length).toBe(before);
});
