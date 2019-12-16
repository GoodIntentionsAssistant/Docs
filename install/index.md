---
layout: page_install
title: Installation
---


## 1. Download

Create a directory on your computer and clone the git repository.

~~~
cd ~
mkdir gi
cd gi
git clone git@github.com:GoodIntentionsAssistant/gi.git server
cd server
npm install
cp app/Config/config.example.json app/Config/config.json
~~~

The server will now run but it will require some skills



## 2. Install Skills

Now we need to install some skills to get GI actually doing anything before we start talking to it.

From the main directory.

~~~
node gi install gi-skill-basics
node gi install gi-skill-helloworld
node gi install gi-skill-guessnumber
~~~


## 3. Load Server

Good intentions server is now installed with three basic skills to get you started.

Calling `gi serve` will start the Good Intentions assistant which will listen to a port.

~~~
node gi serve
~~~


## 4. Install CLI Client

Once the server is running open another terminal window go back to your gi directory created in step one.

Make sure you are not in the server directory!

~~~
cd ~/gi
git clone git@github.com:GoodIntentionsAssistant/gi-client-cli.git cli
cd cli
npm install
cp config.example.js config.js
~~~


## 5. Talk to Assistant

Say something in the cli you just ran!

You should now be talking directly to the GI server.

