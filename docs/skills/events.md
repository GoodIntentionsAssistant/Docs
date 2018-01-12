---
layout: page
title: Events
---

Good Intentions enabled extendability with its event system using EventEmitter.

These events can be listened from your skill file.


## Events supported

Key | Parameters | Description
--- | --- | ---
incoming | ident, input | Incoming message
unknown | ident, input | Message could not be understood
dispatch | ident, input, identifier, action | Calling of an intent on a successful classifier match


## Example

~~~javascript
module.exports = class ExampleSkill extends Skill {

  constructor(app) {
    super(app);

    app.on('intent', (data) => {
      if(data.identifier === 'App.Example.Intent.Boing') {
        console.log('Boing redirect was called!');
      }
    });
  }

}
~~~