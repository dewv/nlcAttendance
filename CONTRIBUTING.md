# Contributing to NLC Attendance tracker

## About this application

This application tracks student attendance at Davis & Elkins College's Naylor Learning Center. It is a  [DevOps](https://dewv.net/) project.

## Use cases

Here is a description of the application's behavior, organized according to usage scenarios.

### Sign in and user roles

D&E students and staff access the application using a Web browser. They must authenticate using their D&E account credentials; the application communicates with the college's directory server.

Based on user account credentials and directory information, the application can distinguish students from staff; different types of users have different access permissions.

When a user successfully signs in, the application checks for their profile record-- staff or student, as appropriate. If no record is found (because it is the user's first time using the system), a default record is automatically created. Newly created records will have a flag set to indicate that the user must update their profile information. If desired, DevOps staff can manually set the flag for existing user accounts.

### Mandatory profile updates

The application now has a profile record for the user. If the "force update" flag is set, the application routes the user to the appropriate profile update form-- student or staff. The application will not allow the user to access any other features while the flag is set. Submitting the appropriate profile update form clears the "force update" flag.

Staff users can access all staff features from any Web browser.

Student users can update their profile information from any Web browser. However, they can check in and check out only from specially "registered" browsers on PCs located in the Naylor Learning Center.

### Student check in, check out

When a student signs in to the application, different screens may greet them, according to the following logic.

If the student is using an "unregistered" browser, or the "force update" flag is set on their profile record, they will see the student profile update form. As previously discussed, this is the *only* feature students can access from an "unregistered" browser.

Otherwise, if the student is checked out (i.e., they have no open Visit record), they will be taken to the check in (Visit create) form. The form requires them to describe the purpose of their Visit to the NLC. When the form is submitted, a Visit record is created, storing the student's identity, purpose of their visit, the date/time of form submission, and the location (see "Register this browser", below). This is an "open" Visit record; the student is now checked in. The application will display a success message and a "sign out" link. Because the application is used in "kiosk mode" on shared PCs, the student will automatically be logged out after a short delay. The application will display the sign in page.

Otherwise, the student is checked in (i.e., they have an open Visit record). They will be taken to the check out (Visit update) form. The form always displays the student's check in date/time and purpose of their visit. It requires them to indicate if that purpose was achieved (Yes, No, or Not sure), if they used a tutor (Yes, No), and if they did, for which tutorCourses were they tutored (text area). There is a text area for optional Comments. As a special case, if the date of the student's check in is *not* the current system date, the form asks them to estimate the duration of their visit, in quarter-hour increments, up to a maximum of 8 hours. In the normal case, the student is checking out the same day that they checked in, and the date/time of their check out is automatically captured at form submission. (The timestamps automatically placed on Sails models will serve as the check in and (actual, not estimated) check out times.) The Visit record is updated with the information from the form, the duration of the Visit, plus a flag that indicates if the duration was estimated or not. The Visit record is now "closed"; the student is checked out. The application will display a success message and a "sign out" link. Because the application is used in "kiosk mode" on shared PCs, the student will automatically be logged out after a short delay. The application will display the sign in page.

### Voluntary student profile updates

In case the student wishes to voluntarily update their user profile, a link to the update form will appear on the check in form, check out form, and the success pages that briefly appear after both operations.

### The staff menu

Unless the "force update" flag is routing them to their profile update form, a staff user is presented with a menu of choices.

#### Register this browser

A link to a form that prompts the user to enter a "location" string. On form submit, this string is stored as the value of a cookie in the browser. It is the presence of this cookie that "registers" a browser so that it permits check in and check out operations. The expiration time of the cookie is one year from the time of creation.

The location value is stored on each student Visit record created with the browser.

#### View attendance data

A link to a page that displays a table of all Visit records in reverse chronological order (most recent first). The following columns are included.

- Student Name
- Check In
- Check Out
- Visit Length (computed to nearest quarter-hour)
- Purpose
- Purpose Achieved?
- Tutoring
- Comments
- Check out estimated?

#### Dump spreadsheet data

A link to a page that displays a table of all Visit records in reverse chronological order (most recent first). All available data attributes are present, including the computed Visit length.

The intent is for this table to be copied and pasted into a spreadsheet.

Possible future enhancement: this triggers a file download. Discuss with customer contact. May want a way to track what has been previously downloaded.

#### Update your profile

A link to the profile update form, for voluntary updates.

#### Sign out

A link that ends the staff user's login session.


## What should I know before I get started?

### Setting up your development environment

These instructions assume that you are using a c9 workspace based on the blank Ubuntu template. But the process would be similar for any Linux environment where Node.js and MySQL are already installed.

In a bash terminal, run the following commands. (The `#` lines are comments; you don't need to type them.)

```bash
# Upgrade c9's dusty old version of Node
nvm install 11
nvm use 11
nvm alias default 11

# Install Sails globally
npm install sails -g

# Clone the repository from GitHub
git clone https://github.com/dewv/nlcAttendance

# Navigate to the project folder (root of the git repository)
cd nlcAttendance

# Install the dependencies listed in package.json
npm install
```

The commands to upgrade Node and install Sails only need to be run once in a c9 workspace. (In other words, if you are already using Node version 11 and Sails in your c9 workspace, you don't need to run the commands for each project.

The remaining commands set up this application's project.

A file named `package.json` lists all of the libraries and modules required to launch the application. Once in a while, new dependencies might be added to the file. (This should only happen when there is a consensus among the team. Avoid unilaterally introducing new dependencies.) When this happens, you will need to run the `npm install` command again, to install the newly required components.

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

```bash
# Start the application
npm run sails
```

The command above runs a script defined in `package.json`. The script starts the c9 MySQL database server, then starts the Node/Express/Sails application. You should see a series of messages, ending with one that says the server is connected to port 8080.

You can now access the application by pointing your Web browser to `https://WORKSPACE-USER.c9users.io`, where `WORKSPACE` represents the name of your c9 workspace, and `USER` is your c9 username.

In the terminal where you launched the application, various messages will appear as incoming traffic is handled.

Use `Ctrl-C` to terminate the application.

## Running tests

There are four `package.json` scripts for checking code quality in the application.

- `npm run lint` will check the JavaScript code against the rules defined in `.eslintrc`, and fix some problems that it identifies.
- `npm run htmlhint` will check the HTML content according to the rules defined in `.htmlhintrc`.
- `npm run mocha` will run all automated test cases.
- `npm run coverage` will check how much of the code is tested by the mocha process, enforcing a threshold of 95% or higher.

All four of these scripts are run, in the order listed, when the command `npm test` is issued. Notice that this is a standard script, so the word `run` is not needed.

It is important to run `npm test` and verify successful results before issuing a pull request.

When pull requests to master are created, the Travis CI (continuous integration) service will automatically create a virtual machine in the cloud, clone the application's git repository, run the `npm install` script, and run the `npm test` script.

The pull request will be marked with the CI results, indicating that all status checks passed, or that some failed.

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

Each major model should define a `createDevelopmentData` function that creates sample data for the model and possibly for associated minor models. The function should be called from `config/bootstrap.js` in order to populate the database at runtime. See the `Student` model for an example.

### Views

Views present information to the user. For data entry/editing, this means an HTML form; for read-only displays it means some other HTML content.

Views are files containing HTML, but they do not define complete HTML pages. EJS embeds all view files within the `views/layouts/layout.html` file, which defines standard content for the top and bottom of all the app's HTML pages.

The Student and Staff components use a "find or create" approach. This means that there is no user interface for creating a new user profile (whether Student or Staff). Instead, the username presented at login is used to search for an existing record. If none is found (which implies it is the user's first login to the application), then a record is created. With this approach, it is feasible to provide an "edit only" user interface.

Accordingly, the `student` and `staff` folders (will) have only an `editForm.html` file, following the naming convention expected by the `RestController` class (see the next section).

The Visit component must support creating new records (known as a "check in") and editing existing records (known as a "check out").  So, the `visit` folder will contain `createForm.html` and `editForm.html`, named in anticipation that the `RestController` can be used.

### Controllers

A controller directs and coordinates the behavior of a model and a view. Based on an incoming request, a controller usually instructs a model to perform certain operations, and activates a view to respond to the user. The controller "knows how to talk to" the model and the views; the model and views never communicate directly. When the response to a request contains existing data, the controller requests the needed data from the model, and passes it to the view.

For simple [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) requests issued through RESTful URLs, controller logic can be largely standardized. This application defines a `RestController` class which handles requests of the following forms, where `:model` represents the name of a major model, and `:id` represents the ID number of a single data record.

- `GET /:model/:id`
- `GET /:model/new`
- `POST /:model`
- `GET /:model/:id/edit`
- `POST /:model/:id`

The `RestController` can communicate with any model driven by the Sails ORM, using the [model API](https://sailsjs.com/documentation/reference/waterline-orm/models#?builtin-model-methods) and the application's helpers (see next section). The `RestController` expects to find a `views/pages` subfolder that is named for the model, containing `createForm.html` and/or `editForm.html` files (depending on which operations are supported.)

Note: in development mode, Sails automatically provides handling of some request using [Blueprints](https://sailsjs.com/documentation/concepts/blueprints). This is a helpful set of features for developers. But be aware that Blueprints are disabled when an application goes into production mode.

### Helpers

The application's helpers are documented [here](https://dewv.github.io/nlcAttendance).

## Style guides

### git commit messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line. It is generally our practice that code-related Issues are never manually closed; they should close automatically when code is merged to the master branch from commit and/or pull request messages that refer to the Issue.

### JavaScript style checking

The [eslint](https://eslint.org/) tool is used to check and correct JavaScript code, using configuration settings in the `.eslintrc` file.

There are several ways that this tool is activated.

1. It is the tool that produces the icons and associated messages that appear in the "gutter" of the source code editor, next to the line numbers.
2. The terminal command `npm run lint` executes a script in `package.json` that runs the tool and reports any findings. This script runs the tool with its `--fix` flag, which will automatically fix some code issues. Be aware that this can cause otherwise unexpected changes when you run `git status`.
3. The terminal command `npm test` executes a script in `package.json` that runs the lint script just discussed, along with other code quality scripts discussed elsewhere.

As discussed above, c9 has a problematic expectation for the location of the `.eslintrc` config file; we work around this with a symlink.

Even so, c9 can be strange about reacting to changes in the config file. If your editor is showing icons/messages that should be disabled by recent changes to the configuration, this trick will usually resolve the situation.

```bash
# if necessary, navigate to the project folder/repository
cd ~/workspace/nlcAttendance

# rename the symlink in the parent folder to 'x' (or any unused name)
mv ../.eslintrc ../x

# rename it again to restore its proper name
mv ../x ../.eslintrc
```

The bash command `mv` moves a file, which amounts to a rename when the same folder is used. By changing the name of the symlink then changing it back, we trick c9 into picking up the changes in the editor's display of eslint results.

### mocha style guide

- Include thoughtfully-worded, well-structured mocha tests in the `test` folder.
- Files that contain test code should be named to match the files that contain the code that they test. (Extensions may differ; all test code will be in `.js` files, but both `.js` and `.html` files will be tested.)
- Use`describe` to identify the component under test.
- Use one or more nested `context` blocks to categorize tests.
- Use`it` to describe expected behavior, usually beginning with the word "should"

#### Example

File `test/views/student/editForm.js` includes the following code to test the behavior of `views/pages/student/editForm.html`. (Note that the `pages` folder was dropped from the `test` file tree because we did not expect to test other `view` folder contents; however, this could change.)

```javascript
describe("Student views", ...
    context("The update form", ...
    	it("should include a text input to edit the last name", ...
        it("should include select options to edit the fall sport", ...
```

### Documentation style guide

We use [jsdoc](https://usejsdoc.org/) to generate [our API documentation](https://dewv.github.io/nlcAttendance).

This includes documentation for the Request, Response, Record, Model, and Controller concepts from Express/Sails.

Each model file should document:

1. the model itself, as a module implementing the [Model](https://dewv.github.io/nlcAttendance/docs/Model.html) interface, and
2. a related record type, which implements the [Record](https://dewv.github.io/nlcAttendance/docs/Record.html) interface.

Each controller file should document the controller as a module implementing the [Controller](https://dewv.github.io/nlcAttendance/docs/Controller.html) interface.

Although Sails helpers are defined in module format, the framework essentially turns them into globally available functions. Accordingly, each helper file documents its helper from the caller's perspective, as if it were a global function.

