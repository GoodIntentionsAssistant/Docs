/**
 * Converse
 *
 * A quick hacked inline chat for Good Intentions documentation.
 *
 * This is not designed to be used on a production server.
 * 
 */
class Converse {

	constructor() {
		this._state = {
			opened: false,
			connected: true,
			input: 'text',
			speak: false,
			menu_open: false,
			last_message_sent: null
		};

		this._partials = {};
		this.socket = null;
		this.ident = null;

		//Main template
		this.template();

		//Template partials
		this.partials();

		//Hide history show connecting
		$('.converse-history').hide();
		$('.converse-connecting').show();

		//Binding object events
		this.binds();

		//Generate user identity
		this.user();

		//Load historic data from local storage
		this.state();

		//Load socket.io client and connect
		this.client();
	}


	user() {
		var _ident = Cookies.get('ident');
		if(!_ident) {
			_ident = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			Cookies.set('ident', _ident);
		}
		this.ident = _ident;
	}


	client() {
		this.socket = io('http://localhost:7000');

		this.socket.on('connect', () => {
			this.connected();
			this.identify();
		});

  	this.socket.on('disconnect', () => {
			this.disconnected();
		});

  	this.socket.on('response', (data) => {
			this.response(data);
		});
	}

	template() {
		var source   	= $("#converse-template").html();
		var template 	= Handlebars.compile(source);
		var html 			= template();

		$(document.body).append(html);
	}

	partials() {
		let load = [
			'message-event',
			'message-in',
			'message-out'
		];

		for(var ii=0; ii < load.length; ii++) {
			let key = load[ii];
			this._partials[key] = Handlebars.compile($('#converse-partial-'+key).html());
		}
	}

	partial(key, data) {
		let template = this._partials[key];
		return template(data);
	}


/**
 * State
 *
 */
	state() {
		//Load history
		let history = store.get('converse-history');
		$('.converse-history').html(history);
		this.history_scroll_down();

		//Open messenger
		let state = store.get('state');
		if(state) {
			this._state = state;
		}

		//Check if the messenger should be opened
		if(this.state_get('opened')) {
			this.open();
		}
	}


	state_set(key, val) {
		this._state[key] = val;
		store.set('state', this._state);
	}


	state_get(key) {
		return this._state[key];
	}


	binds() {
		//Open and close the messaging window
		$('.converse-launcher').on('click', () => {
			if(this._state.opened) {
				this.close();
			}
			else {
				this.open();
			}
		});

		//Text input
		$('.converse-text input').keydown((e) => {
			if(e.which == 13) {
				//Return key
				this.submit_text();
			}
			else if(e.which == 38) {
				//Arrow key up
				let last_message = this.state_get('last_message_sent');
				if(last_message) {
					$('.converse-text input').val(last_message);
				}
			}
		});
		$('.converse-text button').on('click',(e) => {
			this.submit_text();
		});

		//Header controls
		$('.converse-controls .converse-control-menu').on('click',(e) => {
			if(this.menu_open) {
				this.menu_show();
			}
			else {
				this.menu_hide();
			}
		});

		$('.converse-controls .converse-control-close').on('click',(e) => {
			this.close();
		});
	}

	submit_text() {
		let obj = $('.converse-text input');
		let text = $(obj).val();

		if(!text) {
			return false;
		}

		$(obj).val('');

		obj.focus();

		this.send(text);
	}

	send(text) {
		let html = this.partial('message-out',{
			text: text
		});
		this.emit(text);
		this.history_add(html);

		//Save previous message sent
		this.state_set('last_message_sent', text);
	}

	identify() {
		this.socket.emit('identify', {
			ident: this.ident
		});
	}

	emit(text) {
		this.socket.emit('request', {
			ident: this.ident,
			text: text
		});
	}

	response(data) {
		console.log(data);
		if(data.type == 'message') {
			for(var ii=0; ii<data.messages.length; ii++) {
				let html = this.partial('message-in',{
					text: data.messages[ii]
				});
				this.speak(data.messages[ii]);
				this.history_add(html);
			}
		}

		//Attachments
		if(data.attachments) {
			if(data.attachments.actions) {
				this.show_input('actions', data.attachments.actions);
			}

			if(data.attachments.images) {
				for(var ii=0; ii<data.attachments.images.length; ii++) {
					let html = this.partial('message-in',{
						img: data.attachments.images[ii].url
					});
					this.history_add(html);
				}
			}
		}
	}

	speak(text) {
		return;
		if(!this.state_get('speak')) {
			return false;
		}

		if(responsiveVoice.voiceSupport()) {
			responsiveVoice.speak(text, 'UK English Female');
		}
	}

	event(data) {
		let html = this.partial('message-event',{
			text: data
		});
		this.history_add(html);
	}

	history_add(html) {
		$('.converse-history').append(html);
		this.history_scroll_down();

		//Save to local storage
		store.set('converse-history', $('.converse-history').html());
	}

	history_scroll_down() {
		$(".converse-content").scrollTop($(".converse-content")[0].scrollHeight);
	}

	connected() {
		$('.converse').addClass('converse-connected');
		this.show_input('text');
		this.event('Connected to server');

		//
		$('.converse-history').show();
		$('.converse-connecting').hide();
		this.history_scroll_down();
	}

	disconnected() {
		$('.converse').removeClass('converse-connected');
		this.event('Disconnected from server');

		//
		$('.converse-history').hide();
		$('.converse-connecting').show();
		this.hide_inputs();
	}

	example(text) {
		this.open();
		this.send(text);
	}

	hide_inputs() {
		$('.converse-input').hide();
	}

	show_input(type, data) {
		this.hide_inputs();

		if(type == 'text') {
			this.show_input_text();
		}
		else if(type == 'actions') {
			this.show_input_actions(data);
		}
	}

	show_input_text() {
		$('.converse-input.converse-text').show();
		$('.converse-input.converse-text input[type=text]:first').focus();
	}

	show_input_actions(data) {
		let html = $('<div>');

		data.forEach((action) => {
			let button = $('<button>');
			button.text(action.text);
			button.on('click', () => {
				this.send(action.text);
				this.show_input('text');
			});
			html.append(button);
		});

		$('.converse-input.converse-actions').show();
		$('.converse-input.converse-actions').html(html);
	}

	open() {
		this.state_set('opened', true);

		$('.converse').addClass('converse-opened');
		$('.converse-messenger').show();

		if(this._state.input == 'text') {
			$('.converse-input.converse-text input[type=text]:first').focus();
		}
	}

	close() {
		this.state_set('opened', false);

		$('.converse').removeClass('converse-opened');
		$('.converse-messenger').hide();
	}

	menu_show() {
		//Menu dom
		let obj = $('.converse-menu');

		//Menu button
		let offset 	= $('.converse-controls .converse-control-menu').offset();
		let left 		= (offset.left - obj.width()) + 40;
		let top 		= offset.top + 58;

		//Set position
		obj.css({
			top: top,
			left: left,
			zIndex:9999
		});
		obj.show();

		this.menu_open = true;
	}

	menu_hide() {
		$('.converse-menu').hide();
		this.menu_open = false;
	}

}