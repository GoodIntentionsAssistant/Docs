---
layout: page
title: Entities
---

Entities hold data to train intents and extracts user input to match intent parameters.

They can be shared across different intents, and it's also possible to use them as a model for other types of data usage.


## Basic storage


An entity can store the data inside the entity file, from a JSON or CSV file or you can load the data manually.
Loading the data manually can be fetched asynchronously from a remote source. 

If the data becomes large it's best to load the data from JSON or CSV.

This is an example of storing the data within the entity.

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






## Synonyms

The json data can also include synonyms for similar words. This is an example from the `EmotionEntity`.

~~~javascript
this.data = {
  "happy": {
    "synonyms": ["great","delighted","overjoyed","thankful"]
  },
  "good": {
    "synonyms": ["calm","peaceful","comfortable","pleased"]
  }
};
~~~







## Meta data

Additional keys to the entity data which can be used for parameters to handle the data correctly.

This example is from `UnitEntity`.

~~~javascript
this.data = {
  "cm":{
    "label": "Centimeters",
    "measure": "length",
    "synonyms": [
      "Centimeters",
      "Centimeter",
      "cm"
    ]
  }
};
~~~

If you used `parameter('unit',{});` to your intent you could fetch `label` and `measure` with the `parameters.get()` method.

~~~javascript
//Label will be 'Centimeters'
let label = request.parameters.get('unit.data.label');

//Measure will be 'length'
let measure = request.parameters.get('unit.data.measure');

//Normal key value will be 'cm'
let value = request.parameters.value('unit');
~~~


<div class="chat" markdown="0">
  <div class="user"><span>10 meters to in</span></div>
  <div class="bot"><span>10 Meters is 393.70 Inches</span></div>
</div>





## Get entity object

The parting intent fetches the `App.Common.Entity.Parting` entity data and takes a random sample / record for a response.


~~~javascript
module.exports = class PartingIntent extends Intent {

  setup() {
    this.train([
      '@App.Common.Entity.Parting'
    ], {
      classifier: 'strict'
    });
  }

  response(request) {
    let entity = request.app.EntityRegistry.get('App.Common.Entity.Parting');
    let data = entity.get_data();

    let output = _.sample(Object.keys(data));

    if(data[output].reply) {
      output = data[output].reply;
    }

    return output;
  }

}

~~~

<div class="chat" markdown="0">
  <div class="user"><span>Good bye</span></div>
  <div class="bot"><span>Au revoir</span></div>
  <div class="user"><span>Good bye</span></div>
  <div class="bot"><span>So long</span></div>
  <div class="user"><span>Ciao</span></div>
  <div class="bot"><span>Good bye</span></div>
</div>







## Callbacks

Both callbacks are synchronous, do not use Promises in these methods.

`after_load` can be useful to check if an entity has loaded in the data or to manipulate the data after its loaded.


~~~javascript
module.exports = class CityEntity extends Entity {

  before_load() {
    //Data will be empty
    console.log(this.data);
  }

  after_load() {
    //Data should be populated
    console.log(this.data);
  }

}
~~~







## Loading from JSON


Entity data can be stored in a `.json` file and loaded into the entity.

In this example the file is created, `app/Skill/Example/Data/animals.json`.

The file contents formatting should match exactly the same as if the data was defined within the exports.

~~~json
{
  "entries": {
    "dog": {},
    "cat": {}
  }
}
~~~


The entity can load this and other json compatible files using `this.import` and defining `file` and `type`.

~~~javascript
module.exports = class AnimalEntity extends Entity {

  setup() {
    this.import = {
      file: "App.Example.Data.animals",
      type: "json"
    };
  }

}
~~~

This example uses the `AnimalExample` intent.








## Loading from CSV


Entity data stored in a `.csv` format can be useful if you have a large dataset which you don't want to convert to JSON.

The first value is the key and all columns after will be used as synonyms.

~~~
"EUR","Euro"
"FJD","Fijian Dollar"
"FKP","Falkland Islands Pound"
"GBP","British Pound Sterling","Sterling"
~~~

If you was going to convert this data to a standard GI json file it would look like...


~~~json
{
  "entries": {
    "EUR": { "synonyms":["Euro"] },
    "FJD": { "synonyms":["Fijian Dollar"] },
    "FKP": { "synonyms":["Falkland Islands Pound"] },
    "GBP": { "synonyms":["British Pound Sterling","Sterling"] }
  }
}
~~~


Using `this.import` and defining `file` and `type` the CSV file can be imports to the entity.

~~~javascript
module.exports = class CurrencyEntity extends Entity {

  setup() {
    this.import = {
      file: "Data.Common.currencies",
      type: "csv"
    };
  }

}
~~~

This example uses the `CurrencyIntent` intent.





## Loading custom data

Loading data into an entity using a custom method is useful for processing unformatted JSON and CSV data, data manipulation, fetching data from a database or a remote source.

The `Drink` Entity and Intent will load data from a .txt file into the entity data.

~~~javascript
module.exports = class DrinkEntity extends Entity {

  setup() {
    this.import = {
      type: 'custom'
    };
  }


  load_data(resolve, options) {
    let fs = require('fs');
    let filename = this.app.Path.get('skills.app') + '/Example/Data/drinks.txt';
    let output = {};

    let promise = new Promise((resolve, reject) => {
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        var lines = data.split(/\r?\n/);
        for(var ii=0; ii<lines.length; ii++) {
          if(!lines[ii]) { break; }
          output[lines[ii]] = {};
        }
        resolve(output);
      });
    });

    return promise;
  }

}
~~~

The data stored in `drinks.txt` is simply a new line list of different drinks.

~~~
water
sprite
7up
coke
pepsi
coffee
tea
beer
lager
~~~





