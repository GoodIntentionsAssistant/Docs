---
layout: page
title: User & Session
---

The request object has an instance for `user` and `session`. Both are similar that you can read and write data to and from them.

The authorization is handled automatically by GI in `src/Server/client.js`.

A user can have many sessions, and a session always belongs to a user. This means if you're building an assistant with hardware you could identify the user from two different rooms and identify both of those sessions to one person.

Both `user` and `session` have a common interface to get and set data.

~~~javascript

//Get data
request.user.get('name');

//Get data with dot-path notation
request.user.get('profile.age');

//Set data
request.user.set('profile.age', 34);

//Check if key exists
request.user.has('profile.age');

//Remove a key
request.user.remove('profile.age');

~~~