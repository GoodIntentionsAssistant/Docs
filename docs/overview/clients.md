---
layout: page
title: Clients
---

Clients act as middleware between the server and the service it will connect to.

Clients could include interfaces to Facebook, Line, Hipchat, Slack, IRC and any other type of chat interface. These clients must be written by a developer to make GI useful. We hope to provide packaged clients with GI after the first stable release.


## CLI Test Client

GI provides a CLI test client found in `clients/cli.js`.

Load the server and then load the client. The client will identify with the server with the client token (stored in your config.js file) and the server will generate a session_token for all requests. You can then type in any command to test the app.



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
config.clients = {
  'facebook': { 
    'secret': 'this-is-my-secret'
  }
};
~~~




## Client authorizing and identifying

On connecting the client must identify itself using its client name and `secret` found in your config.js file.

~~~javascript
socket.emit('identify',{
  client: 'facebook',
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
fast | no | Response from the app has delays to simulate typing to make the bot experience more human-like. By default fast is false, changing it to true will stop the simulated delays. It's advisable to enable fast when debugging.




### Speeding up the request

When the request is passed to GI it will have a delay to simulate the bot typing. There are three methods to remove this delay.

#### Fast Parameter

~~~javascript
var input = {
  client: 'facebook',
  session_token: 'm626NfP8jFYPAKNw',
  user: 'bob',
  text: 'hello to my new app!',
  fast: true
};
socket.emit('request',input);
~~~

#### Response Simulated Typing

In the `config.js` file change the `response` settings to `0`;

~~~javascript
config.response = {
  min_reply_time: 0,
  letter_speed: 0,
  max_response: 0
};
~~~

#### Queue Speed

In the `config.js` file change the loop speed. By default we recommend this value to be 500ms.

~~~javascript
config.app = {
  loop_speed: 10
}
~~~




## Response

The response from the app will return JSON formatted data. A response will come in multiple parts and have the same ident and an increasing sequence number.

Multipart sending can be useful when the result could be delayed by latency when calling a remote API, such as flight searches. It's possible to send the first message telling the user to wait a moment.

~~~json
{
  "type": "message",
  "messages": [ "Hi! I'm the Good Intentions bot!" ],
  "attachments": {},
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
messages | If the `type` is message an array of messages will be returned.
attachments | Rich meta data including payload data for images, links, action buttons for the clients.
intent | The intent which was called.
action | The indents action which was called.
namespace | Return socket.io name space
confidence | Intent classifiers confidence
sequence | Incrementing number since the server was started
microtime | Server microtime when the data was sent


### Example of catching response

~~~javascript
socket.on('response', (data) => {
  if(data.type == 'message') {
    for(let ii=0; ii<data.messages.length; ii++) {
      console.log('Message:', data.messages[ii]);
    }
  }
});
~~~








## SDK


The client SDK is under development but is used for the "CLI" test client.

The Node.js SDK will provide a quick route to building your own clients and will handle identification handshakes.

### Example Client

~~~javascript
/**
 * Very Simple GI Client Test
 * 
 * This is a test client for Good Intentions using Node.js
 * It is not designed to be used in production.
 */
const GiClient = require('./sdk/index.js');

//Configuration
let name  = 'test';                      
let token = 'TrCgyKqVtY';                
let host  = 'http://localhost:3000';    

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
  GiApp.send('hello');
});

GiApp.on('error', (data) => {
  console.log('Error: '+data.message);
  prompt.resume();
});

GiApp.on('message', (data) => {
  for(var ii=0; ii<data.messages.length; ii++) {
    console.log(data.messages[ii]);
  }
  GiApp.disconnect();
});
~~~

After running the script you will get a similar output to this.

~~~
> /GI/App/clients $ node simple.js
Connected to server
Identified
Hi! I'm the Good Intentions bot!
I'm all about productivity and getting things done!
Disconnected
~~~