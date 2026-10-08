# Wudo Theme Extension

Custom Drupal module providing admin UI enhancements and JSON API endpoints for the Wudo demo site.

## Features

### Theme toggler block
Provides a configurable `Theme toggler` block that renders the Wudo theme
switcher component. Place it from `/admin/structure/block` after enabling the
module.

### Favorites block
Provides a `Favorites counter and drawer` block under the **Wudo** category.
Place one instance in the header with **Counter only**, then place a second
instance in the `Page bottom` region with **Drawer only**. Both instances must
use the same drawer ID (`favorite-drawer`) as the Article favorite buttons.

### Paragraphs Behavior: Style & Layout Settings
Adds a collapsible **Styles** panel to each paragraph in the editor, powered by the `style_settings` Paragraphs Behavior plugin. Editors can set per-paragraph background color, padding, and layout directly in the edit form without switching tabs.

Enable the behavior per paragraph type at:
`/admin/structure/paragraphs_type/{type}/behaviors`

### JSON Endpoints
| Path | Description |
|------|-------------|
| `/api/favorites?ids=1,2,3` | Returns the given nodes rendered as cards (at most 50 per request) |
| `/api/views/{view_id}/{display_id}?page=0` | Renders a View display as paginated HTML cards |

Both endpoints require the `access content` permission, and their responses are
cached and invalidated like any other Drupal page.

`/api/views` only serves the views listed in
`wudo_theme_extension.settings:api_views` (`articles` by default). Add a view
there before requesting it:

```bash
drush config:set wudo_theme_extension.settings api_views.1 my_view
```

## Requirements
- Drupal 11
- [Paragraphs](https://www.drupal.org/project/paragraphs) module
