
This folder is for [controllers](https://sailsjs.com/documentation/concepts/actions-and-controllers#?controllers).

By default, the [routing](https://sailsjs.com/documentation/concepts/routes) is configured to use the `RestController` class for all models. 

`RestController` handles the following requests, defined [like this](http://http://microformats.org/wiki/rest/urls).

1. `GET /:model/new`
2. `POST /:model`
3. `GET /:model/:id/edit`
4. `POST /:model/:id`

Custom controllers can be used on a model-by-model basis. Define the custom controller in this folder, and define the routes in `config/routes.js`.