# teelaunch-Store

## Required github Repo Access

* teelaunch2admin
* teelaunch-2.0
* teelaunch-api

## Environment Requirements

* node v14.17.0
* npm version ^6.14.13

## ESLINT

* WebStorm setup [here](https://www.jetbrains.com/help/webstorm/eslint.html)
* Vscode setup [here](https://daveceddia.com/vscode-use-eslintrc/) :

  * Install Eslint Extension
  * Install prettier Extension
  * Go to File > Preferences> Settings
    * On your right-hand side, there is an icon to Open Settings in JSON format. Click on that icon.
    * Add below JSON code theres

      "editor.codeActionsOnSave": { "source.fixAll.eslint": true },

      "editor.formatOnSave": true,

      "eslint.alwaysShowStatus": true,

      "files.autoSave": "onFocusChange"
  * Run npm prepare
* to check your code match Eslint requiremnet
  * run : npm run lint:fix

## Required API Keys

* Stripe (only public key)

## Installing

____

* setup [teelaunch v2.0](https://github.com/teelaunch-dev/teelaunch-2.0)
* setup [teelaunch-api](https://github.com/teelaunch-dev/teelaunch-api])
* Please ensure that you have added the env file for reference check _.env.example_

# Run

* npm install
* Run the store using Next CLI
* Run the project using the default npm

```
npm run dev
```

