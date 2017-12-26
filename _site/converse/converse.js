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
		this.context = {
			opened: false,
			connected: true,
			input: 'text'
		};

		this._partials = {};
		this.socket = null;
		this.ident = null;

		//Main template
		this.template();

		//Template partials
		this.partials();

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
		var source   = $("#converse-template").html();
		var template = Handlebars.compile(source);
		
		var context = { "name" : "Ritesh Kumar", "occupation" : "developer" };
		var html = template(this.context);

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

	binds() {
		//Open and close the messaging window
		$('.converse-launcher').on('click', () => {
			if(this.context.opened) {
				this.close();
			}
			else {
				this.open();
			}
		});

		//Text input
		$('.converse-text input').keypress((e) => {
			if(e.which == 13) {
				this.submit_text();
			}
		});
		$('.converse-text button').on('click',(e) => {
			this.submit_text();
		});

		//Header controls
		$('.converse-controls .converse-control-menu').on('click',(e) => {
			this.menu_show();
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
		this.history_add(html);
		this.emit(text);
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
				this.history_add(html);
			}
		}
	}

	event(data) {
		let html = this.partial('message-event',{
			text: data
		});
		this.history_add(html);
	}

	state() {
		//Load history
		let history = store.get('converse-history');
		$('.converse-history').html(history);
		this.history_scroll_down();

		//Open messenger
		let opened = store.get('converse-opened');
		if(opened) {
			this.open();
		}
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
	}

	disconnected() {
		$('.converse').removeClass('converse-connected');
		this.event('Disconnected from server');
	}

	example(text) {
		this.open();
		this.send(text);
	}

	hide_inputs() {
		$('.converse-input').hide();
	}

	show_input(type) {
		this.hide_inputs();
		if(type == 'text') {
			this.show_input_text();
		}
		else if(type == 'actions') {
			this.show_input_actions();
		}
	}

	show_input_text() {
		$('.converse-input.converse-text').show();
		$('.converse-input.converse-text input[type=text]:first').focus();
	}

	show_input_actions() {
		$('.converse-input.converse-text').hide();
	}

	open() {
		this.context.opened = true;

		store.set('converse-opened', true);

		$('.converse').addClass('converse-opened');
		$('.converse-messenger').show();

		if(this.context.input == 'text') {
			$('.converse-input.converse-text input[type=text]:first').focus();
		}
	}

	close() {
		this.context.opened = false;

		store.set('converse-opened', false);

		$('.converse').removeClass('converse-opened');
		$('.converse-messenger').hide();
	}

	menu_show() {

	}

	menu_close() {
		
	}

}