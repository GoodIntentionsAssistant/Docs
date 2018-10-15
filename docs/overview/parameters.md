---
layout: page
title: Intent Parameters
---

Some intents require parameters to work.

The key of the parameter is used when fetching parameters in your intent.
If your key was 'date' in your intent you can call, `request.parameters.value('date');` for the value.

If a parameter is required and is not specified by the users input request.js will change the
intent to be `App.Errors.ParametersFailed` and an error message is displayed. This saves putting additional code into your intent to handle validation and exceptions.


~~~javascript
module.exports = class OrderIntent extends Intent {

  setup() {
    this.train([
      'order',
      'order food'
    ]);

    this.parameter('choice', {
      name: "Choice",
      data: [
        "pizza",
        "burger",
        "fries"
      ]
    });
  }

  response(request) {
    let choice = request.parameters.value('choice');

    if(choice) {
      return 'You chose '+choice;
    }
    else {
      return 'Pizza, burger or fries?';
    }
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Order food</span></div>
  <div class="bot"><span>Pizza, burger or fries?</span></div>
  <div class="user"><span>Order burger</span></div>
  <div class="bot"><span>You chose burger</span></div>
</div>


Key | Required | Description
--- | --- | ---
name | Yes | Nice friendly name for the parameter. This name is used if the parameter is required and not provided
entity | No | Parameters need to be extracted and they need something to match aganist. If you are matching a number set the entity to be number and Entity/Number will be used. If you want to detect a date then you can use the Entity/Date module. Sometimes you don't want to create a full entity to handle a small amount of data so you can use the 'data' attribute below. See the Entity section for more information.
data | No | You cannot use 'entity' and 'data' fields together. Data is a hash or an array of data that is used for extracting parameters when you don't want to create an entity. All parameter extracting use entities, so when Parameter is trying to extract data from the user input and 'data' is set it will create Entity/Dummy and copy the data to the module. The data format is exactly the same as the data settings in entities.
required | No | Default is false. If the intent has been found the paramters are checked one by one before calling the action. But if a parameter is required and it's not found the intent will be set to Errors/ParametersFailed e.g. Currency conversion requires a number, currency from and currency to. If all three of these are not found in the users input then the intent cannot be called.
default | No | If no value was found in the users input the `value` of the data will be set to `default`. This is useful when you want user confirmation and you want the default to be no.
action | No | If the parameter is found the action will be changed from 'response' to this value
keep | No | Automatically store the key of the parameter to user session
slotfill | No | Attempt to load the data from previously saved parameter information. If enabled `keep` will be set to true.


## Parameters from an Entity

Parameter options can be loaded from an entity using the `entity` key.

Please read the guide on creating entities before using entities inside intents.

~~~javascript
module.exports = class RandomNumberIntent extends Intent {

  setup() {
    this.train([
      'random number'
    ]);

    this.parameter('number', {
      name: "Number",
      entity: "App.Common.Entity.Number",
      required: false
    });

    this.parameter('number_to', {
      name: "Number To",
      entity: "App.Common.Entity.Number",
      required: false
    });
  }


  response(request) {
    let number = request.parameters.value('number');
    let number_to = request.parameters.value('number_to');
    let result;
    
    if(number && number_to) {
      result = _.random(parseInt(number), parseInt(number_to));
    }
    else if(number) {
      result = _.random(0, parseInt(number));
    }
    else {
      result = _.random(1, 100);
    }

    return 'The random number is '+result;
  }

}
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Random number</span></div>
  <div class="bot"><span>The random number is 75</span></div>
  <div class="user"><span>Random number up to 20</span></div>
  <div class="bot"><span>The random number is 11</span></div>
  <div class="user"><span>Random number between five and 10</span></div>
  <div class="bot"><span>The random number is 6</span></div>
</div>



## Redirection action

If a parameter has been filled the `action` key will set the method that the intent will call instead of the default response method.

~~~javascript
module.exports = class TeaIntent extends Intent {

  setup() {
    this.train([
      'tea'
    ]);

    this.parameter('choice', {
      name: 'Choice',
      data: ['yes','no'],
      action: 'answered'
    });
  }

  response(request) {
    request.expect({
      force: true
    });
    return 'Do you want sugar in your tea?';
  }

  answered(request) {
    let choice = request.parameters.value('choice');
    return choice == 'yes' ? 'Sweet tooth' : 'Healthy option';
  }

}

~~~

<div class="chat" markdown="0">
  <div class="user"><span>Can I have tea?</span></div>
  <div class="bot"><span>Do you want sugar in your tea?</span></div>
  <div class="user"><span>Yes</span></div>
  <div class="bot"><span>Sweet tooth</span></div>
  <div class="user"><span>Can I have tea?</span></div>
  <div class="bot"><span>Do you want sugar in your tea?</span></div>
  <div class="user"><span>No</span></div>
  <div class="bot"><span>Healthy option</span></div>
</div>




## Parameters with synonyms

Synonyms can also be used when you are defining the data without using an entity. This is the same format as putting synonyms in entities.

Using the code below will set the parameter value to the parent key, either 'yes' or 'no'.

~~~javascript
this.parameter('choice', {
  data: {
    'yes': {
      synonyms: ['yup','yeah']
    },
    'no': {
      synonyms: ['nope','nah']
    }
  }
});

...

//Value of choice will be either 'yes' or 'no'
let choice = request.parameters.value('choice');
~~~

<div class="chat" markdown="0">
  <div class="user"><span>I want a scone</span></div>
  <div class="bot"><span>Do you want jam on your scone?</span></div>
  <div class="user"><span>Yup</span></div>
  <div class="bot"><span>A scone with jam coming up!</span></div>
</div>




## Default parameter value

If a parameter wasn't found in the text instead of setting the value of the parameter to `null` it will be set to the `default` value in the parameter option.

~~~javascript
module.exports = class FlipCoinIntent extends Intent {

  setup() {
    this.train([
      'flip coin',
      'toss coin',
      'coin toss',
      'flip penny',
      'flip pennies',
      'throw coin'
    ]);

    this.parameter('flips', {
      name: "Flips",
      entity: 'App.Common.Entity.Number',
      required: false,
      default: 1
    });
  }

  response(request) {
    let results = [];
    let flips = request.parameters.value('flips');

    if(flips > 5) {
      flips = 5;
    }

    for(let ii=0; ii < flips; ii++) {
      let flip = _.random(1, 2);
      if(flip == 1) {
        results.push('Heads');
      }
      else if(flip == 2) {
        results.push('Tails');
      }
    }

    let output = results.join(', ');

    return output;
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Flip a coin</span></div>
  <div class="bot"><span>Heads</span></div>
  <div class="user"><span>Flip 5 pennies</span></div>
  <div class="bot"><span>Heads, Tails, Heads, Tails, Tails</span></div>
</div>






## Fetching Entity Data

The `.value()` will return the final value of the parameter but there can be additional meta data.

With `.get()` it's possible to get all the meta data including the matched entity data.

~~~javascript
//Get all parameters set
let result = request.parameters.get();

//Get all parameter information about flips
let result = request.parameters.get('flips');
~~~






## Slot Filling

Slot filling is useful for populating parameters if the user has provided information previously and the next intent needs to use that information in an intent.

A user may ask "What is the weather in Bangkok?". "Bangkok" will be stored in their user session with the parameter key `city`. This can be read manually in with `request.user.get('city');` or automatically populated the next time the weather is asked. The user can just ask "What is the weather" and "Bangkok" will be automatically used.

~~~javascript
this.parameter('city', {
  name: "City",
  entity: "App.Common.Entity.City",
  slotfill: true
});
~~~

In the above example `slotfill` is enabled and the parameter key is `city`, so `request.user.get('city')` will be checked.

It's also possible to check multiple session data. In the example below three keys will be checked in order "location", "city", and "country".

~~~javascript
this.parameter('location',{
  name: 'Location',
  entity: ['App.Common.Entity.Country','App.Common.Entity.City'],
  slotfill: ['city','country']
});
~~~


<div class="chat" markdown="0">
  <div class="user"><span>What is the weather?</span></div>
  <div class="bot"><span>For the weather please specify the city</span></div>
  <div class="user"><span>What is the weather in Bangkok?</span></div>
  <div class="bot"><span>Currently 32c, Mostly Cloudy in Bangkok</span></div>
  <div class="user"><span>What is the weather?</span></div>
  <div class="bot"><span>Currently 32c, Mostly Cloudy in Bangkok</span></div>
  <div class="user"><span>What is the time?</span></div>
  <div class="bot"><span>3:43 pm, Sunday 11th (+07+07:00) in Bangkok</span></div>
</div>



## Light Example

The light example in GI (in Example skill directory) could easily interact with your IoT light devices.

The light intent uses multiple parameters...

* State - If the user wants to turn the light on or off
* Colour - Red, green, blue or white
* Brightness - Dim, brighten, up or down
* Brightness Percentage - Percentage number for setting the brightness

The intent can also return the state of the light by checking if the utterance is a question.

~~~javascript
request.utterance.is_question()
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Turn the light on at 70% and make it green</span></div>
  <div class="bot"><span>Turned lights on, Changed colour to green, Brightness set to 70%</span></div>

  <div class="user"><span>Change the light to red</span></div>
  <div class="bot"><span>Changed colour to red</span></div>
  
  <div class="user"><span>Dim the light and make it white</span></div>
  <div class="bot"><span>Changed colour to white, Brightness set to 20%</span></div>
  
  <div class="user"><span>Is the light on?</span></div>
  <div class="bot"><span>Yes, the light is on</span></div>
  
  <div class="user"><span>Is the light red?</span></div>
  <div class="bot"><span>No, the light colour is white</span></div>
  
  <div class="user"><span>Turn off the lights</span></div>
  <div class="bot"><span>Turned lights off</span></div>
</div>