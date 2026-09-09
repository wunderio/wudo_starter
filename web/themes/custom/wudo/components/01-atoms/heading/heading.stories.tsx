import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Title,
  Primary,
  Controls,
  Stories,
  Source as StorybookSource,
} from '@storybook/addon-docs/blocks';
import './heading.css';
import cssCode from './heading.css?raw';

type HeadingArgs = {
  content: string;
  level?: number;
  font?: string;
  align?: 'left' | 'center' | 'right';
  margin?: 'none' | 'small' | 'medium' | 'large';
  modifier_class?: string;
  attributes?: string;
};

// HTML generator
const generateHtmlCode = (args: HeadingArgs) => {
  const font_class = `heading--font-${args.font || 'heading'}`;
  const align_class = `heading--${args.align || 'left'}`;
  const margin_class = `heading--margin-${args.margin || 'none'}`;
  const final_modifier_class = `${font_class} ${align_class} ${margin_class} ${args.modifier_class || ''}`.trim();
  const lvl = args.level || 2;

  return args.content
    ? `<h${lvl} class="heading ${final_modifier_class}">${args.content}</h${lvl}>`
    : '';
};

const Template = (args: HeadingArgs) => (
  <div dangerouslySetInnerHTML={{ __html: generateHtmlCode(args) }} />
);

const meta: Meta<HeadingArgs> = {
  title: 'Atoms/Heading',
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
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    level: { control: { type: 'number', min: 1, max: 6 } },
    font: { control: 'text' },
    align: { control: { type: 'select', options: ['left', 'center', 'right'] } },
    margin: { control: { type: 'select', options: ['none', 'small', 'medium', 'large'] } },
    modifier_class: { control: 'text' },
    attributes: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<HeadingArgs>;

export const Default: Story = {
  args: {
    content: 'Hello Storybook!',
    level: 2,
    font: 'heading',
    align: 'left',
    margin: 'none',
    modifier_class: '',
    attributes: '',
  },
};

export const Centered: Story = {
  args: {
    content: 'Centered Heading',
    level: 2,
    font: 'heading',
    align: 'center',
    margin: 'medium',
    modifier_class: '',
    attributes: '',
  },
};

export const CustomFont: Story = {
  args: {
    content: 'Custom Font Heading',
    level: 2,
    font: 'custom-font',
    align: 'left',
    margin: 'large',
    modifier_class: '',
    attributes: '',
  },
};
