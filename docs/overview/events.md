---
layout: page
title: Events
---

Good Intentions enables extendability with its event system using EventEmitter.

These events can be listened from your skill file.


## System events

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


## Request call event example

This example will console log output if the Boing intent is called.

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



## Custom events

When you visited this page GI chat bot should have sent you a message to say it triggered a custom event.

All custom events start with `custom.`

Custom events can trigger anything you want and don't need to return anything back to the user. It can be used for tracking the user.

Setting the request type to `event` and defining the event in the `data` attribute will let you listen for the event. In this example the custom event will be 'page-visit' and the data passed will be the URL.

~~~javascript
socket.emit('request',{
  client: 'web',
  session_token: 'm626NfP8jFYPAKNw',
  user: 'bob',
  type: 'event',
  data: {
    event: 'page-visit',
    url: '/overview/events'
  }
});
~~~


In our Skill we can then listen for the event and make a request to an intent. You don't need to make a custom request but for this example we use a custom request to call an intent so the NLP engine is skipped.

~~~javascript
module.exports = class ExampleSkill extends Skill {
  constructor(app) {
    super(app);

    app.on('custom.page-visit', (data) => {
      app.request({
        client_id: data.client.client_id,
        session_id: data.session.session_id,
        intent: 'App.Example.Intent.CustomEventPageVisit',
        data: data.data
      });
    });
  }

}
~~~

The listening event will then call an intent.

Anything passed in the data attribute is set as a parameter that can be read in from the intent.


~~~javascript
module.exports = class CustomEventPageVisitIntent extends Intent {

  setup() {
  }

  response(request) {
    let url = request.parameters.value('url');
    if(url.indexOf('/overview/events') === -1) {
      return true;
    }
    return 'You are now on the event page. This is a custom event!';
  }

}
~~~



## Creating events in the app

You can create your own events within a skill or intent as long as you have access to the `app` scope.

~~~javascript
this.app.Event.emit('middleware.lights',{
  action: 'on'
});
~~~