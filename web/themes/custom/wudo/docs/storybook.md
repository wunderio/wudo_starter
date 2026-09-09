# Storybook Setup and Configuration
This guide outlines the steps required to integrate and configure Storybook for isolated component development and documentation, utilizing Vite as the build tool.

## 1. Installation
We'll use the official Storybook Command Line Interface (CLI) tool to automatically set up the necessary dependencies and initial configuration for your project.

Execute this command in your project's root directory (where your package.json file is located).
```bash
npm install
```

Ensure the following scripts are present in your `package.json`:

```bash
// package.json
"scripts": {
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  // ... other scripts
}
```


### 2. Start Storybook (Development Mode)
Run the Storybook server, which utilizes Vite's Hot Module Replacement (HMR) for fast updates:

```bash
npm run storybook
```

Storybook will typically be available at http://localhost:6006.

### 3. Build for Production

To create a static build of your component library for hosting (e.g., on Netlify or GitHub Pages):
```bash
npm run build-storybook
```
The final, static output will be generated in the storybook-static folder.
