---
layout: page_packages
title: Package Manager
---

GI contains a basic package manager.

The package manager will use `npm` to download packages then enable the package automatically in your `config.json` file.

Using the install command will also enable the package after it's installed.


## Install / Uninstall

Using the package manager the central [gi-packages.json](https://github.com/GoodIntentionsAssistant/gi-packages/blob/master/gi-packages.json) file is first fetched and stored locally. The name of the package you want to install must match a key in the `gi-packages.json` file.

Once the package is downloaded with `npm` a symbolic link is created from the `node_modules` directory to your `app` directory for each skill.

~~~
node gi install gi-skill-basics
node gi uninstall gi-skill-basics
node gi reinstall gi-skill-basics
~~~


## Manual install

The package manager can be ignored if your package is not listed in the central [gi-packages.json](https://github.com/GoodIntentionsAssistant/gi-packages/blob/master/gi-packages.json) file.

~~~
npm install gi-skill-basics
node gi enable gi-skill-basics
~~~


## Manual uninstall

You should disable the package by the package manager first and then remove it from npm.

If you still have a linked directory in your `app/Skills` directory you can manually remove it.

~~~
node gi disable gi-skill-basics
npm remove gi-skill-basics
~~~


## Problems

If you are having issues with downloading packages try the following.

~~~shell
# Clean the NPM cache
npm cache clean --force

# Update to the latest gi-packages.json file
node gi fetch
~~~