# Code Copy

A small button in the corner of a code block that copies the code. A block
gets one when the editor chooses "Copy button" in CKEditor's Style
menu, which gives it the class `copyable` (`<pre class="copyable">`); other
code blocks stay without. After copying it shows a check for two seconds, and says "Copied" to
screen readers. Without JavaScript the code blocks stay as they are.

`templates/fields/field--text-long.html.twig` renders the component once
beside a formatted text that has such a block, so its script and styles load
only on those pages:

```twig
{% if 'copyable' in text|render %}
  {{ include('wudo:code-copy', {}, with_context = false) }}
{% endif %}
```

The component renders the button as a `<template>`, with its icons from
`wudo:icon` (`copy` and `check`) and its translated labels; `code-copy.js`
wraps each `pre.copyable` of the text in `.code-block` and puts a copy of the
button in it. The code blocks themselves are styled in `_text-long.scss`.

Editors add code blocks with CKEditor's "Code Block" button, in the Full HTML
text format, and the button with Style → "Copy button" while the
cursor is in the block. Choosing the style again removes it.
