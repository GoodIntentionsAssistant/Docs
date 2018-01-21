---
layout: page
title: Redirecting
---

Redirecting from one intent to another is called by the `intent.redirect()` method.

The redirect must be returned within the intent method.


## Redirection example

~~~javascript
module.exports = class BoingIntent extends Intent {

  setup() {
    this.train(['boing']);
  }

  response(request) {
    return request.redirect('App.Example.Intent.Ping');
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Boing</span></div>
  <div class="bot"><span>Pong</span></div>
</div>

