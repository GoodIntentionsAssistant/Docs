---
layout: page
title: Scheduler
---

The scheduler component enables you to schedule emitting an event using the event component.

This can be useful for reminders, notifications, alarms and calendar events. They can be any time in the future.


## Creating a schedule

~~~javascript
request.app.Scheduler.add('wakeup', {
  when: moment().add(5, 'seconds'),
  request: request,
  text: 'Wake up (5 seconds)'
});
~~~

The first argument is the namespace for the emitting. In this example `scheduler.trigger.wakeup` will be the name space called. The name space will always start with `scheduler.trigger`.

Any other data passed in the second argument is passed to the listener.


Key | Required | Description
--- | --- | ---
when | Yes | When the event should emitted. It has to be in the future and a momentjs object passed
request | No | The current intent request. This is required if no session_id or client_id is passed
client_id | No | Client id the user is interfacing with. Required if request is not passed
session_id | No | Session id of the user. Required if request is not passed



## Listening to a schedule

Listening to a schedule can be added in any file loaded at run time. This includes skills, entities and intents. It's recommended to put your listeners into your intent at setup.

~~~javascript
module.exports = class WakeupIntent extends Intent {

  setup() {

    this.app.on('scheduler.trigger.wakeup', (data) => {
      //Do something
      //data.text = "Wake up (5 seconds)"
    });

  }

}
~~~


## Example

This intent will train the strict collection "wake up". It will then create two scheduler events with the same name space. Setup will be listening for that event and make a new app request back to the same user using the same client.

The app request includes arguments for `fast` so there is no typing simulation delays and `skip_queue` which sends the request immediately ignoring `max_consecutive` configuration option.

~~~javascript
const moment = require('moment');

module.exports = class WakeupIntent extends Intent {

  setup() {
    this.train(['wake up'], {
      collection: 'strict'
    });

    this.app.on('scheduler.trigger.wakeup', (data) => {
      this.app.request({
        client_id: data.schedule.client_id,
        session_id: data.schedule.session_id,
        intent: 'App.Example.Intent.WakeUp',
        action: 'wakeup',
        schedule_data: data.schedule,
        skip_queue: true,
        fast: true
      });
    });
  }

  response(request) {
    request.app.Scheduler.add('wakeup', {
      when: moment().add(5, 'seconds'),
      request: request,
      text: 'Wake up (5 seconds)'
    });

    request.app.Scheduler.add('wakeup', {
      when: moment().add(10, 'seconds'),
      request: request,
      text: 'Wake up (10 seconds)'
    });

    return 'In 5 and 10 seconds I\'ll remind you to wake up using the scheduler';
  }

  wakeup(request) {
    return request.input.schedule_data.text;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Wake up</span></div>
  <div class="bot"><span>In 5 and 10 seconds I'll remind you to wake up using the scheduler
</span></div>
  <div class="info"><span>5 seconds later</span></div>
  <div class="bot"><span>Wake up (5 seconds)</span></div>
  <div class="info"><span>5 seconds later</span></div>
  <div class="bot"><span>Wake up (10 seconds)</span></div>
</div>