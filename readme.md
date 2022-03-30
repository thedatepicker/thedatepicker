[![](https://data.jsdelivr.com/v1/package/npm/thedatepicker/badge)](https://www.jsdelivr.com/package/npm/thedatepicker)
![](https://img.shields.io/github/stars/thedatepicker/thedatepicker.svg)
![](https://badge-size.herokuapp.com/thedatepicker/thedatepicker/master/dist/the-datepicker.min.js)
![](https://img.shields.io/github/license/thedatepicker/thedatepicker.svg)


TheDatepicker 
=============

Highly customizable pure JavaScript Datepicker by [Slevomat.cz](https://www.slevomat.cz).

**[Try DEMO](https://thedatepicker.github.io/thedatepicker/)**  
**[Plyaground](https://jsfiddle.net/hejdav/742cswpz/6/)**


Installation:
-------------

### Download:

https://github.com/thedatepicker/thedatepicker/releases/latest  
Link `dist/the-datepicker.min.js` and `dist/the-datepicker.css` in your HTML.


### NPM:

`npm i thedatepicker`

### CDN:

https://cdn.jsdelivr.net/npm/thedatepicker@latest/dist/the-datepicker.min.js  
https://cdn.jsdelivr.net/npm/thedatepicker@latest/dist/the-datepicker.css


Usage:
------

```html
<html>
    <head>
        <script src="dist/the-datepicker.min.js"></script>
        <link rel="stylesheet" href="dist/the-datepicker.css">
    </head>
    
    <body>
        <input type="text" id="my-input">
    </body>
    
    <script>
        const input = document.getElementById('my-input');
        const datepicker = new TheDatepicker.Datepicker(input);
        datepicker.render();
    </script>
</html>
```


Customize:
----------

`TheDatepicker.Datepicker` constructor accepts two arguments. First is an instance of an **input element**,
second is an instance of a **container element**. Both are optional, but at least one must be present.

For example ...

```html
<div id="my-container"></div>

<script>
const container = document.getElementById('my-container');
new TheDatepicker.Datepicker(null, container);
</script>
```

... will render the datepicker into the given `<div>`.

### Options:

To see bunch of possible settings, visit https://thedatepicker.github.io/thedatepicker/

For example:

```javascript
datepicker.options.setMinDate('today');
```

- Some options take effect only if changed before the first datepicker open.
- Learn more about options in [source code](https://github.com/thedatepicker/thedatepicker/blob/master/src/Options.ts) (setters are commented).
- Do not forget to call `datepicker.render()` to start using datepicker.
- Changing options after render takes effect immediately only if you call `datepicker.render()` again.
