---
layout: page
title: Intents
---

An intent is a user's intention. If the user types in "what is the weather for bangkok", the intent will fetch the weather for Bangkok and return it back to the user.

Each intent is within a Skill and a skill can have many intents. For example you may want to have a collection of small games and you could put them in a skill called `Games` and share that skill with its intents and entities online.


## Building a Simple Intent

Firstly edit your `app/Config/config.json` file and in the `skills` array add in "App.HelloWorld".

~~~json
{
  "skills": [
    "App.HelloWorld",
    "App.Error"
  ]
}
~~~

Go to your `/app/Skill/` directory and create a directory called "HelloWorld".

Create a skill file `/app/Skill/HelloWorld/hello_world_skill.js`

~~~javascript
const Skill = girequire('src/Skill/skill');

module.exports = class HelloWorldSkill extends Skill {
}
~~~


Then create a directory, `/app/Skill/HelloWorld/Intent/`

In this directory create a new file called `hello_world_intent.js` and enter the following...

~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class HelloWorldIntent extends Intent {

  setup() {
    this.train('hello world');
  }

  response(request) {
    return 'Hello!';
  }

}
~~~


With these basics you can now learn more about training, entities, attachments and more.

