# Mock server to mock all api calls

- we are using json-server package for mocking rest apis and json-graphql-server for mocking graphql calls.

### Installation

In Project folder

- yarn install

This will install the module on your Project.

### Running

To start and mock rest APIs, run the command

- yarn mock:rest
- edit src/db.json for the mocking API and create new route
- It will run on default 5002 port

To start and mock Graphql APIs, run the command

- yarn mock:graphql
- edit src/db.js for the mocking API and create new route
- It will run on default 5004 port

### Reference & Documentation

For detailed usage with different scenarios please refer to below links:

- https://github.com/typicode/json-server
- https://github.com/marmelab/json-graphql-server
