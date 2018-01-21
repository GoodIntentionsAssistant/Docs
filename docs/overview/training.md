---
layout: page
title: Intent Training
---

For intents to be called from user input they must train the app with keywords and phrases.

Using `this.train()` function you can train the bot to understand the intent.

~~~javascript
module.exports = class PingIntent extends Intent {

  setup() {
    this.train(['ping','pong']);
  }

  response() {
    return 'Pong';
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Ping</span></div>
  <div class="bot"><span>Pong</span></div>
</div>


## Loading from an entity

Using entities rather than manually entering the training data into the intent seperates logic and means entities can be shared across different intents.

An entity can store and load data a number of different ways. In the example we are just storing the data directly within the entity. To learn more about different ways to use entities see the Entity documentation section.

Using the `this.train()` method any value starting with the @ symbol will be recognised as an entity to be loaded.

~~~javascript
module.exports = class ColourIntent extends Intent {

  setup() {
    this.train([
      '@App.Example.Entity.Colour'
    ]);
  }

  response() {
    return 'You mentioned a colour';
  }

}
~~~

The entity file is stored in `app/Skills/Example/Entity/colour_entity.js`.

~~~javascript
module.exports = class ColourEntity extends Entity {

  setup() {
    this.data = {
      'red': {},
      'blue': {},
      'green': {},
      'white': {},
      'black': {}
    };
  }

}
~~~

See the Entity documentation for more information on ways to store data.

<div class="chat" markdown="0">
  <div class="user"><span>Red</span></div>
  <div class="bot"><span>You mentioned a colour</span></div>
  <div class="user"><span>I like green</span></div>
  <div class="bot"><span>You mentioned a colour</span></div>
  <div class="user"><span>Purple</span></div>
  <div class="bot"><span>I don't understand</span></div>
</div>



## Classifier collections

When training GI the `default` collection will use the NLP classifier to match the user input to an intent.

Triggers and symnomns train the default collection. To change the collection change it as an option when using the `train()` method.


~~~javascript
//Default NLP collection
this.train(['kiss me'], { collection: 'default' });

//Use the strict collection
this.train(['kiss me'], { collection: 'strict' });

//If nothing is found in default or strict then try the fall back
this.train(['kiss me'], { collection: 'fallback' });
~~~



## Strict collection

When the user input is received by the app the strict collection will be checked for matches before the NLP collection. This is useful when you're expecting exact input or input which can be matched with regular expressions.

If the strict collection makes a match the default NLP collection is not checked.

Adding a strict match for `kiss me` means the user will always go to that intent and the NLP default collection is not checked.

Case is ignored.

~~~javascript

module.exports = class KissMeIntent extends Intent {

  setup() {
    this.train(['kiss me'], {
      collection: 'strict'
    });
  }

  response() {
    return 'Muwah';
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Kiss me</span></div>
  <div class="bot"><span>Muwah</span></div>
  <div class="user"><span>Why not kiss me</span></div>
  <div class="bot"><span>I don't understand</span></div>
  <div class="user"><span>Kiss bob</span></div>
  <div class="bot"><span>I don't understand</span></div>
</div>


## Regular expression training

Regular expressions can be added to the training for matching. These will be added to the strict collection for checking before the NLP collection checking.

It's not really recommended to use regular expressions because an extact match is required but it can be useful for a calculator intent.

~~~javascript
this.train([
  new RegExp(/^.*[\d+] x [\d+].*$/,'g'),
  new RegExp(/^(calc )?[\d\+\/\*.\-% \(\)=]*$/,'g'),
  new RegExp(/^[\d+]*%( of)? [\d\+\/\*.\- \(\)=]*$/,'g')
]);
~~~


<div class="chat" markdown="0">
  <div class="user"><span>1+2</span></div>
  <div class="bot"><span>3</span></div>

  <div class="user"><span>20% of 90</span></div>
  <div class="bot"><span>18</span></div>

  <div class="user"><span>60 + 5%</span></div>
  <div class="bot"><span>63</span></div>

  <div class="user"><span>25% of 180</span></div>
  <div class="bot"><span>45</span></div>

  <div class="user"><span>24 + 54 + 68 - 34 * 9 / 8</span></div>
  <div class="bot"><span>107.75</span></div>
</div>


The classifier collection will be automatically set to `strict` when using the `RegExp` method in the `train()` method so it's possible to mix NLP and strict collections.

~~~javascript
this.train([
  'roll',
  'rolling',
  'dice',
  new RegExp(/^(\d+)?d((\d+)([+-]\d+)?)?$/,'g')
]);
~~~


<div class="chat" markdown="0">
  <div class="user"><span>roll a dice</span></div>
  <div class="bot"><span>Rolled 2</span></div>

  <div class="user"><span>6d2</span></div>
  <div class="bot"><span>Rolled 8</span></div>
</div>


## Fallback classifier

It's always nice to have fallback intents if the classifiers with trained data did not get a match.

GI has common fallback intents in `Common/Intent/Fallbacks` for How, What, When, Where, Who and Why.

See the fallbacks documentation for more information.