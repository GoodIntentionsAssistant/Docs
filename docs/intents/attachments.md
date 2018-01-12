---
layout: page
title: Intent Attachments
---

The response from the intent can hold additional meta data such as action buttons, images and field data making messages more interactive.

An intent can return two action attachments "Yes" and "No" which could be passed to Facebook to show two buttons with the message.

~~~javascript
request.attachment('action', 'Yes');
request.attachment('action', 'No');
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Cheese</span></div>
  <div class="bot"><span>Do you like cheese?</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
</div>



Supported attachment types are currently:

* `action` - Button options to show the user
* `image` - Send image URL's to be displayed
* `field` - Additional small information, e.g. citation


## Enabling attachments

Attachments are found in `/src/Attachment/`

For an attachment to work they must be enabled in your `config.js` file and the server must be restarted.

~~~javascript
config.attachments = [
  'Sys.Attachment.Image',
  'Sys.Attachment.Action',
  'Sys.Attachment.Field'
];
~~~


## Client support

The clients must support these attachment types to send to the end platform. Each platform handle these attachments differently and can have restrictions. For example Facebook support actions and buttons but have a limit of three buttons in total.

GI's attachments were loosely based on the [Slack API](https://api.slack.com/docs/message-attachments).


## Action buttons

Show option buttons to the user.

~~~javascript
request.attachment('action', 'Rock');
request.attachment('action', 'Paper');
request.attachment('action', 'Scissors');
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Play rock paper scissors</span></div>
  <div class="bot"><span>Rock, paper or scissors?</span></div>
  <div class="attachment attachment-buttons">
    <span>Rock</span>
    <span>Paper</span>
    <span>Scissors</span>
  </div>
</div>

After one of these buttons is pressed it will send the text back to the GI client, for example "yes".

But without using `expect` and a `parameter` the next input of "yes" or "no" won't be recognised.


## Example

This example uses attachment of buttons, parameters to fetch the confirmation and expecting to wait for the reply.

The Apptem Confirm entity has a small dictionary of common confirmations for yes and no.

~~~javascript
module.exports = class AskMeAgainIntent extends Intent {

  setup() {
    this.train(['ask me again'], { classifier:'strict' });

    this.parameter('ask_again', {
      name: 'Ask again',
      entity: 'App.Common.Entity.Confirm'
    });
  }

  response(request) {
    request.attachment('action','Yes');
    request.attachment('action','No');

    request.expect({
      action: 'chosen',
      force: true
    });

    return 'Ask me again?';
  }

  chosen(request) {
    var choice = request.parameters.value('ask_again');
    if(choice == 'yes') {
      return request.redirect('App.Example.Intent.AskMeAgain');
    }
    return 'OK that is enough';
  }

}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>Ask me again</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
  <div class="user"><span>Yes</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
  <div class="user"><span>Yup!</span></div>
  <div class="attachment attachment-buttons">
    <span>Yes</span>
    <span>No</span>
  </div>
  <div class="user"><span>No</span></div>
  <div class="bot"><span>OK that is enough</span></div>
</div>


## Images

Used for showing buttons to a user.

~~~javascript
request.attachment('image','https://picsum.photos/300/300/?random');
~~~

<div class="chat" markdown="0">
  <div class="user"><span>Random picture</span></div>
  <div class="bot"><span><img src="https://picsum.photos/300/300/?random"></span></div>
</div>



## Creating an attachment

Within your skill directory create a new directory called `Attachment` and create a file prepending the name of the attachment.

This following example is stored in `app/Skill/Example/Attachment/navigation.js`


~~~javascript
module.exports = class NavigationAttachment extends Attachment {

  constructor(app) {
    super(app);

    //Can't have more than one of these attachments
    this.multiple = false;
  }

  build(data) {
    return {
      name: data.name,
      url: data.url
    };
  }

}
~~~

Enable the new attachment in your app config using the identifier name.

~~~javascript
config.attachments = [
  'App.Example.Attachment.Navigation'
];
~~~

Then your intents from any skill can use this attachment.

~~~javascript
module.exports = class DocumentationIntent extends Intent {

  setup() {
    this.train([
      '@App.Example.Entity.Documentation',
      new RegExp(/^go to/,'g')
    ]);

    this.parameter('page', {
      name: "Page",
      entity: "App.Example.Entity.Documentation"
    });
  }

  response(request) {
    if(!request.parameters.has('page')) {
      return 'I\'m not sure of that page in the documentation';
    }

    let label = request.parameters.get('page.data.label');
    let url = request.parameters.get('page.data.url');

    request.attachment('navigation', {
      name: label,
      url: url
    });

    return 'Taking you to '+label;
  }

}
~~~

This attachment will then be included in the response that your client can handle.


~~~javascript
{
  "attachments": {
    "navigation": {
      "name": "Intent attachments",
      "url": "/docs/intents/attachments"
    }
  }
}
~~~


<div class="chat" markdown="0">
  <div class="user"><span>go to attachments</span></div>
  <div class="bot"><span>Taking you to Intent attachments</span></div>
</div>