---
layout: page
title: Clients
---

Clients act as middleware between the server and the service it will connect to.

Without a client GI won't be able to function.

Clients could include interfaces to Facebook, Line, Hipchat, Slack, IRC and any other type of chat interface.

For testing and developing it's recommended to download and install the GI CLI Client. See the Installation page for instructions.



## Authorization flow

{% raw %}
<div class="mxgraph" style="max-width:800px;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom layers lightbox&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;url&quot;:&quot;https://drive.google.com/a/firecreek.co.uk/uc?id=1j1T3xepxoa42ivY008Xbg-ARCKhNKAPc&amp;export=download&quot;}"></div>
<script type="text/javascript" src="https://www.draw.io/embed2.js?&fetch=https%3A%2F%2Fdrive.google.com%2Fa%2Ffirecreek.co.uk%2Fuc%3Fid%3D1j1T3xepxoa42ivY008Xbg-ARCKhNKAPc%26export%3Ddownload"></script>
{% endraw %}




## Authorization Glossary


Name | Description | Set by | Used by
--- | --- | --- | ---
Secret | Client secret enabling client to talk to GI | GI | Client
Auth token | Client uses the secret token after identifying with GI, the secret is no longer required | GI | Client
Token | End users unique identifier, e.g. their ip address | User | GI
Session id | End users session id to make requests | User | GI



## White listing a new client

Only clients that have been white listed can connect and send input to the framework. In your `app/Config/config.json` file are settings to define the name and the client token. If you create a new client you must add the key and secret to the configuration file first.

~~~javascript
"clients": {
  "test": {
    "secret": "this-is-my-secret"
  },
  "web": {
    "secret": "second-client-for-web"
  }
}
~~~




## Client authorizing and identifying

On connecting the client must identify itself using its client name and `secret` found in your config.js file.

~~~javascript
socket.emit('identify',{
  client: 'test',
  secret: 'this-is-my-secret'
});
~~~

An event will be returned with the success and a `auth_token`.

~~~json
{
  "success": true,
  "message": "Successfully identified",
  "auth_token": "m626NfP8jFYPAKNw",
  "ident": "ZNWXHXYT",
  "type": "identify"
}
~~~

The auth token must be made on all future requests. The secret is no longer needed and will be rejected if sent for further requests.





## Making a request

After the client has identified requests can be sent to the app. Certain fields must be passed along with the input.

~~~javascript
var input = {
  client: 'facebook',
  session_token: 'm626NfP8jFYPAKNw',
  user: 'bob',
  text: 'hello to my new app!'
};
socket.emit('request',input);
~~~

Key | Required | Description
--- | --- | ---
client | yes | Whitelisted client name. Each client should have a unique name. This must be provided for every request.
session_token | yes | Session token key provided by the app that must be used on all requests. The session_token is provided when the client identifies with the server after connection.
user | yes | Unique name or identifer for the user interfacing with the app. For example this could be their facebook graph user id. For testing any value can be used.
type | no | Default is set to 'message'. Other options are also 'event' and 'intent'
text | no | Raw text input from the user, e.g. "Good Morning". This is required if the type is message
data | no | Meta data to send to the request and turned into a parameter for the intent to read from




#### Queue Speed and Consecutive Requests

For changing the queue speed modify your `config.json` file.
It is recommended to set this loop between 100 - 500ms

~~~javascript
"app": {
  "loop_speed": 500
}
~~~

By default GI will handle one consecutive request at a time per each queue speed.
When in development it is recommended to set `max_consecutive` to `1`.

If you are experiencing slow responses from GI reduce `loop_speed` and increase `max_consecutive`.

~~~javascript
"queue": {
  "max_consecutive": 1
}
~~~




## Response

The response from the app will return JSON formatted data. A response will come in multiple parts and have the same ident and an increasing sequence number.

Multipart sending can be useful when the result could be delayed by latency when calling a remote API, such as flight searches. It's possible to send the first message telling the user to wait a moment while the intent is making a call to an external API.

~~~json
{
  "attachments": {
    "message": [
      { "text": "Hi! I'm the Good Intentions bot!" }
    ]
  },
  "intent": "Fun/Greeting",
  "action": "response",
  "namespace": "response",
  "confidence": 22.5646096341948,
  "sequence": 1,
  "microtime": 1503840844828
}
~~~

Key | Description
--- | ---
type | Currently supported types are "start", "end" and "message".
attachments | Rich meta data including payload data for messages, images, links, action buttons for the clients.
intent | The intent which was called.
action | The indents action which was called.
namespace | Return socket.io name space
confidence | Intent classifiers confidence
sequence | Incrementing number since the server was started
microtime | Server microtime when the data was sent


### Example of catching response

~~~javascript
socket.on('response', (data) => {

  if(data.attachments.message) {
    var message = data.attachments.message;
    for(var ii=0; ii<message.length; ii++) {
      console.log('Message: '+message[ii].text);
    }
  }

});
~~~









## Example Client using GI SDK

In your GI server `config.json` file add the client key and secret then restart the server.

~~~json
{
  "clients": {
    "testdoc": {
      "secret": "my-test-token"
    }
  }
}
~~~

Create a new directory outside of the server and run `npm install gi-sdk-nodejs`.

Then create a new file in this directory called `app.js` and paste the example code below.


~~~javascript
/**
 * Very Simple GI Client Test
 * 
 * This is a test client for Good Intentions using Node.js
 * It is not designed to be used in production.
 */
const GiClient = require('gi-sdk-nodejs');

//Configuration
let name  = 'testdoc';
let token = 'my-test-token';
let host  = 'http://localhost:3000';
let username = 'testing';

//Start the SDK
GiApp = new GiClient(name, token, host);
GiApp.connect();

GiApp.on('connect', () => {
  console.log('Connected to server');
});

GiApp.on('disconnect', () => {
  console.log('Disconnected');
});

GiApp.on('identified', () => {
  console.log('Identified');
  GiApp.send(username, 'message', 'hello');
});

GiApp.on('error', (data) => {
  console.log('Error: '+data.message);
});

GiApp.on('message', (data) => {
  if(data.attachments.message) {
    var message = data.attachments.message;
    for(var ii=0; ii<message.length; ii++) {
      console.log('Message: '+message[ii].text);
    }
  }
  GiApp.disconnect();
});
~~~

After running the script you will get a similar output to this.

~~~
> $ node app.js
Connected to server
Identified
Message: Hi! I'm the Good Intentions bot!
Message: I'm all about productivity and getting things done!
Disconnected
~~~
