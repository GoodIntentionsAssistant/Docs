---
layout: page
title: Fallbacks
---

Fallback intents are triggered when user input is not matched by any other intents already trained with GI.

For a more genuine assistant and less annoying one, fall back intents can be used to give the user direction to using the assistant.

GI has some example fallbacks you can use, check the packages list.

Example of the system `why` intent.

~~~javascript
module.exports = class WhyIntent extends Intent {

  setup() {
    this.train(['why'], {
      collection: 'fallback'
    });
  }


  response() {
    return 'Everyone asks why';
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>how so?</span></div>
  <div class="bot"><span>How does anything happen?</span></div>

  <div class="user"><span>what are you</span></div>
  <div class="bot"><span>Not sure, Google might know</span></div>

  <div class="user"><span>when is my birthday</span></div>
  <div class="bot"><span>I am not sure when</span></div>

  <div class="user"><span>where are my keys</span></div>
  <div class="bot"><span>Could be anywhere. I have no idea</span></div>

  <div class="user"><span>who ate my cake</span></div>
  <div class="bot"><span>No idea who!</span></div>

  <div class="user"><span>why do rainbows exist?</span></div>
  <div class="bot"><span>Everyone asks why</span></div>
</div>
