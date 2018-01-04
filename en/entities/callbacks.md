---
layout: page
title: Entity callbacks
---

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

