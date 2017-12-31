---
layout: page
title: Errors and Error Handling
---


## Fatal Errors

Throwing a fatal error via the main App will stop the NodeJS process.

~~~javascript
App.Error.fatal('Intent data file not found');

App.Error.fatal(['Entity missing the following attributes', 'Name', 'Data']);
~~~

