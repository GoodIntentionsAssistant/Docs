---
layout: page
title: Skills
---


GI allows you to create a combination of intents and entities using skills. Each skill should be focused on a small set of similar intents.

Skills don't necessarily need to be intents or entities, they could also use the app event system to manipulate, log, add additional components or take over control of Good Intentions. 

Skills should be designed to do a single job and do that job well.

For an ecommerce bot you could build individual skills for cart, products, onboarding, customer support, general information, small talk and fallbacks.


## Creating a skill

Create a new directory in your `app/Skill/` directory using CamelCase format.

Typical directory structure.

~~~
/app
  /ExampleMenu
    /Entity
    /Data
    /Intent
    example_menu_skill.js
~~~

For the skill to load it must be added to your `config` file.

## Skill file

The skill file must match the directory name using lower case and underscore format. In this example the skill file is `example_menu_skill.js`.

This file can be used to listen to events on GI.


~~~javascript
module.exports = class ExampleMenuSkill extends Skill {

  constructor(app) {
    super(app);
    this.intents = [];
  }

}
~~~



## Enabling the skill

In `app/Config/config.js` add the skill to the `config.skills` array then restart the GI server.

The GI Cli will load the intents and all of the entities for the skill.






## Defining skill intents to load


When the skill file is loaded all intents found in the `/Intent` directory are loaded in.

To control which intents are loaded change `this.intents` array inside the `constructor` method. If the array is empty all intents are loaded.

For example if you had two intents.

~~~
/Intent
  order1_intent.js
  order2_intent.js
~~~

To just load the Order2 intent you would set the intents array to be...

~~~javascript
this.intents = ['Order2'];
~~~



