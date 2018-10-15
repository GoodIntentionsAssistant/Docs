---
layout: page
title: Utterance
---

Utterance is the text entered by the user that can be used in your intents.


<div class="chat" markdown="0">
  <div class="user"><span>Sentiment I love you</span></div>
  <div class="bot"><span>Sentiment is positive!</span></div>
  <div class="user"><span>Sentiment I hate you</span></div>
  <div class="bot"><span>Sentiment is negative :(</span></div>
  <div class="user"><span>Sentiment Smell my cheese</span></div>
  <div class="bot"><span>Sentiment is neutral</span></div>
</div>



## Text and Scrubbed

When the user sends a message to GI the original text they entered and their text is scrubbed / cleaned using the `Scrubber` utility.

* String is converted into lower case. HELLO -> hello
* Contractions standardised. What's -> what is
* Grammar is removed. Great! -> great
* Stop words are removed. The cat -> Cat
* Octals are standardised. One, two, three -> 1, 2, 3

This is to help the system understand their intent and reduces the chances of calling the wrong intent.


~~~javascript
//Users original text entered
request.utterance.original();

//Scrubbed text
request.utterance.text();

//Scrubbed text with stopwords removed
request.utterance.scrubbed('stopwords');
~~~

<div class="chat" markdown="0">
  <div class="user"><span>The cat, is in the hat!</span></div>
  <div class="bot"><span>Original: The cat, is in the hat!</span></div>
  <div class="bot"><span>Scrubbed: the cat is in the hat</span></div>
  <div class="bot"><span>Stop words: cat hat</span></div>
</div>



## Tagging words

The utterance is checked for various sentiments and intentions including if the users input is negative, positive a question and what type of question, such as "who" and "why".

~~~javascript
//If the input is a question
request.utterance.is('question');

//If the sentiment is positive
request.utterance.is('positive');

//If the sentiment is negative
request.utterance.is('negative');
~~~




## Sentiment analysis

Sentiment analysis is to understand if the users input is positive, negative or neutral.

~~~javascript
module.exports = class SentimentIntent extends Intent {

  setup() {
    this.train([
      new RegExp(/^sentiment/,'i')
    ]);
  }

  response(request) {
    let output = [];

    if(request.utterance.is('positive')) {
      output.push('Sentiment is positive!');
    }
    else if(request.utterance.is('negative')) {
      output.push('Sentiment is negative :(');
    }
    else {
      output.push('Sentiment is neutral');
    }

    return output;
  }

}

~~~
<div class="chat" markdown="0">
  <div class="user"><span>Sentiment I feel good</span></div>
  <div class="bot"><span>Sentiment is positive!</span></div>
  <div class="user"><span>Sentiment I feel bad</span></div>
  <div class="bot"><span>Sentiment is negative :(</span></div>
  <div class="user"><span>Sentiment I feel ok</span></div>
  <div class="bot"><span>Sentiment is neutral</span></div>
</div>



## Parts of speech

The speech tagger uses `pos` speech tagger. It's still experimental and is not fully implemented yet.

