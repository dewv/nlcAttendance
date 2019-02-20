In this folder, create a subfolder for each Sails model. HTML files for the model's views should go in that subfolder.

In general, each HTML file/view should be a "fragment" rather than a complete HTML page. This is because, by default, the view contents will be embedded within the `views/layout/layout.html` file, which defines the common HTML content at the top and bottom of every page.

If the model is routed via the `RestController` class, the controller will look for view files named `createForm.html` and `editForm.html` when handling REST requests to, respectively, create and edit a record. If the file is not present, the controller will respond to the the client with a 404 error.

If a single form will handle both creating and editing a record, save the form as `createForm.html`, then create a symlink (shortcut) with the bash command `ln -s createForm.html editForm.html`.

The `RestController` will pass the properties of a [ViewData](https://dewv.github.io/nlcAttendance/docs/global.html#ViewData) object (*not* the object itself) into the views for use by the Embedded JavaScript ([EJS](https://ejs.co/)) templating engine.
