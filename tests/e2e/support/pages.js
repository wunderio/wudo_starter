/**
 * @file
 * The pages every site-wide check runs against.
 */

/**
 * Returns the paths of the front page, the 404 page and everything in the
 * XML sitemap, so new content is covered without touching the tests.
 */
export async function sitePaths(request) {
  const paths = new Set(['/', '/this-page-does-not-exist']);
  const response = await request.get('/sitemap.xml');
  if (response.ok()) {
    const xml = await response.text();
    for (const [, url] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      paths.add(new URL(url).pathname);
    }
  }
  return [...paths];
}

/**
 * Collects JavaScript errors and failed console checks (which is where
 * Content Security Policy violations show up) while a page is in use.
 */
export function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  return errors;
}
