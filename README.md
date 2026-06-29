# JIAI Solutions Static Website

This is a self-contained static website. Upload everything in this folder to your hosting server and point your URL at `index.html`.

## Files

- `index.html` - page content and editable contact configuration.
- `styles.css` - desktop and mobile styling.
- `script.js` - mobile menu, dropdowns, modals, and contact form behavior.
- `assets/` - local image assets used by the page.

## Contact Form

By default, the form opens an email draft to `hello@jiaisolutions.com`.

To connect a real backend or form service later, edit this block near the bottom of `index.html`:

```html
<script>
  window.JIAI_CONFIG = {
    contactEmail: "hello@jiaisolutions.com",
    formEndpoint: ""
  };
</script>
```

Set `formEndpoint` to your server endpoint URL. The site will send JSON with `name`, `email`, `company`, `service`, and `message`.
