---
layout: page
title: Client Authorization
---


## Authorization flow

{% raw %}
<div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;nav&quot;:true,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom layers lightbox&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;url&quot;:&quot;https://drive.google.com/a/firecreek.co.uk/uc?id=1j1T3xepxoa42ivY008Xbg-ARCKhNKAPc&amp;export=download&quot;}"></div>
<script type="text/javascript" src="https://www.draw.io/embed2.js?&fetch=https%3A%2F%2Fdrive.google.com%2Fa%2Ffirecreek.co.uk%2Fuc%3Fid%3D1j1T3xepxoa42ivY008Xbg-ARCKhNKAPc%26export%3Ddownload"></script>
{% endraw %}




## Glossary


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