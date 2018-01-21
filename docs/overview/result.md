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
module.exports = class HelloIntent extends Intent {

  setup() {
    this.train(['hello']);
  }

  response() {
    return [
      'Hey!',
      'Very nice to meet you',
      'Let me know if you need any help'
    ];
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Hello</span></div>
  <div class="bot"><span>Hey!</span></div>
  <div class="bot"><span>Very nice to meet you</span></div>
  <div class="bot"><span>Let me know if you need any help</span></div>
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







## Delaying a response

If you need to fetch data from a remote source and you could have a delay a Javascript promise can be used.

You can also handle finishing the request manually using `request.end()` which is used in the CountSixSeconds example below.

~~~javascript
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
module.exports = class CatfactsIntent extends Intent {

  setup() {
    this.train([
      'catfact',
      'cat facts',
      'cat fact'
    ]);
  }

  response(request) {
    var filename = request.app.Path.get('skills.app')+'/CatFacts/Data/catfacts.txt';

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
