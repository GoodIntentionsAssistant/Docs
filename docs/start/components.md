---
layout: page
title: Key Components
---

##### Skill
A set of entities, intents and data sets

##### Entity
Data source for training the system and parsing parameters from user input

##### Intent
Business logic for the users input

##### Client
The interface between GI and the end-point, e.g. Facebook Messenger

##### Parameter
Parsed user input with entity data

##### Understand
Matching user input to an intent using trained data

##### Train
Intents train classifier collections for Understand

##### Request
Handles the user input, finding which intent to use and calling the intent

##### Attachment
Additional meta information send to the client such as buttons and cards

##### Event
An event that happens within GI core and can be listened to