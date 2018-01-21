---
layout: page
title: Events
---

Good Intentions enabled extendability with its event system using EventEmitter.

These events can be listened from your skill file.


## Events supported

Key | Parameters | Description
--- | --- | ---
app.loop | app | App loop
request.incoming | ident, input | Incoming message
request.unknown | ident, input | Message could not be understood
request.call | ident, input, identifier, action | Calling of an intent on a successful classifier match
client.identified | client | Middleware client has identified itself
client.handshake | client, token, session_id | User via a middleware client has identified themselves
auth.new | client, session | New user identified, can be used for onboarding messages


## Onboarding a user

In this example the skill listens for the event `auth.new`. This event is called when a new user who has never interacted with the bot before connects to it.

A request is made with the intent specified. This is then added to the queue and the `WelcomeIntent` will greet the user.


~~~javascript
module.exports = class WelcomeSkill extends Skill {

  constructor(app) {
    super(app);

    app.on('auth.new', (data) => {
      app.request({
        client_id: data.client.ident,
        session: data.session,
        intent: 'App.Welcome.Intent.Welcome'
      });
    });
  }

}
~~~


## Dispatch example

~~~javascript
module.exports = class ExampleSkill extends Skill {

  constructor(app) {
    super(app);

    app.on('request.call', (data) => {
      if(data.identifier === 'App.Example.Intent.Boing') {
        console.log('Boing redirect was called!');
      }
    });
  }

}
~~~