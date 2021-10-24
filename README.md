
# Modanisa Challenge Backend

In this part my focus shifts towards the backend: that is, towards implementing functionality on the server side of the stack. My goal is to implement a backend that will work with the To-Do application.
<p>Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.
Many libraries have been developed to ease server side development with Node, by offering a more pleasing interface to work with the built-in http module.
These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this 
purpose is <b><a href="http://expressjs.com/">express</a></b>.</p>

<p>I installed <a href="https://github.com/remy/nodemon">nodemon</a> so that the application restarts.

> Nodemon will watch the files in the directory in which nodemon was
> started, and if any files change, nodemon will automatically restart
> your node application.

## Structure of Backend Application
### Project Structure


    ├── index.js
    ├── app.js
    ├── Dockerfile
    ├── Procfile
    ├── build     
        └──...
    ├── controllers    
        └──todos.js
        └──testing.js
	└──provider_state.js
    ├── pact
	└──provider_tests.js
    ├── tests    
        └──test_helper.js
        └──todo_api_test.js
    ├── models
        └──todo.js
    ├── package-lock.json
    ├── packagejson
    ├── utils
        └──config.js
        └──logger.js
        └──middleware.js
        
     
The **index.js** file only imports the actual application from the **app.js** file which  and then starts the application.

### Utils Folder
#### config.js
It reads the information required for the database connection from the .env file and assigns the required variable.
#### logger.js
The logger has two functions, **info** for printing normal log messages, and **error** for all error messages.
#### middleware.js
It reads the required data from the request object and performs logging.

### Controllers Folder
The event handlers of routes are commonly referred to as controllers, and for this reason I have created a new controllers directory. All of the routes related to todos are now in the todos.js module under the controllers  directory.

If the tests need to be able to modify the server's database, the situation immediately becomes more complicated. Ideally, the server's database should be the same each time we run the tests, so our tests can be reliably and easily repeatable.

As with unit and integration tests, with E2E tests it is the best to empty the database and possibly format it before the tests are run. The challenge with E2E tests is that they do not have access to the database.

The solution is to create API endpoints to the backend for the test. I create **testing.js** controller  and I can empty the database using these endpoints by adding this piece 

    const  router  =  require('express').Router()
    const  Todo  =  require('../models/todo')
    
    router.get('/reset',  async  (request,  response)  =>  {
       await Todo.deleteMany({})
       response.status(204).end()
    })
    module.exports  = router

and add it to the backend only _if the application is run on test-mode_:

    if  (process.env.NODE_ENV  ===  'test')  {
      const  testingRouter  =  require('./controllers/testing')
      app.use('/api/testing', testingRouter)
    }


### Models Folder
The responsibility of establishing the connection to the database has been given to the  _app.js_  module. The  _todo.js_  file under the  _models_  directory only defines the Mongoose schema for todos.
  
## Deploying App to Internet
After the whole stack is ready I used Heroku to move my app to the internet. **Procfile** in the project's root to tell Heroku how to start the application.

 - Steps for Heroku Application
	 - Create a Heroku application with the command _heroku create_
	 - commit your code to the repository
	 - move it to Heroku with command _git push heroku main_

When the application is deployed, we must create a production build or a version of the application which is optimized for production. A production build of applications for example in my case created with create-react-app can be created with command npm run build.

This creates a directory called build (which contains the only HTML file of our application, index.html ) which contains the directory static. Minified version of our application's JavaScript code will be generated to the static directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. Actually all of the code from all of the application's dependencies will also be minified into this single file.

One option for deploying the frontend is to copy the production build (the _build_ directory) to the root of the backend repository and configure the backend to show the frontend's _main page_ (the file _build/index.html_) as its main page.

After ensuring that the production version of the application works locally, commit the production build of the frontend to the backend repository, and push the code to Heroku.

https://mnchallenge.herokuapp.com/

## Saving Data to Database
In order to store our saved todos indefinitely, we need a database. In this app I used [MongoDB](https://www.mongodb.com/) which is a so-called [document database](https://en.wikipedia.org/wiki/Document-oriented_database).

You can install and run MongoDB on your own computer. However, the internet is also full of Mongo database services that I can use. My preferred MongoDB provider in this app will be [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Testing Application
There are many different testing libraries or  _test runners_  available for JavaScript. In this app I used a testing library developed and used internally by Facebook called  [jest](https://jestjs.io/).

Test execution in particular typically requires that a single database instance is not used by tests that are running concurrently. It would be better to run our tests using a database that is installed and running in the developer's local machine. That is why, the _.env_ file has _separate variables_ for the database addresses of the development and test databases:

```bash
MONGODB_URI=mongodb+srv://username:<pass>@cluster0-ostce.mongodb.net/todo-app?retryWrites=true
PORT=3001

TEST_MONGODB_URI=mongodb+srv://username:<pass>@cluster0-ostce.mongodb.net/todo-app-test?retryWrites=true
```


#### todo_api.test.js
I used supertest package to help me write tests for testing API.

todo_api.test.js imports the Express application from the _app.js_ module and wraps it with the _supertest_ function into a so-called [superagent](https://github.com/visionmedia/superagent) object. This object is assigned to the _api_ variable and tests can use it for making HTTP requests to the backend.

The grouping and organization of tests could also use some improvement, as all tests exist on the same "top level" in the test file. I mapped related tests with _describe_blocks for the sake of improving the readability of the tests.

#### _test_helper.js_
Tests check the state stored in the database after the saving operation, by fetching all the todos of the application. The same verification steps will repeat in other tests later on, and it is a good idea to extract these steps into helper functions. That is why I added this file.

The module defines the todosInDb function that can be used for checking the todos stored in the database. The initialTodos array containing the initial database state is also in the module. We also define the _nonExistingId_ function ahead of time, that can be used for creating a database object ID that does not belong to any todo object in the database.

# Implementing a Consumer-Driven Contract for a Node Express Server with Pact
The contract contains a single request / response pair, called an “interaction”. In this interaction, the consumer sends a POST request with a Hero-JSON-object in the body and the provider is expected to return a response with HTTP status 201 which again contains the todoin the body, this time with an ID that was added by the server.
**I'll take the contract file from the directly in the test application's directory** [I implemented the provider side of the contract.](https://github.com/atakanteko/consumer-driven-contract) 

## Setting Up Pact
Let’s set up Pact to implement a provider test that verifies our endpoint against the contract.

The provider test reads the interactions from a contract and for each interaction, does the following:

1.  put the provider into a state that allows to respond accordingly
2.  send the request to the provider
3.  validate that the response from the provider matches the response from the contract.

Pact does most of the work here, we just need to set it up correctly.

### Adding a Provider State Endpoint

The first step of the provider test for each interaction is to put the provider into a certain state, called “provider state” in Pact lingo.

In the contract  the provider state for our single interaction is called **“provider allows todo creation”**.

In order to put the provider into a certain state, it needs a POST endpoint that accepts the `consumer` and `state` query parameters:

**controllers/provider_state.js**
```
const router = require('express').Router()

router.route('/')
    .post(function (req, res) {
        const consumer = req.query['consumer'];
        const providerState = req.query['state'];
        // imagine we're setting the server into a certain state
        res.send(`changed to provider state "${providerState}" for consumer "${consumer}"`);
        res.status(200);
    });

module.exports = router;
```

### Creating a Provider-Side Contract Test
First we need to add provider_state.js to app.js.

```
const { Verifier } = require('@pact-foundation/pact');
const packageJson = require('../package.json');

let opts = {
    providerBaseUrl:  'http://localhost:3001',
    provider:  'todo-provider',
	pactUrls:  ["C:/Users/atakanteko/Desktop/cdc-test/pacts/todo-consumer-todo-provider.json"],
	publishVerificationResult:  true,
	providerVersion: packageJson.version,
	providerStatesSetupUrl:  'http://localhost:3001/api/cdc/provider-state'
};

new Verifier().verifyProvider(opts).then(function () {
    console.log("Pacts successfully verified!");
});
```
In the script I define some options and pass them to a `Verifier` instance that executes the three steps (provider state, send request, validate response).

-   **providerBaseUrl**: base url of the provider to which the requests are going to be sent. In our case, we’re starting the Express server locally on port 3001.
- -   **providerStatesSetupUrl**: the url to change provider states. This refers to the endpoint we have created above. In our case, we could actually leave this option out, since our provider state endpoint doesn’t really do anything.

If the script is run, it will load all contracts for the provider `todo-provider` from the specified Pact Broker and then call Pact’s `Verifier`. For each interaction defined int the loaded contracts the `Verifier` will send a request to `http://localhost:3001/api/todos` and check if the response matches the expectations expressed in the contract.

To make the script runnable via Node, we add some scripts to `package.json`:

    "pact:providerTests":  "node ./pact/provider_tests.js",
The script `pact:providerTests` runs the `provider_tests.js` script from above. However, this will only work when the Express server is already running. So, don't forget to run the server.
	
![enter image description here](https://github.com/atakanteko/mn-challenge/blob/main/img/testSs.png)
