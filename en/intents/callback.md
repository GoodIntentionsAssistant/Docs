---
layout: page
title: Intent callbacks
---

There are two call backs that can be used within intents.

Both callbacks are synchronous, do not use Promises in these methods.


~~~javascript
module.exports = class GuessNumberIntent extends Intent {

  before_request(request) {
  }

  after_request(request) {
  }

}
~~~

## After request trap example

This method can be useful to "trap" a user within an intent.

~~~javascript
module.exports = class GuessNumberIntent extends Intent {

  setup() {
    this.train([
      'guess number game'
    ]);

    this.parameter('guess', {
      name: "Number",
      entity: "App.Common.Entity.Number",
      required: false,
      action: 'guess'
    });
  }

  after_request(request) {
    //Dont set expecting if the number has been reset
    if(!request.session.has('guess_number')) {
      return;
    }

    request.expecting.set({
      entity: 'App.Common.Entity.Number',
      fail: 'invalid',
      force: true
    });
  }

  response(request) {
    let number = _.random(1, 100);
    request.session.set('guess_number', number);
    return 'Ok, I am thinking of a number between 1 and 100. Guess my number!';
  }

  invalid(request) {
    return 'You must type in a number between 1 and 100';
  }

  guess(request) {
    let number = request.session.get('guess_number');
    let guess = request.parameters.value('guess');

    if(guess == number) {
      request.session.remove('guess_number');
      return 'Well done, my number was '+number+'!';
    }

    if(guess < number) {
      return 'Higher!';
    }
    else if(guess > number) {
      return 'Lower!'
    }

  }

}
~~~



<div class="chat" markdown="0">
  <div class="user"><span>guess number game</span></div>
  <div class="bot"><span>Ok, I am thinking of a number between 1 and 100. Guess my number!</span></div>

  <div class="user"><span>banana</span></div>
  <div class="bot"><span>You must type in a number between 1 and 100</span></div>

  <div class="user"><span>10</span></div>
  <div class="bot"><span>Higher!</span></div>

  <div class="user"><span>32</span></div>
  <div class="bot"><span>Lower!</span></div>

  <div class="user"><span>28</span></div>
  <div class="bot"><span>Well done, my number was 34!</span></div>
</div>
