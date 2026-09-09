import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Title,
  Primary,
  Controls,
  Stories,
  Source as StorybookSource,
} from '@storybook/addon-docs/blocks';
import './tag.css';
import cssCode from './tag.css?raw';

type TagArgs = {
  text: string;
  type?: 'default' | 'warning' | 'important' | 'error';
  attributes?: string;
};

// HTML generator
const generateHtmlCode = (args: TagArgs) => {
  const base_class = 'tag';
  const type_class = `${base_class}--${args.type || 'default'}`;

  return args.text
    ? `<span data-wudo-type="tag" class="${base_class} ${type_class}">${args.text}</span>`
    : '';
};

// React template to render raw HTML
const Template = (args: TagArgs) => (
  <div dangerouslySetInnerHTML={{ __html: generateHtmlCode(args) }} />
);

const meta: Meta<TagArgs> = {
  title: 'Atoms/Tag',
  render: Template,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <>
          <Title />
          <Primary />
          <Controls />
          <Stories />
          <div>
            <h3>Component CSS</h3>
            <StorybookSource
              code={cssCode}
              language="css"
              dark={true}
            />
          </div>
        </>
      ),
      source: {
        transform: (_input, storyContext) => generateHtmlCode(storyContext.args),
        language: 'html',
        format: true,
        type: 'code'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Label shown inside the tag'
    },
    type: {
      control: { type: 'select' },
      options: ['default', 'warning', 'important', 'error'],
      description: 'The semantic type of the tag'
    },
    attributes: {
      control: 'text',
      description: 'Additional HTML attributes'
    },
  },
};

export default meta;

type Story = StoryObj<TagArgs>;

export const Default: Story = {
  args: {
    text: 'Tag Label',
    type: 'default',
    attributes: '',
  },
};

export const Important: Story = {
  args: {
    text: 'Important Info',
    type: 'important',
    attributes: '',
  },
};

export const Warning: Story = {
  args: {
    text: 'Careful Now',
    type: 'warning',
    attributes: '',
  },
};

export const Error: Story = {
  args: {
    text: 'System Error',
    type: 'error',
    attributes: '',
  },
};
