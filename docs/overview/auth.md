---
layout: page
title: User & Session
---

The request object has an instance for `user` and `session`. Both are similar that you can read and write data to and from them.

The authorization is handled automatically by GI in `src/Server/client.js`.

A user can have many sessions, and a session always belongs to a user. This means if you're building an assistant with hardware you could identify the user from two different rooms and identify both of those sessions to one person.

Both `user` and `session` have a common interface to get and set data.

~~~javascript

//Get data
request.user.get('name');

//Get data with dot-path notation
request.user.get('profile.age');

//Set data
request.user.set('profile.age', 34);

//Check if key exists
request.user.has('profile.age');

//Remove a key
request.user.remove('profile.age');

~~~



<div class="chat" markdown="0">
  <div class="user"><span>Where am I?</span></div>
  <div class="bot"><span>I don't know, what city are you from?</span></div>

  <div class="user"><span>I'm from London</span></div>
  <div class="bot"><span>I've heard London is nice</span></div>

  <div class="user"><span>Where am I?</span></div>
  <div class="bot"><span>You told me you was in London</span></div>

  <div class="user"><span>What's the weather?</span></div>
  <div class="bot"><span>Currently 5c, Clear in London</span></div>

  <div class="user"><span>What's the time?</span></div>
  <div class="bot"><span>8:29 am, Sunday 11th (GMT+00:00) in London</span></div>
</div>


## Example

Example using `has`, `set` and `get`. The result will be stored to the user session which can be used for `WeatherIntent` and `TimezoneIntent` parameter slotfilling.

~~~javascript
module.exports = class UserFromIntent extends Intent {

  setup() {
    this.train([
      'where am I?'
    ]);
  }

  response(request) {
    if(request.user.has('city')) {
      return 'You told me you was in '+request.user.get('city');
    }

    request.expect({
      action: 'reply',
      entity: 'App.Common.Entity.City',
      force: true
    });

    return 'I don\'t know, what city are you from?';
  }

  reply(request) {
    let city = request.parameters.value('expects');

    request.user.set('city', city);

    return 'I\'ve heard '+city+' is nice'
  }

}

~~~
