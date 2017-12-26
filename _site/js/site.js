
var Site = {

  load: function() {
    this.converse = null;

    this.nav_load();
    this.converse_load();
  },

  nav_load: function() {
    this.nav_collapse();

    //Find current
    let url = window.location.href;
    if(url.substr(-1) == '/') { url = url.substr(0, url.length-1); }
    let url_parts = url.split('/');
    let area_pos = url_parts.indexOf('en');

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

  converse_load: function() {
    this.converse = new Converse;

    //Bind on examples
    $('.chat div.user span').on('click', (e) => {
      let text = $(e.currentTarget).html();
      this.converse_send(text);
    });
  },

  converse_send: function(text) {
    this.converse.open();
    this.converse.send(text);
  }

}

Site.load();