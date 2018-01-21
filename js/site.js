
var Site = {

  load: function() {
    this.converse = null;

    //this.nav_load();
    this.contents();

    this.scrolling();

    this.converse_load();
    this.converse_hint();
  },


  scrolling: function() {
    if($('.side-nav').length == 0) {
      return;
    }

    var scrollingDiv   = $('.side-nav');
    var contentsDiv    = $('.contents-nav');

    let scrollingTop   = scrollingDiv.position().top;
    let scrollingStart = 20;

    $(window).scroll(() => {
      let windowTop = $(window).scrollTop();

      let distance = (scrollingTop - scrollingStart) - windowTop;

      if(distance < 0) {
        scrollingDiv.css({"marginTop": (windowTop - scrollingTop + scrollingStart) + "px"} );
        contentsDiv.css({"marginTop": (windowTop - scrollingTop + scrollingStart) + "px"} );
      }
      else {
        scrollingDiv.css({"marginTop": "0"});
        contentsDiv.css({"marginTop": "0"});
      }
    });
  },


  nav_load: function() {
    this.nav_collapse();

    //Find current
    let url = window.location.href;
    if(url.substr(-1) == '/') { url = url.substr(0, url.length-1); }
    let url_parts = url.split('/');
    let area_pos = url_parts.indexOf('docs');

    if(area_pos !== -1) {
      let area = url_parts[area_pos];
      let type = url_parts[area_pos+1];
      if(type == 'start') { type = ''; }
      this.nav_expand(type);
    }
    else {
      //Getting started
      this.nav_expand();
    }
  },


  nav_expand: function(type) {
    var menu = '';

    if(type) {
      menu = $('.side-nav a[href$="'+type+'/"]').parent().find('ul');
    }
    else {
      menu = $('.side-nav a').first().parent().find('ul');
    }

    menu.show();
  },


  nav_collapse: function() {
    $('.side-nav nav > ul > li > ul').hide();
  },


  contents: function() {
    if($('.post h2').length <= 1) {
      return;
    }

    let html = '';

    //Title
    let obj  = $('.post h1')
    let id   = $(obj).attr('id');
    let name = $(obj).html();
    html += '<li><a href="#">'+name+'</a></li>';

    //Sub headings
    $('.post h2').each((key, obj) => {
      let id = $(obj).attr('id');
      let name = $(obj).html();

      html += '<li><a href="#'+id+'">'+name+'</a></li>';
    });

    $('.contents-nav').show();
    $('.contents-nav nav').html('<ul>'+html+'</ul>');
  },


  converse_load: function() {
    this.converse = new Converse;

    //Bind on examples
    $('.chat div.user span').on('click', (e) => {
      let text = $(e.currentTarget).html();
      this.converse_send(text);
    });
  },


  converse_send: function(text, hint = true) {
    this.converse.open();
    this.converse.send(text);

    //Close the hint
    if(hint) {
      $('.chat-hint').fadeOut();
      store.set('hint', 'hide');
    }
  },


  converse_hint: function() {
    //Closed already
    //The hint should only show one time. Once the user has clicked on
    //the first chat bubble they won't see the hint again
    if(store.get('hint') == 'hide') {
      return;
    }

    //Get the first chat element and return if none is found
    let obj = $('.chat .user span');
    if(obj.length == 0) {
      return;
    }

    //Chat button
    let hintHeight = 42;
    let hintWidth = 102;

    //
    let pos  = obj.position();
    let left = obj.position().left - (hintWidth / 2) + 40;
    let top  = obj.position().top - hintHeight;

    let hint = $('<div></div>');
    hint.addClass('chat-hint');
    hint.html('Click me!');
    hint.css({
      'left': left+'px',
      'top': top+'px'
    });

    $('body').append(hint);
  }

}

Site.load();