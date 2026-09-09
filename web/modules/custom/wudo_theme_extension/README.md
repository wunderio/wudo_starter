# Wudo Theme Extension

Custom Drupal module providing admin UI enhancements and JSON API endpoints for the Wudo demo site.

## Features

### Paragraphs Behavior: Style & Layout Settings
Adds a collapsible **Styles** panel to each paragraph in the editor, powered by the `style_settings` Paragraphs Behavior plugin. Editors can set per-paragraph background color, padding, and layout directly in the edit form without switching tabs.

Enable the behavior per paragraph type at:
`/admin/structure/paragraphs_type/{type}/behaviors`

### JSON Endpoints
| Path | Description |
|------|-------------|
| `/api/favorites` | Returns rendered favorite article teasers |
| `/api/views/{view_id}/{display_id}` | Renders a View display as paginated HTML cards |

Both endpoints require the `access content` permission.

## Requirements
- Drupal 10+
- [Paragraphs](https://www.drupal.org/project/paragraphs) module
