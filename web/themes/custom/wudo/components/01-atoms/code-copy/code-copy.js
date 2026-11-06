/**
 * @file
 * Puts a copy button in the code blocks of the text the component is in
 * that the editor gave the "Copy button" style (pre.copyable).
 *
 * The button comes from the component's template, with its icons and
 * translated labels. Each block is wrapped in .code-block, so the button
 * stays in the corner while a long line scrolls. The result is said once in
 * a status region, for screen readers.
 */
(function (Drupal, once) {
  'use strict';

  const RESET_AFTER = 2000;
  let status;

  const announce = (message) => {
    if (!status) {
      status = document.createElement('div');
      status.className = 'visually-hidden';
      status.setAttribute('role', 'status');
      document.body.append(status);
    }
    status.textContent = '';
    // A new text in an emptied region is read even when it repeats.
    window.setTimeout(() => { status.textContent = message; }, 50);
  };

  // Without a secure context (plain http) there is no Clipboard API.
  const fallbackCopy = (text) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    }
    catch {
      copied = false;
    }
    area.remove();
    return copied;
  };

  const copy = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return fallbackCopy(text);
  };

  const enhance = (pre, template) => {
    const code = pre.querySelector(':scope > code');
    if (!code || !code.textContent.trim()) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre);

    const button = template.content.firstElementChild.cloneNode(true);
    const label = button.title;
    const text = button.querySelector('.visually-hidden');
    let timer;

    const show = (message, state) => {
      button.title = message;
      text.textContent = message;
      button.classList.toggle('is-copied', state === 'copied');
      announce(message);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.title = label;
        text.textContent = label;
        button.classList.remove('is-copied');
      }, RESET_AFTER);
    };

    button.addEventListener('click', async () => {
      try {
        if (!(await copy(code.textContent))) {
          throw new Error('Copying failed');
        }
        show(button.dataset.copied, 'copied');
      }
      catch {
        show(button.dataset.failed, 'failed');
      }
    });

    wrapper.append(button);
  };

  Drupal.behaviors.wudoCodeCopy = {
    attach(context) {
      once('wudo-code-copy', '.code-copy-template', context).forEach((template) => {
        const text = template.parentElement;
        text.querySelectorAll('pre.copyable').forEach((pre) => enhance(pre, template));
      });
    },
  };

})(Drupal, once);
