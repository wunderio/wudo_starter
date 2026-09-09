# Toast Messages (SDC)

A premium, accessible (a11y) notification system designed for the Drupal SDC (Single Directory Components) ecosystem. This component bridges server-side Drupal system messages with a dynamic client-side JavaScript API, featuring a synchronized progress bar and hover-control.

## Features

* **Native Drupal Integration:** Seamlessly replaces the standard `status-messages.html.twig`.
* **Smart Dismissal Logic:**
  * `Status` & `Warning`: Auto-dismiss based on duration.
  * `Error`: Persistent until manually closed (WCAG compliance).
* **Interactive Hover State:**
  * **Pause:** Hovering over a toast pauses the countdown.
  * **Reset:** Moving the mouse away restarts the timer and animation from the beginning.
* **Visual Feedback:** A CSS-driven progress bar synchronized with the JavaScript timer.
* **Global JS API:** Trigger notifications from any external script via Custom Events.


## Drupal Implementation

To override the default Drupal system messages, place this in your theme's `templates/layout/status-messages.html.twig`:

```twig
{% if message_list is not empty %}
  {{ include('wudo:toast-messages', {
    message_list: message_list,
    position: 'top-right',
    duration: 5000
  }, with_context = false) }}
{% endif %}
```

## JavaScript API

Trigger a notification from your custom JS (e.g., AJAX success, form validation) using the global `wudo-toast` event:

```javascript
window.dispatchEvent(new CustomEvent('wudo-toast', {
  detail: {
    message: 'Profile updated successfully!',
    type: 'status' // Options: status, warning, error
  }
}));
```

## Configuration (Props)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `string` | `top-right` | UI corner: `top-right`, `top-left`, `bottom-right`, `bottom-left`. |
| `duration` | `int` | `5000` | Auto-dismiss delay in milliseconds. |

---

## Accessibility (a11y)

* **Screen Readers:** Uses `role="alert"` for immediate announcement of new messages.
* **Interaction:** The "Close" button features a translatable `aria-label`.
* **Persistence:** Critical `error` messages disable the auto-dismiss timer to ensure users have sufficient time to perceive and understand the failure.
