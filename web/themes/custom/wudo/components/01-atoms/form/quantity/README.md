# Universal Quantity Input

A data-agnostic Web Component for numerical input handling.

## Dynamic Data Handling
The component automatically passes all `data-*` attributes assigned to the `<wudo-quantity>` element into the `quantity:update` event detail.

### Example Integration
If you need to update a cart via AJAX, pass your identifiers as data attributes:

```html
<wudo-quantity data-id="123" data-action="update-cart">...</wudo-quantity>
```

JavaScript:
```javascript
document.addEventListener('quantity:update', (e) => {
  const { value, id, action } = e.detail;

  if (action === 'update-cart') {
    console.log(`Updating item ${id} to quantity ${value}`);
  }
});
```

