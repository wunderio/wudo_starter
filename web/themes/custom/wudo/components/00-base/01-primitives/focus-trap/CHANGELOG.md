# Focus Trap Changelog

## 1.0.1

### Fixed
- **`_getElements()` now filters out `[inert]` subtrees** — elements nested inside `[inert]` containers were incorrectly returned as focusable candidates. Added `!el.closest('[inert]')` check.

## 1.0.0

- Initial release with stack-based `FocusTrapManager` and `FocusTrap` class.
- Dynamic focusable element discovery on every Tab press.
- Support for `additionalElements` outside the container.
- `Escape` key dispatches `focusTrap:escape` custom event.
