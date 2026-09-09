import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Title,
  Primary,
  Controls,
  Stories,
  Source as StorybookSource,
} from '@storybook/addon-docs/blocks';

import './button.css';
import '../badge/badge.css';
import '../icon/icon.css';
import cssCode from './button.css?raw';
import { getIconHtml } from '../icon/icon.helper';

type ButtonArgs = {
  type?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'regular' | 'large';
  text: string;
  url?: string;
  icon?: 'download' | 'right-arrow' | 'heart';
  icon_only?: boolean;
  icon_placement?: 'before' | 'after';
  is_disabled?: boolean;
  is_new_window?: boolean;
  badge_content?: string;
  modifier_class?: string;
};

const generateHtmlCode = (args: ButtonArgs) => {
  const isAnchor = !!args.url;
  const tag = isAnchor ? 'a' : 'button';
  const iconHtml = args.icon ? getIconHtml({
    symbol: args.icon,
    size: args.size,
    modifier_class: 'button__icon'
  }) : '';

  const classes = [
    'button',
    `button--${args.type || 'primary'}`,
    `button--${args.size || 'regular'}`,
    args.icon_only ? 'button--icon-only' : '',
    args.badge_content ? 'button--with-badge' : '',
    args.modifier_class || '',
  ].filter(Boolean).join(' ');

  const textHtml = `<span class="${args.icon_only ? 'visually-hidden' : 'button__text'}">${args.text}</span>`;
  const content = args.icon_placement === 'after' ? `${textHtml}${iconHtml}` : `${iconHtml}${textHtml}`;

  const attr = isAnchor
    ? `href="${args.url}" ${args.is_new_window ? 'target="_blank" rel="noopener"' : ''}`
    : `type="button" ${args.is_disabled ? 'disabled' : ''}`;

  return `
<${tag} class="${classes}" ${attr}>
  ${content}
  ${args.badge_content ? `<span class="badge badge--corner badge--red">${args.badge_content}</span>` : ''}
</${tag}>`.trim();
};

const meta: Meta<ButtonArgs> = {
  title: 'Atoms/Button',
  render: (args) => (
    <div dangerouslySetInnerHTML={{ __html: generateHtmlCode(args) }} style={{ display: 'contents' }} />
  ),
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
        transform: (_input, storyContext) => generateHtmlCode(storyContext.args as ButtonArgs),
        language: 'html',
        format: true,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    size: { control: 'select', options: ['small', 'regular', 'large'] },
    icon: { control: 'select', options: ['right-arrow', 'download', 'heart'] },
    icon_placement: { control: 'inline-radio', options: ['before', 'after'] },
    is_disabled: { control: 'boolean' },
    icon_only: { control: 'boolean' },
    badge_content: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const PrimaryDefault: Story = {
  args: {
    type: 'primary',
    text: 'Order item',
    icon: 'right-arrow',
    icon_placement: 'before',
  },
};

export const WithIcon: Story = {
  args: {
    ...PrimaryDefault.args,
    icon: 'heart',
    text: 'Like',
  },
};

export const LinkButton: Story = {
  args: {
    type: 'secondary',
    text: 'Download PDF',
    url: 'https://example.com/spec.pdf',
    is_new_window: true,
    icon: 'download',
  },
};
