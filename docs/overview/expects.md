---
layout: page
title: Expects
---

Expects are useful for in conversations to users to capture their next response and force it to an intent.

For now you can only set one expects. We plan to have multiple expects in a future version.


~~~javascript
module.exports = class HowOldAreYouIntent extends Intent {

  setup() {
    this.name = 'How old are you';
    this.train([
      'how old are you',
      'what is your age'
    ]);
  }

  response(request) {
    request.expect({
      action: 'reply',
      force: true
    });
    return [
      'I have no age, I am a bot!',
      'How old are you?'
    ];
  }

  reply(request) {
    return 'OK, you are '+request.input.text;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>How old are you?</span></div>
  <div class="bot"><span>I have no age, I am a bot!</span></div>
  <div class="bot"><span>How old are you?</span></div>
  <div class="user"><span>30</span></div>
  <div class="bot"><span>OK, you are 30</span></div>
</div>


The above example won't check the user input so the following problem can happen...

<div class="chat" markdown="0">
  <div class="user"><span>How old are you?</span></div>
  <div class="bot"><span>I have no age, I am a bot!</span></div>
  <div class="bot"><span>How old are you?</span></div>
  <div class="user"><span>Apples</span></div>
  <div class="bot"><span>OK, you are Apples</span></div>
</div>



Key | Required | Default | Description
--- | --- | --- | ---
key | No | expects | Parameter key if set
action | No | response | Action to use when the expected input has been matched
force | No | false | If set to true what ever user input after will be directed to the same intent
fail | No | false | If forced is true and the input is not matched the action is changed to the value of fail
save_answer | No | false | If set to true the users input will be stored to their user record and can be used for slotfilling
entity | No | false | User input will be parsed to get entity data. The result if matched will be set to a parameter key called `expects`. If entity is not set then data must be passed.
data | No | null | If instead of using entity data it's possible to manually set the data to be checked



## Expects with an entity

You could handle lots of different exceptions in your `reply` method but you could also make an entity to parse and check for the information creating a better flow.

In this example `key` has not been set so the default value of 'expects' will be used to get the users reply.


~~~javascript
module.exports = class FavoriteNumberIntent extends Intent {

  setup() {
    this.train([
      'what is your favorite number'
    ]);
  }

  response(request) {
    request.expect({
      action: 'reply',
      entity: 'App.Common.Entity.Number',
      force: true
    });
    return [
      'Not sure, what is your favorite number?'
    ];
  }

  reply(request) {
    var value = request.parameters.value('expects');
    if(value) {
      return 'I think '+value+' is a lucky number too!';
    }
    return 'That is not a number';
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>What is your favorite number?</span></div>
  <div class="bot"><span>Not sure, what is your favorite number?</span></div>
  <div class="user"><span>I love 60</span></div>
  <div class="bot"><span>I think 60 is a lucky number too!</span></div>
</div>

<div class="chat" markdown="0">
  <div class="user"><span>What is your favorite number?</span></div>
  <div class="bot"><span>Not sure, what is your favorite number?</span></div>
  <div class="user"><span>Bananas</span></div>
  <div class="bot"><span>That is not a number</span></div>
</div>




## Force with fail and manual data

~~~javascript
module.exports = class FlowerMenuIntent extends Intent {

  setup() {
    this.train([
      'flowers'
    ]);

    this.menu = {
      1: 'Order flowers',
      2: 'Check your status',
      3: 'Contact us',
      4: 'Exit'
    };

    this.stop = false;
  }

  after_request(request) {
    if(this.stop) {
      return false;
    }

    request.expect({
      force: true,
      action: 'chosen',
      fail: 'incorrect',
      data: {
        "1": {},
        "2": {},
        "3": {},
        "4": {
          "synonyms": ["exit"]
        }
      }
    });
  }

  response(request) {
    let output = [];
    for(var key in this.menu) {
      output.push(key+'. '+this.menu[key]);
    }
    return output;
  }

  chosen(request) {
    let val = request.parameters.value('expects');

    if(val == '4') {
      this.stop = true;
      return 'Thanks for shopping with us!';
    }

    return 'You chose "'+this.menu[val]+'"';
  }

  incorrect(request) {
    return 'Sorry, there is no menu option ' + request.input.text;
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Flowers</span></div>
  <div class="bot"><span>
      1. Order flowers<br>
      2. Check your status<br>
      3. Contact us<br>
      4. Exit
  </span></div>
  <div class="user"><span>6</span></div>
  <div class="bot"><span>Sorry, there is no menu option 6</span></div>
  <div class="user"><span>2</span></div>
  <div class="bot"><span>You chose "Check your status"</span></div>
  <div class="user"><span>4</span></div>
  <div class="bot"><span>Thanks for shopping with us!</span></div>
</div>




## Save answer

Saving the users expected answer will store the information in the user session. This can then be used in any other intent the user calls.

This can be useful to build up contextual information about the user. In the example we are handling loading in the previously entered answer direct from the user record. It can also be used for parameter slot filling.

~~~javascript
module.exports = class FootballQuestionIntent extends Intent {

  setup() {
    this.train([
      'do you like football?'
    ]);
  }

  response(request) {
    if(request.user.has('football')) {
      if(request.user.get('user.football') == 'yes') {
        return 'Yes I do and I know you love it too!';
      }
      else {
        return 'Yes I do and I know you don\'t enjoy it already';
      }
    }

    request.expect({
      key: 'football',
      action: 'reply',
      entity: 'App.Common.Entity.Confirm',
      save_answer: true
    });
    return [
      'Yes, I love football, do you?'
    ];
  }
  
  reply(request) {
    var value = request.parameters.value('football');
    if(value == 'yes') {
      return 'We will go to a game together soon!';
    }
    return 'Shame, not everyone enjoys it';
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Do you like football?</span></div>
  <div class="bot"><span>Yes, I love football, do you?</span></div>
  <div class="user"><span>Yup</span></div>
  <div class="bot"><span>We will go to a game together soon!</span></div>
  <div class="user"><span>Do you like football?</span></div>
  <div class="bot"><span>Yes I do and I know you don't enjoy it already</span></div>
</div>



## Cancelling expects

If the user is trapped in a conversation using expects they can use `cancel` keywords.


<div class="chat" markdown="0">
  <div class="user"><span>Take survey</span></div>
  <div class="bot"><span>Do you watch sports TV?</span></div>
  <div class="user"><span>Yes</span></div>
  <div class="bot"><span>Which sports do you watch the most?</span></div>
  <div class="user"><span>Stop</span></div>
  <div class="bot"><span>No problems!</span></div>
</div>

