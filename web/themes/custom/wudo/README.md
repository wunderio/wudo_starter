# WUDO
Drupal 11 base theme (SDC, Web Components, Lit).

Wudo, derived from the Wunder and the Japanese Dō (Path).

![Drupal](https://img.shields.io/badge/Drupal-11-0678BE?style=flat-square&logo=drupal&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?style=flat-square&logo=storybook&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite&logoColor=white)
![Web Components](https://img.shields.io/badge/Web_Components-Native-orange?style=flat-square&logo=webcomponents&logoColor=white)
![Lit](https://img.shields.io/badge/Lit-3.0-blueviolet?style=flat-square&logo=lit&logoColor=white)


## Why This Stack?
* **Single Directory Components (SDC)** keep markup, styles, metadata, and logic together, making components clear, reusable, and Drupal-native.
* **Vite** is chosen for speed, simplicity, and modern ESM workflows.
* **Lit** provides a lightweight, reactive layer for Web Components. It ensures that complex UI logic remains fast and encapsulated, allowing for high interactivity with minimal overhead
* **Storybook** is isolated by design to enforce clean, native, CMS-agnostic components.

## Component Inventory

### Atoms

| Component                                             | Version | Status       | SDC      | Web Cmp  | Lit |
|:------------------------------------------------------|---------|:-------------|----------|----------|-----|
| [Button](./components/01-atoms/button)                |         | stable       | &#x2705; |          |     |
| [Link](./components/01-atoms/link)                    | 1.0.0   | stable       | &#x2705; |          |     |
| [Paragraph](./components/01-atoms/paragraph)          |         | stable       | &#x2705; |          |     |
| [Icon](./components/01-atoms/icon)                    |         | stable       | &#x2705; |          |     |
| [Theme Toggler](./components/01-atoms/theme-toggler)  |         | stable       | &#x2705; | &#x2705; |     |
| [Quantity Input](./components/01-atoms/form/quantity) |         | stable       | &#x2705; | &#x2705; |     |
| [Back To Top](./components/01-atoms/back-to-top)      |         | experimental | &#x2705; | &#x2705; |     |

### Molecules
| Component                                                        | Version | Status       | SDC      | Web Cmp  | Lit |
|:-----------------------------------------------------------------|---------|:-------------|----------|----------|-----|
| [Accordion](./components/02-molecules/accordion)                 |         | stable       | &#x2705; |          |     |
| [Article card](./components/02-molecules/article-card)           |         | experimental | &#x2705; |          |     |
| [Tabs](./components/02-molecules/tabs)                           |         | experimental | &#x2705; |          |     |
| [Pagination](./components/02-molecules/pagination)               |         | stable       | &#x2705; |          |     |
| [Countdown](./components/02-molecules/countdown)                 |         | experimental | &#x2705; | &#x2705; |     |
| [Stat Card](./components/02-molecules/stat-card)                 |         | experimental | &#x2705; | &#x2705; |     |
| [Toast Messages](./components/02-molecules/toast-messages)       | 1.0.0   | stable       | &#x2705; | &#x2705; |     |
| [Attribute List](./components/02-molecules/attribute-list)       |         | stable       | &#x2705; |          |     |
| [Language switcher](./components/02-molecules/language-switcher) | 1.0.2   | stable       | &#x2705; | &#x2705; |     |

### Organisms
| Component                                      | Version | Status       | SDC       | Web Cmp   | Lit       |
|:-----------------------------------------------|---------|:-------------|-----------|-----------|-----------|
| [Header](./components/03-organisms/header)     |         | stable       | &#x2705;  |           |           |
| [Drawer](./components/03-organisms/drawer)     | 1.2.0   | experimental | &#x2705;  | &#x2705;  |           |
| [Carousel](./components/03-organisms/carousel) |         | experimental | &#x2705;  | &#x2705;  |           |
| [Favorite](./components/03-organisms/favorite) |         | experimental | &#x2705;  | &#x2705;  | &#x2705;  |
| [Filter](./components/03-organisms/filter)     | 1.0.0   | experimental  |  &#x2705; | &#x2705;  |   &#x2705;       |

### Utilities
| Component                                                         | Version | Status       | SDC       | Web Cmp  | Description                                             |
|:------------------------------------------------------------------|---------|:-------------|-----------|----------|:--------------------------------------------------------|
| [Link Manager](./components/00-base/01-primitives/link-manager)   |         | experimental | &#x2705;  | &#x2705; | automatically manages external links                    |
| [Sticky Header](./components/00-base/01-primitives/sticky-header) |         | experimental | &#x2705;  | &#x2705; | Sticky header                                           |
| [Reveal](./components/00-base/01-primitives/reveal)               |         | experimental | &#x2705;  | &#x2705; | provides a "reveal on scroll" animation for its content |
| [Focus Trap](./components/00-base/01-primitives/focus-trap)       | 1.0.0   | stable       |           |          | JS only component used by Drawer, Menu toggle           |

## Quick Start

Install all dependencies

```bash
npm install
```

Develop common Drupal styles

```bash
npm run dev
```
Develop SDC components
```bash
npm run dev:sdc
```
Build SDC components and main style.css

```bash
npm run build
```
Run Storybook
```bash
npm run storybook
```

## Theme Renaming
This theme includes a migration script to safely change the theme's machine name. This is particularly useful when using this repository as a starter kit.
### What the script does:
* **Folder Migration:** Moves all files to a new directory named after your new theme.
* **File Renaming:** Automatically renames core Drupal files (`.info.yml`, `.libraries.yml`, `.theme`, etc.).
* **SDC Namespace Update:** Updates all Single Directory Component (SDC) references (e.g., changing `old_theme:component` to `new_theme:component`).
* **Path Correction:** Replaces hardcoded theme paths in `.scss`, `.js`, and `.yml` files.
* **Safe Processing:** Uses `:` as a delimiter to safely handle file paths and ignores `node_modules`, `dist`, and `.git` folders.

### How to use:
Open your terminal and navigate to the scripts directory:
```bash
cd themes/custom/your_current_theme/scripts
```
Make sure the script is executable:
```bash
chmod +x rename.sh
```
Run the script:
```bash
./rename.sh
```
Enter your new theme machine name (e.g., `my_awesome_theme`) when prompted.

## Theme Light / Dark modes

This project implements a flexible theme system with native Dark Mode support.

### 1. Native System Support (Default)
The theme is **Auto-first** by design. Even without the toggler component, the site automatically inherits the user's OS preference via `prefers-color-scheme`. Dark mode CSS variables are active by default to ensure a seamless experience from the first visit.

### 2. Manual Theme Toggler
The [Theme Toggler](./components/01-atoms/theme-toggler) Web Component allows users to manually override system settings.
* **Tri-state Logic:** Cycles through **Auto** (System), **Dark**, and **Light** modes.
* **Zero Flicker:** Applies `data-theme` to the `<html>` element instantly to prevent Layout Shift.
* **Fully Localized:** All labels and ARIA attributes are passed from Drupal/Twig, making the component 100% translatable.


## Documentation

* **UI Library / Storybook:** [Setup and Usage Guide](./docs/storybook.md)
* **Drupal / SDC:** [Using Single-Directory Components](https://www.drupal.org/docs/develop/theming-drupal/using-single-directory-components)
* **Lit:** [Setup and Usage Guide](./docs/lit.md)
