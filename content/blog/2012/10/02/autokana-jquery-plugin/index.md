---
title: autokana – jQuery plugin
date: "2012-10-02T00:00:00.000Z"
description: Roumaji-to-latin auto-correct converter jQuery plugin.
featuredImage: /assets/featured/autokana.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/42
tags: ["auto-correct", "free", "hiragana", "japanese", "javascript", "jquery", "katakana", "open source", "plugin"]
---

Autokana is a jQuery plugin that automatically converts latin (roumaji) to kana (hiragana / katakana) using the auto-correct principle (keep in mind that it's not suitable for converting copy / pasted but only typed-in text).

You can download the plugin (including a simple usage example) from [GitHub](https://github.com/pootzko/autokana) and use it for free.

To use it, you will have to add the following somewhere at the beginning of your body tag:

```html
<script type="text/javascript">
  // bind events when document is ready
  $(document).ready(function() {
    // attach auto-kana plugin with default options
    $("#kana_text_box").autokana();
  });
</script>
```

After that add the input box itself wherever you need it (make sure to use the same ID in the above part and in the input field itself):

```html
<input id="kana_text_box" type="text" />
<script type="text/javascript">
  // this part will clear and set focus on the input field on refresh
  // feel free to remove that part if you don't need it
  document.getElementById("kana_text_box").value="";
  document.getElementById("kana_text_box").focus();
</script>
```

If you have any suggestions or bug reports, feel free to leave a comment.