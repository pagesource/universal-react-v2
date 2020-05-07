# Page Source Code Quality Package for (Eslint & Stylint)

### Package to unify ESLint & Prettier versions and rules across projects. No need to install those packages anymore in your projects and maintain them all separately.

#### This package will provide you with eslint and Prettier and with the rules.

```Install
npm install pagesource-code-quality
```

#### Configure

#### Create the file .eslintrc.js in your root folder and extend rules javascript module.exports = require('pagesource-code-quality/eslint.config');

#### Create the file .prettierrc.js in your root folder and extend rules javascript module.exports = require('pagesource-code-quality/prettier.config');

#### Note: You can extend or modify this rules in your project as is described on the documentation of eslint, the same way as you will do when extending eslint recommended rules.

### Usage

#### Like you will do normally with eslint, this package is nothing else just a wrapper. - For just linting and to see the report, run:

```
eslint path/to/folder

```

For linting and autofix the problems, run:

```
eslint --fix path/to/folder

```

Recommended
Add in your package.json at the scripts section the two following scripts:

```

{
    "scripts": {
    "lint:js": "eslint path/to/folder",
    "lint:fix": "eslint  --fix path/to/folder"
    "lint:css": "stylelint path/to/folder",
    }
}

```
