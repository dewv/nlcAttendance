# Contributing to NLC Attendance tracker

## What should I know before I get started?

### Setting up your development environment

These instructions assume that you are using a c9 workspace based on the blank Ubuntu template. But the process would be similar for any Linux environment where Node.js and MySQL are already installed.

In a bash terminal, run the following commands. (The `#` lines are comments; you don't need to type them.) You should need to run these commands only once.

```bash
# Clone the repository from GitHub
git clone https://github.com/dewv/nlcAttendance

# Navigate to the project folder (root of the git repository)
cd nlcAttendance

# Install the *latest* version of the mocha test software
npm install -g mocha@latest

# Upgrade c9's dusty old version of node
nvm install 11
nvm use 11
nvm alias default 11
```

This project uses the npm package manager. 

```bash
# Install the dependencies listed in package.json
npm install
```

A file named `package.json` lists all of the libraries and modules required to launch the application. Once in a while, new dependencies might be added to the file. (This should only happen when there is a consensus among the team. Avoid unilaterally introducing new dependencies.) When this happens, you will need to run the preceding command to install the newly required components.

You might also [customize your git client](https://gist.github.com/smattingly/8350f90af596346acdd683c186a57a26#file-configuregit-md).

### The server stack

The application is built on the following server software stack.

- Sails
- Express
- Node.js

[Node.js](htttps://nodejs.org/) is HTTP (Web) server software customized for running JavaScript on the server. It provides lower level services that you will very rarely work with.

[Express](https://expressjs.com/) extends Node with features for routing, which here means mapping incoming Web requests to the code that should handle them. The application URLs follow common [REST](https://en.wikipedia.org/wiki/Representational_state_transfer#Relationship_between_URI_and_HTTP_methods) [patterns](http://microformats.org/wiki/rest/urls). It will be fairly rare for you to work with features at this level.

[Sails](https://sailsjs.com/) extends Express to use the [Model-View-Controller](https://en.wikipedia.org/wiki/Model–view–controller) (MVC) design pattern. This has a large impact on the  application structure and on its file tree. It will be useful for you to know about [models](https://sailsjs.com/documentation/concepts/models-and-orm/models) and [helpers](https://sailsjs.com/documentation/concepts/helpers).

The application uses [Embedded JavaScript](https://ejs.co/) (EJS) for views; this is Sails' default view engine. It eases [templating](https://en.wikipedia.org/wiki/Web_template_system)-- the process of dynamically modifying HTML resources on the server, before the result is sent to the client. It is an *important project convention* that EJS use is limited to simple data binding. Complex logic should be implemented in the Sails framework (probably as helpers).

For data storage, the application uses MySQL. However, there is no SQL embedded within the code. Instead, models are built on the Sails object request manager (ORM), which provides a standard interface to many types of data storage engines. 

### The file tree

The project file tree sticks closely to the [standard Sails app structure](https://sailsjs.com/documentation/anatomy). Your work will typically be in the `api/models`, `api/helpers`, and `views/pages` folders. 

There are two extensions to note.

- The standard `views/pages` folder is populated with multiple subfolders; one for each model that has a user interface. Since each model may have multiple views (multiple HTML/EJS files), these subfolders provide organization and serve as namespaces.
- Following the mocha test tool's convention, there is a top level folder named `test`. This contains all of the automated mocha test code for the application.

## Launching the application

These instructions are specifically for launching the application in a *development* environment.

Before starting the application, two prerequisites must be met.

1. The `mysql` database server must be running. *In c9*, the command is `mysql-ctl start`. (The service may already be running, but there is no harm in re-running this in c9.)
2. A database for the application must exist. If you are about to start the app for the first time, run this command: `mysql -u root -e "CREATE DATABASE nlcAttendance;"`

:construction: (Note: I will be trying to automate those steps soon.)

When the prerequisites are met, you can start the application with this command.

`sails lift`

:construction: (Note: before I try to explain the whole drop/safe/whatever deal, I am going to try to handle that automatically too. For now, just ask.)

You can now access the application by pointing your Web browser to `https://WORKSPACE-USER.c9users.io`, where `WORKSPACE` represents the name of your c9 workspace, and `USER` is your c9 username.

In the terminal where you launched the application, various messages will appear as incoming traffic is handled. 

Use `Ctrl-C` to terminate the application.

## Components of the application

### Models

Models handle data storage and retrieval for a particular type of object or record.

The application has the following major models. "Major" means that the application provides a user interface for manipulating model data.

- Student: represents a student profile record
- Staff: represents a staff profile record
- Visit: represents a student visit to the Naylor Learning Center

The following minor models exist only as "reference lists." Data for these models is manipulated only by DevOps staff, using technical tools outside of the application.

- Major: the set of majors that can appear on a student profile
- FallSport: the set of Fall sports that can appear on a student profile
- SpringSport: the set of Spring sports that can appear on a student profile

### Views

Views present information to the user. For data entry/editing, this means an HTML form; for read-only displays it means some other HTML page.

The Student and Staff components use a "find or create" approach. This means that there is no user interface for creating a new user profile (whether Student or Staff). Instead, the username presented at login is used to search for an existing record. If none is found (which implies it is the user's first login to the application), then a record is created. With this approach, it is feasible to provide an "edit only" user interface.

Accordingly, the `student` and `staff` folders (will) have only an `editForm.html` file, following the naming convention expected by the `RestController` class (see the next section).

The Visit component must support creating new records (known as a "check in") and editing existing records (known as a "check out").  So, the `visit` folder will contain `createForm.html` and `editForm.html`, named in anticipation that the `RestController` can be used. 

:construction: (Note: more needs to be said (and figured out) about views like what displays after a successful add, edit etc. There will also be a "display list" type view of Visits (staff access only), but I need to build out the structure for that.)

### Controllers

A controller directs and coordinates the behavior of a model and a view. Based on an incoming request, a controller usually instructs a model to perform certain operations, and activates a view to respond to the user. The controller "knows how to talk to" the model and the views; the model and views never communicate directly. When the response to a request contains existing data, the controller requests the needed data from the model, and passes it to the view.

For simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) requests issued through RESTful URLs, controller logic can be largely standardized. This application defines a `RestController` class which handles requests of the following forms, where `:model` represents the name of a major model, and `:id` represents the ID number of a single data record.

- `GET /:model/:id`
- `GET /:model/new`
- `POST /:model`
- `GET /:model/:id/edit`
- `POST /:model/:id`

:construction: More RESTful URLs will be added to the controller.

The `RestController` can communicate with any model driven by the Sails ORM, using the [model API](https://sailsjs.com/documentation/reference/waterline-orm/models#?builtin-model-methods) and the application's helpers (see next section). The `RestController` expects to find a `views/pages` subfolder that is named for the model, containing `createForm.html` and/or `editForm.html` files (depending on which operations are supported.)

### Helpers

The application's helpers are documented [here](https://dewv.github.io/nlcAttendance).

## Style guides

### git commit messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript style checking

:construction: eslint 

### mocha style guide

- Include thoughtfully-worded, well-structured mocha tests in the `test` folder.
- Treat `describe` as a noun or situation.
- Treat `it` as a statement about state or how an operation changes state.

#### Example

```javascript
TBD
```

### Documentation Styleguide

* jsdoc, but how?
* Use [Markdown](https://daringfireball.net/projects/markdown).
* Reference methods and classes in markdown with the custom `{}` notation:
    * Reference classes with `{ClassName}`
    * Reference instance methods with `{ClassName::methodName}`
    * Reference class methods with `{ClassName.methodName}`

#### Example

```javascript
/**
*/
```

## Additional Notes

### Issue and Pull Request Labels

:construction:
