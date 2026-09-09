import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
  Source as StorybookSource,
} from '@storybook/addon-docs/blocks';

import './attribute-list.css';
import cssCode from './attribute-list.css?raw';

type AttributeItem = {
  label: string;
  value: string;
  highlight?: boolean;
};

type AttributeListArgs = {
  title?: string;
  title_tag?: 'h2' | 'h3' | 'h4' | 'h5' | 'div';
  display_mode: 'table' | 'grid' | 'inline';
  items: AttributeItem[];
  attributes?: string;
};

const generateHtmlCode = (args: AttributeListArgs) => {
  const displayClass = `attribute-list--${args.display_mode || 'table'}`;
  const titleTag = args.title_tag || 'h3';

  const itemsHtml = args.items
    .map(
      (item) => `
      <div class="attribute-list__item${item.highlight ? ' attribute-list__item--highlight' : ''}">
        <dt class="attribute-list__label">
          <span class="attribute-list__label-text">${item.label}</span>
        </dt>
        <dd class="attribute-list__value">${item.value}</dd>
      </div>`
    )
    .join('');

  return `
<section class="attribute-list ${displayClass}" ${args.attributes || ''}>
  ${args.title ? `<${titleTag} class="attribute-list__title">${args.title}</${titleTag}>` : ''}
  <dl class="attribute-list__container">
    ${itemsHtml}
  </dl>
</section>`.trim();
};

const Template = (args: AttributeListArgs) => (
  <div dangerouslySetInnerHTML={{ __html: generateHtmlCode(args) }} />
);

const meta: Meta<AttributeListArgs> = {
  title: 'Molecules/AttributeList',
  render: Template,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>Definition list (dl, dt, dd).</Subtitle>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <div>
            <h3>Component CSS (SCSS compiled)</h3>
            <StorybookSource code={cssCode} language="css" dark={true} />
          </div>
        </>
      ),
      source: {
        transform: (_input, storyContext) => generateHtmlCode(storyContext.args as AttributeListArgs),
        language: 'html',
        format: true,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    title_tag: {
      control: 'select',
      options: ['h2', 'h3', 'h4', 'h5', 'div']
    },
    display_mode: {
      control: 'select',
      options: ['table', 'grid', 'inline']
    },
    items: { control: 'object' },
    attributes: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<AttributeListArgs>;

export const Default: Story = {
  args: {
    title: 'Technical Specifications',
    title_tag: 'h3',
    display_mode: 'table',
    items: [
      { label: 'Power', value: '3x400 V (+/-10%)' },
      { label: 'Frequency', value: '50/60 Hz' },
      { label: 'Weight', value: '56 kg', highlight: true },
      { label: 'Insulation class', value: 'H' },
    ],
  },
};

export const WithoutTitle: Story = {
  args: {
    display_mode: 'table',
    items: [
      { label: 'Serial number', value: 'TP-402-AC/DC' },
      { label: 'Warranty', value: '24 months' },
    ],
  },
};

export const HighlightedOnly: Story = {
  args: {
    title: 'Important Specifications',
    display_mode: 'table',
    items: [
      { label: 'Max voltage', value: '400 A', highlight: true },
      { label: 'Duty', value: '60%', highlight: true },
    ],
  },
};
