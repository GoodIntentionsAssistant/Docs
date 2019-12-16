---
layout: page
title: Returning a result
---

Returning text back to the user can be done a few different ways.

Either via the `return` method or using the `request` parameter if there will be a delay with the response.


## Simple return example

~~~javascript
module.exports = class RepeatIntent extends Intent {

  setup() {
    this.train([
      new RegExp(/^repeat/,'i'),
      new RegExp(/^say/,'i')
    ], {
      collection: 'strict'
    });
  }

  response(request) {
    let result = request.input.text;

    result = result.replace(/^repeat/i,'').trim();
    result = result.replace(/^say/i,'').trim();
    result = result.replace(/^after me/i,'').trim();

    return result;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Repeat after me I am great!</span></div>
  <div class="bot"><span>I am great!</span></div>
  <div class="user"><span>Say hey</span></div>
  <div class="bot"><span>hey</span></div>
</div>


## Returning an array

The return method can also return an array which will output to the user as multiple lines of chat.

~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class BeerIntent extends Intent {

  setup() {
    this.train('beer');
  }

  response(request) {
    return [
      "99 bottles of beer on the wall",
      "98 bottles of beer on the wall",
      "97 bottles of beer on the wall",
      "..and so on!"
    ];
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Beer</span></div>
  <div class="bot"><span>99 bottles of beer on the wall</span></div>
  <div class="bot"><span>98 bottles of beer on the wall</span></div>
  <div class="bot"><span>97 bottles of beer on the wall</span></div>
  <div class="bot"><span>..and so on!</span></div>
</div>






## Returning a random response

Your intent can use the `_.sample()` method from the [Underscore.js](http://underscorejs.org/) library to return random responses.

~~~javascript
const _ = require('underscore');

module.exports = class DoingIntent extends Intent {

  setup() {
    this.train([
      'doing',
      'up to',
      'going on',
      'sup'
    ]);
  }

  response() {
    var choices = [
      "Helping as many people as I can and entertaining them with cat facts!",
      "Calculations, currency and checking the time in different countries",
      "Browsing tech sites and trying to figure out what I\'ll be doing in 10 years time"
    ];
    return _.sample(choices);
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>What are you doing?</span></div>
  <div class="bot"><span>Calculations, currency and checking the time in different countries</span></div>
</div>






## Dialog and Locale

Seperating your intent "business logic" and the response back to the user is handled by dialog. Using dialog also allows you to handle
different languages.

<div class="chat" markdown="0">
  <div class="user"><span>Talk romantic</span></div>
  <div class="bot"><span>And in her smile I see something more beautiful than the stars</span></div>
  <div class="user"><span>Talk romantic in French</span></div>
  <div class="bot"><span>Parfois, je ne me vois pas quand je suis avec vous. Je peux seulement te voir.</span></div>
  <div class="user"><span>Talk romantic in German</span></div>
  <div class="info"><span>German not found, default en</span></div>
  <div class="bot"><span>Sometimes I can’t see myself when I’m with you. I can only just see you.</span></div>
</div>

To use dialog in your intent create a `Dialog` directory and dialog json files in your skill directory.

~~~
Skill/
  Examples/
    Dialog/
      en/
        romantic_dialog.json
      fr/
        romantic_dialog.json
~~~

Each dialog json file should contain an array with at least one record.

If more than one record is found a random response will be returned back to the user.


~~~json
{% raw %}[
  "And in her smile I see something more beautiful than the stars",
  "Sometimes I can’t see myself when I’m with you. I can only just see you."
]{% endraw %}
~~~

The dialog file can also contain more than one key which can be accessed using dot-notation, `request.dialog('favorite_city.question');`. An example of this can be found under the templating documntation.

~~~json
{% raw %}{
  "question": [
    "What is your favorite city?"
  ],
  "answer": [
    "My favorite city is {{favorite_city}} too!",
    "I heard {{favorite_city}} is beautiful",
    "I want to visit {{favorite_city}} soon",
    "{{favorite_city}} is a great place to visit!"
  ]
}{% endraw %}
~~~

From your intent return using the dialog method the first parameter must match with the name of the json file.

~~~javascript
return request.dialog('romantic_dialog', {
  lang: 'en'
});
~~~


The romantic dialog example tries to fetch the language choice from a parameter.


~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class LanguageDialogIntent extends Intent {

  setup() {
    this.train(['romantic']);
    
    this.parameter('language', {
      data: {
        "en": {
          "synonyms": ["english"]
        },
        "fr": {
          "synonyms": ["french"]
        },
        "de": {
          "synonyms": ["german"]
        }
      },
      "default": "en"
    });
  }

  response(request) {
    let language = request.parameters.value('language');

    return request.dialog('romantic_dialog', {
      lang: language
    });
  }

}
~~~








## Templating

Templating with GI uses Handlebars.

Parameters are automatically set for templating variables.

To set custom templating variables use `request.set()`. This method can take key and value attributes or a key/value hash.




~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class HannahTemplateIntent extends Intent {

  setup() {
    this.train([
      'hannah'
    ]);
    
    this.parameter('emotion', {
      entity: 'App.Basics.Entity.Emotion',
      default: 'happy'
    });
  }

  response(request) {
    let d1 = new Date(2018, 5, 9);
    let d2 = new Date();
    let weeks = Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));

    request.set('weeks', weeks);
    request.set({
      city: 'Bangkok',
      country: 'Thailand'
    });
    {% raw %}return 'Hello {{emotion}} baby! You are {{weeks}} weeks old and you was born in {{city}} in {{country}}!';{% endraw %}
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Hannah Cheerful</span></div>
  <div class="bot"><span>Hello cheerful baby! You are 30 weeks old and you was born in Bangkok in Thailand!</span></div>
</div>



You can also mix use templating and dialogs together.

This example shows a dialog using a dot-notation to fetch a key from the dialog file.

~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class FavoriteCityIntent extends Intent {

  setup() {
    this.train('favorite');
    this.must('city');

    this.parameter('favorite_city', {
      entity: "App.Basics.Entity.City",
      slotfill: true,
      action: 'answered'
    });
  }

  response(request) {
    return request.dialog('favorite_city.question');
  }

  answered(request) {
    return request.dialog('favorite_city.answer');
  }

}
~~~

The dialog file contains handlebar templating variables and an array so a random response will be returned.

~~~json
{% raw %}{
  "question": [
    "What is your favorite city?"
  ],
  "answer": [
    "My favorite city is {{favorite_city}} too!",
    "I heard {{favorite_city}} is beautiful",
    "I want to visit {{favorite_city}} soon",
    "{{favorite_city}} is a great place to visit!"
  ]
}{% endraw %}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>favorite city</span></div>
  <div class="bot"><span>What is your favorite city?</span></div>
  <div class="user"><span>My favorite city is Bangkok</span></div>
  <div class="bot"><span>I heard Asia/Bangkok is beautiful</span></div>
  <div class="user"><span>My favorite city is Bangkok</span></div>
  <div class="bot"><span>Asia/Bangkok is a great place to visit!</span></div>
</div>













## Delaying a response

If you need to fetch data from a remote source and you could have a delay a Javascript promise can be used.

You can also handle finishing the request manually using `request.end()` which is used in the CountSixSeconds example below.

~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class FiveSecondsIntent extends Intent {

  setup() {
    this.train(['five seconds']);
  }

  response() {
    return new Promise(function(resolve, reject){
      setTimeout(() => {
        resolve('5 seconds are up');
      }, 5 * 1000);
    });
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Five seconds</span></div>
  <div class="info"><span>Five seconds later</span></div>
  <div class="bot"><span>5 seconds are up</span></div>
</div>

If you want to asynchronous read a file from the skill `Data` directory manually.

~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class CatfactsIntent extends Intent {

  setup() {
    this.train([
      'catfact',
      'cat facts',
      'cat fact'
    ]);
  }

  response(request) {
    let filename = Config.path('skills.app')+'/CatFacts/Data/catfacts.txt';

    return new Promise(function(resolve, reject) {
      var fs = require('fs');
      fs.readFile(filename, 'utf8', function(err, data) {
        var lines = data.split(/\r?\n/);
        resolve(_.sample(lines));
      });
    });
  }

}
~~~
<div class="chat" markdown="0">
  <div class="user"><span>Give me a fact about cats</span></div>
  <div class="bot"><span>Most cats adore sardines</span></div>
</div>








## Multiple delayed responses

To send multiple responses from one intent the request must return `false` and the request must be ended manually using `request.end()`.

In this example the intent will count to six while keeping the individual session alive until it counts to 6 and then the request is manually ended.

If the request is not ended the queue timeout will be called.


~~~javascript
const Intent = girequire('src/Intent/intent');

module.exports = class CountSixSecondsIntent extends Intent {

  setup() {
    this.train(['count to six']);
  }

  response(request) {
    setTimeout(() => { request.send('1'); }, 1 * 1000);
    setTimeout(() => { request.send('2'); }, 2 * 1000);
    setTimeout(() => { request.send('3'); }, 3 * 1000);
    setTimeout(() => { request.send('4'); }, 4 * 1000);
    setTimeout(() => { request.send('5'); }, 5 * 1000);
    setTimeout(() => {
      request.send('6');
      request.end();
    }, 6 * 1000);

    return false;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Count to six</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>1</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>2</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>3</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>4</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>5</span></div>
  <div class="info"><span>1 second later</span></div>
  <div class="bot"><span>6</span></div>
  <div class="info"><span>Session ended</span></div>
</div>




## Manual request

A manual request within GI can be added within skills, intents and anywhere with access to the main `app`. It requires at least two parameters, `client_id` and `session_id`.

Manual requests are useful for timed responses such as reminders and using with the event system to send users welcome messages when they use the assistant for the first time.


Key | Required | Default | Description
--- | --- | --- | ---
client_id | Yes | - | Client id the user is connecting through
session_id | Yes | - | Session id for the user
type | No | message | Type of request
skip_queue | No | false | If the queue should be respected, useful for reminders
fast | No | false | Simulate typing delays in response, set to false for reminders
intent | No | null | Intent to call. If set `type` is set to intent
action | No | null | Intent action to call
text | No | null | Required if no intent has been specified. Users text, e.g. "what time is it in London?"


### Request example

It's possible to create a new request for the user to call multiple intents. Defining the `intent` will force the user to the defined intent. Using the `fast` key will stop any simulated typing delays.

~~~javascript
module.exports = class MultipleIntent extends Intent {

  setup() {
    this.train(['multiple'], {
      collection: 'strict'
    });
  }

  response(response) {
    response.send('Let\'s ping!');

    response.app.request({
      client_id: response.client.client_id,
      session_id: response.session.session_id,
      intent: 'App.Example.Intent.Ping',
      fast: true
    });

    return true;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Multiple</span></div>
  <div class="bot"><span>Let's ping!</span></div>
  <div class="bot"><span>Pong</span></div>
</div>
