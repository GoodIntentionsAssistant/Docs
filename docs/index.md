---
layout: page
title: Documentation
---


This documentation has live examples and it's preferable to browse this site on a desktop browser.


<div class="chat" markdown="0">
  <div class="user"><span>50 GBP to USD</span></div>
  <div class="bot"><span>50 GBP is 68.65 USD</span></div>
  <div class="user"><span>Weather in Bangkok</span></div>
  <div class="bot"><span>Currently 26c, Mostly Cloudy in Asia, Bangkok</span></div>
  <div class="user"><span>Go to training</span></div>
  <div class="bot"><span>Taking you to Intent training</span></div>
</div>



## Installation

GI uses NodeJS 8.x and the code has only been tested on Linux Mint. Install node.js from https://nodejs.org. It is also recommended to use nvm (node version manager) to manage your node.js versions.

It is recommended that GI is downloaded as a package directly from Github and not via NPM for now. Once GI is stable it will be available to download as a standard node package with setup scripts and a different installation guide.


### Configuration

Copy the file `app/Config/config.example.js` to `app/Config/config.js`.

The file contains many options for configuring your instance of GI including server ports, queue speeds, access tokens and which skills the app should load.



### How to Run

Run the server which will listen to a port specified in your config file. This will then be ready for client connections. You cannot interact with the server directly but it will verbose information.

~~~
npm install
node server.js
~~~

After the server has successfully loaded run the CLI test script in a different terminal console. The client will connect to the server and give you an interface to interact to the app. Never use the terminal client for production, it should only be used for debugging.

~~~
cd clients
node cli.js
~~~


### Test CLI Client

The test CLI client is located in the `clients/` directory. This test client is not designed for production and must only be used for locally testing the server.

If the CLI client returns errors about invalid tokens check the client configuration settings in `app/Config/config.js` match up with the configuration settings in `clients/cli.js` file.



## Development Tips

Using nodemon with both the server and test cli client.

When any code is updated the server and / or client will be restarted.

~~~
nodemon server.js
~~~



## Key Components

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



## Contributing


We welcome contributions from developers to fix bugs, enhance existing features and creating new features for the chat bot. If you're just getting started check out the project [Github Issues](https://github.com/darrenmoore/GoodIntentionsChatBot/issues) for a list of improvements, bugs and wild ideas!

### Areas of interest

* Clients
* Example intents
* Skills
* Entities and data
* NLP improvements
* Database layer / ORM improvements
* Documentation
* Reporting issues


### How to Contribute

1. Fork the code from master
2. Create a branch (git checkout -b my-branch)
3. Commit your changes (git commit -m "My fix or feature")
4. Push to the origin branch (git push origin my-branch)
5. Create a new Pull Request


### Reporting Issues

Github Issues is used for managing bugs, improvements and future ideas.

For all improvements and feature requests that the following format is adheared to as often as possible for the description.

~~~
WHO
Optional
Who the issue is affecting or the target audience for the issue

WHY
Not required if it's a bug
Why the issue is required or why the target audience needs it

WHAT
Detailed information about the issue.
User stories and example dialog.
~~~

An example for creating a "Ping" Skill.

~~~
WHO
Onboarding new developers to the framework

WHY
There is a learning curve for GI so providing a simple example skill with an intent is useful

WHAT
As a new developer who downloads GI I want to learn how to build my first skill.
As a reference I go into my app skills directory and can see the "Ping" skill.
I then copy this directory, rename the skill, filenames and can make my own skill with an intent quickly
~~~