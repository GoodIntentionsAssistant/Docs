---
layout: page
title: Load & Unload Intents
---

It's possible to load and unload intents on-the-fly.

~~~javascript
//Unload Ping intent
this.app.IntentRegistry.unload('App.Example.Intent.Ping');

//Load Ping intent
this.app.IntentRegistry.load('App.Example.Intent.Ping');
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Ping</span></div>
  <div class="bot"><span>Pong</span></div>
  <div class="user"><span>Unload Ping</span></div>
  <div class="bot"><span>Ping has now been unloaded</span></div>
  <div class="user"><span>Ping</span></div>
  <div class="bot"><span>Sorry, I don't understand what you mean</span></div>
  <div class="user"><span>Load Ping</span></div>
  <div class="bot"><span>Ping loaded</span></div>
  <div class="user"><span>Ping</span></div>
  <div class="bot"><span>Pong</span></div>
</div>


Unloading an intent will untrain all classifers and remove the intent from the `ObjectRegistry` so it cannot be called again.

Entities and their data will be untouched.

A call back called `shutdown` will be called before untraining and removing the intent from the registry.

~~~javascript
module.exports = class PingIntent extends Intent {

  setup() {
    this.train(['ping','pong']);
  }

  response() {
    return 'Pong';
  }

  shutdown() {
    console.log('Ping shutting down');
  }

}
~~~