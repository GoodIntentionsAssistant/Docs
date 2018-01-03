---
layout: page
title: Fetch entity object
---

You can fetch a loaded entity object using the `EntityRegistry` which is available via the app using the object identifier.

~~~javascript
let entity = request.app.EntityRegistry.get('App.Common.Entity.Parting');
~~~


## Example usage

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