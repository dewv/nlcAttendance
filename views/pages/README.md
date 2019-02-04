
In this folder, create a subfolder for each Sails models using the RestController.

The RestController will look for files named `createForm.html` and `editForm.html` when handling REST requests to, respectively, create and edit a record. If the file is not present, the controller will respond to the the client with a 404 error.

If a single form will handle both creating and editing a record, save the form as `createForm.html`, then create a symlink (shortcut) with the bash command `ln -s createForm.html editForm.html`.