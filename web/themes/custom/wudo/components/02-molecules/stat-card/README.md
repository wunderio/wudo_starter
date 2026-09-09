# Stat Card

A dynamic statistics component that displays a numeric value with an animated "count-up" effect. This is a hybrid **SDC + Web Component**.

## Features
- **Animated Counter**: Automatically counts up from 0 to the target number upon entering the viewport.
- **Web Component Power**: Logic is encapsulated within the `<wudo-count-up>` native custom element.
- **Flexible Suffix**: Supports symbols like `%`, `+`, `km`, `€`, etc., via props.
- **Dark Mode Ready**: Styled using CSS Custom Properties for seamless theme switching.

## Props

| Property   | Type      | Default | Description                                      |
|:-----------|:----------|:--------|:-------------------------------------------------|
| `number`   | `integer` | *Required* | The final target number to reach.              |
| `suffix`   | `string`  | `null`  | Character(s) displayed after the number.         |
| `label`    | `string`  | `null`  | Descriptive text displayed below the number.     |
| `duration` | `integer` | `2000`  | Duration of the count-up animation in milliseconds.|

## Usage (Twig)

The component can be included in any Drupal template using the SDC syntax:

```twig
{% include 'your_theme_name:stat-card' with {
  number: 145,
  suffix: '%',
  label: 'Success Rate',
  duration: 2500
} %}
```
