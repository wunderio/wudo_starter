// icon.helper.ts - helper for Storybook
import heart from '../../../assets/icons/heart.svg?raw';
import download from '../../../assets/icons/download.svg?raw';
import rightArrow from '../../../assets/icons/right-arrow.svg?raw';

export const icons: Record<string, string> = {
  'heart': heart,
  'download': download,
  'right-arrow': rightArrow,
};

export type IconArgs = {
  symbol: string;
  size?: 'small' | 'regular' | 'large';
  modifier_class?: string;
  alt?: string;
};

export const getIconHtml = ({ symbol, size = 'regular', modifier_class = '', alt }: IconArgs): string => {
  const svgRaw = icons[symbol];

  if (!svgRaw) {
    console.warn(`Icon helper: Icon "${symbol}" not found. Check icons object keys.`);
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgRaw, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (svgElement) {
    const sizeClass = size ? `icon--size-${size}` : '';
    const fullClass = `icon ${sizeClass} ${modifier_class}`.trim();

    svgElement.setAttribute('class', fullClass);
    svgElement.setAttribute('aria-hidden', alt ? 'false' : 'true');
    svgElement.setAttribute('role', 'img');

    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');

    if (alt) {
      svgElement.setAttribute('aria-label', alt);
    }

    return svgElement.outerHTML;
  }

  return '';
};
