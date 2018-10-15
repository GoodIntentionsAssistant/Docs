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


### Step one

Create a directory on your computer and clone the git repository.

~~~
cd ~
mkdir gi
cd gi
git clone git@github.com:GoodIntentionsAssistant/gi.git server
cd server
npm install
cp app/Config/config.example.js app/Config/config.js
node server.js
~~~

The server should now be running with default settings. It's recommended to change the access keys in the configuration file.


### Step two

Once the server is running open another terminal window go back to your gi directory created in step one.

Make sure you are not in the server directory!

~~~
cd ~/gi
git clone git@github.com:GoodIntentionsAssistant/gi-client-cli.git cli
cd cli
npm install
cp config.example.js config.js
~~~


### Step three

Say something in the cli you just ran!

You should now be talking directly to the GI server.


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