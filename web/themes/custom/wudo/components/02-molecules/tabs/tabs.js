(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.wudoTabs = {
    attach: (context) => {
      const containers = once('wudo-tabs', '[data-tabs-container]', context);

      containers.forEach((container) => {
        const placeholder = container.querySelector('.tabs__nav-placeholder');
        const items = container.querySelectorAll('.tabs__item');
        const tabsLabel = container.getAttribute('data-tabs-label') || 'Tabs';
        // Generate unique ID for the tabs instance
        const generateId = () => 'tabs-' + Math.random().toString(36).substring(2, 9);
        const tabsId = generateId();

        const tabList = document.createElement('div');
        tabList.setAttribute('role', 'tablist');

        // Adding aria-label for better accessibility
        tabList.setAttribute('aria-label', tabsLabel);
        tabList.className = 'tabs__list';

        items.forEach((item, index) => {
          const title = item.getAttribute('data-tab-title') || 'Tab ' + (index + 1);
          const panelId = `${tabsId}-panel-${index}`;
          const tabId = `${tabsId}-tab-${index}`;

          item.setAttribute('role', 'tabpanel');
          item.id = panelId;
          item.setAttribute('aria-labelledby', tabId);
          item.hidden = index !== 0;
          // Add tabindex to make panels focusable
          item.setAttribute('tabindex', '0');

          const button = document.createElement('button');
          button.type = 'button';
          button.id = tabId;
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-selected', index === 0);
          button.setAttribute('aria-controls', panelId);
          button.setAttribute('tabindex', index === 0 ? '0' : '-1');
          button.className = `tabs__tab ${index === 0 ? 'is-active' : ''}`;
          button.textContent = title;

          tabList.appendChild(button);
        });

        if (placeholder) placeholder.replaceWith(tabList);

        const tabs = tabList.querySelectorAll('[role="tab"]');

        const setActiveTab = (newTab) => {
          tabs.forEach(t => {
            const active = t === newTab;
            t.setAttribute('aria-selected', active);
            t.setAttribute('tabindex', active ? '0' : '-1');
            t.classList.toggle('is-active', active);

            const panel = container.querySelector(`#${t.getAttribute('aria-controls')}`);
            if (panel) panel.hidden = !active;
          });
          newTab.focus();
        };

        // Click event handler
        tabList.addEventListener('click', (e) => {
          const target = e.target.closest('[role="tab"]');
          if (target) setActiveTab(target);
        });

        // Keydown event handler for keyboard navigation
        tabList.addEventListener('keydown', (e) => {
          let index = Array.from(tabs).indexOf(document.activeElement);
          if (index === -1) return;

          let nextIndex;
          switch (e.key) {
            case 'ArrowRight':
              nextIndex = (index + 1) % tabs.length;
              setActiveTab(tabs[nextIndex]);
              break;
            case 'ArrowLeft':
              nextIndex = (index - 1 + tabs.length) % tabs.length;
              setActiveTab(tabs[nextIndex]);
              break;
            case 'Home':
              setActiveTab(tabs[0]);
              break;
            case 'End':
              setActiveTab(tabs[tabs.length - 1]);
              break;
          }
        });
      });
    }
  };
})(Drupal, once);
