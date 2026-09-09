import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(js|ts|tsx)'],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: '@storybook/react-vite',
  viteFinal: (config) => {
    return config;
  },
};

export default config;
