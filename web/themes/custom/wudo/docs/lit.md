# Design System Components with Lit & SDC
This theme uses a hybrid approach for UI components, combining Drupal **SDC (Single Directory Components)** with **Lit** for high-performance, reactive Web Components.

## 1. Why Lit?
We use Lit specifically for inter-component communication and complex state management.
* **Lightweight:** At only ~5KB, it provides reactivity without the overhead of heavy frameworks like React or Vue.
* **Encapsulation:** Uses Shadow DOM to ensure styles from the theme don't leak into components and vice versa.
* **Standard-based:** Lit components are native Custom Elements, making them future-proof and compatible with any HTML environment.

## 2. Smart Implementation: Import Maps
Our implementation is designed to be "smart" by decoupling the library from the components. Instead of bundling everything into one giant file, we use Import Maps.

* **No Redundancy:** Lit is loaded exactly once, regardless of how many components use it in a single page.
* **Zero-Build SDC:** Your SDC JavaScript files in `/components` are served as native ES Modules. You can edit them and see changes instantly without running a watcher.
* **Selective Loading:** If a page doesn't use any Lit components, the Lit library is never downloaded by the browser.
* **Self-Hosted:** We don't rely on CDNs. Vite bundles Lit into a local file for better performance, security (CSP compliance), and offline reliability.

## 3. How to use Lit in a Component

Simply import from `'lit'`. The browser will know where to find it thanks to our `importmap`.
```javascript
import { LitElement, html, css } from 'lit';

class MyComponent extends LitElement {
  static properties = {
    title: { type: String }
  };

  render() {
    return html`<div>${this.title}</div>`;
  }
}
customElements.define('my-component', MyComponent);
```
`importmap` implementation consists of two parts:
1. `js/import-map.js` - JSON object defining the import map.
2. `importmap` included in the HTML template with help of preprocess function in `wudo.theme`.
```php
/**
 * Implements hook_page_attachments_alter().
 */
function wudo_page_attachments_alter(array &$attachments) {
  $theme_path = \Drupal::service('extension.list.theme')->getPath('wudo');
  $full_path = DRUPAL_ROOT . '/' . $theme_path . '/js/import-map.js';

  if (file_exists($full_path)) {
    $import_map_content = file_get_contents($full_path);

    $attachments['#attached']['html_head'][] = [
      [
        '#tag' => 'script',
        '#attributes' => ['type' => 'importmap'],
        '#value' => $import_map_content,
      ],
      'wudo_importmap_inline',
    ];
  }
}
```

## 4. Maintenance Commands
Build the Lit Library
If you update the Lit version via NPM, you must rebuild the core bundle:
```bash
npm run build:lit
```
This generates `dist/lit-core.bundle.js` which is used by the Import Map.
If need add more libraries to import map, you can edit `lit-entry.js` and then run the build command, then update importmap.
