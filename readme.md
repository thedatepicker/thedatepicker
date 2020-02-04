TheDatepicker 
=============

Pure JavaScript Datepicker by [Slevomat.cz](https://www.slevomat.cz).

**[Try DEMO](https://thedatepicker.github.io/thedatepicker/)**


Install:
--------

> npm i thedatepicker

Download:
---------

https://github.com/thedatepicker/thedatepicker/releases

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
        (function () {
            const input = document.getElementById('my-input');
            const datepicker = new TheDatepicker.Datepicker(input);
            datepicker.render();
        })();
    </script>
</html>
```

Customize:
----------

`TheDatepicker.Datepicker` constructor accepts two arguments. First is an instance of **input element**,
second is an instance of **container element**. Both are optional, but at least one must be present.

For example ...

```
<div id="my-container"></div>

const container = document.getElementById('my-container');
new TheDatepicker.Datepicker(null, container);
```

... will render datepicker into given `<div>`.

### Options:

To see bunch of possible settings, visit https://thedatepicker.github.io/thedatepicker/

For example:

```javascript
datepicker.options.setMinDate('today');
``` 

*Enjoy*
