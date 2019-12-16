---
layout: page_packages
title: Creating a Package
---


## Prepare the Package

First start with creating a skill. Once you have done this you need to prepare the package.

Name the package such as `gi-skill-<package-name>`.

The directory structure should be as follows...

~~~
/gi-skill-count-up/
  README.md
  package.json
  /Skill
    /CountUp
      /Intent
      /Entity
      /Data
      count_up_skill.js
~~~



## Publishing the Package

Create a public git repository and publish the module to npm.

Make changes to the [gi-packages.json](https://github.com/GoodIntentionsAssistant/gi-packages/blob/master/gi-packages.json) file and create a pull request.

Once the pull request has been approved the package is then available to everyone.

