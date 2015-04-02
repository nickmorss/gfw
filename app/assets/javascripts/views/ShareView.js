/**
 * The ShareView selector view.
 *
 * @return ShareView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'text!templates/share.handlebars',
  'views/SharePreviewView'
], function(_, Handlebars, tpl, SharePreviewView) {

  'use strict';

  var ShareModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
      type: 'link',
      url: window.location.href,
      embedUrl: window.location.href,
    },
    setEmbedUrl: function(){
      if($('body').hasClass('is-countries-page')){
        this.embedUrl = window.location.origin + '/embed' + window.location.pathname + window.location.search;
      }else{
        this.embedUrl = window.location.href;
      }
      return this.embedUrl;
    }

  });

  var ShareView = Backbone.View.extend({
    el: '.share-modal',

    template: Handlebars.compile(tpl),

    events: {
      'click #share_field' : '_selectTarget',
      'click .change-type' : '_setTypeFromEvent',
      'click #preview' : '_showPreview',
      'click .share-sozial a' : '_shareToSocial',
      'click .overlay' : 'hide',
      'click .close' : 'hide'
    },

    initialize: function(parent) {
      this.model = new ShareModel();
      this.render();
      this._setListeners()
    },

    share: function(event) {
      event && event.preventDefault() && event.stopPropagation();

      this._setUrlsFromEvent(event);
      this.$el.show(0);
    },

    hide: function(e){
      e && e.preventDefault();
      this.$el.hide();
    },

    _setListeners: function(){
      this.model.on('change:type', this._toggleTypeButtons, this);
      this.model.on('change:url', this.render, this);

      $(document).on('keyup', _.bind(function(e){
        if (e.keyCode === 27) {
          this.model.set('hidden', true);
        }
      }, this ));
    },

    render: function(){
      this._renderInput();
      this.$el.html(this.template());
      this._cacheVars();
    },

    _cacheVars: function(){
      this.$changeType = $('.change-type');
      this.$shareinfo = $('#share-info p');
      this.$input = $('#share_field');
      this.$twitterLink = this.$el.find('.twitter');
      this.$facebookLink = this.$el.find('.facebook');
      this.$google_plusLink = this.$el.find('.google_plus');
    },

    _renderInput: function() {
      switch(this.model.get('type')){
        case 'link':
          setTimeout(_.bind(this._renderLink, this),100);
        break;
        case 'embed':
          setTimeout(_.bind(this._renderEmbed, this),100);
        break;
      }
    },

    _renderLink: function(){
      this._generateLinkUrl(this.model.get('url'), _.bind(function(url) {
        this.model.set('url', url);
        this.$input.val(url);
        this.$shareinfo.html('Click and paste link in email or IM');
        this.$twitterLink.attr('href', 'https://twitter.com/share?url=' + url);
        this.$facebookLink.attr('href', 'https://www.facebook.com/sharer.php?u=' + url);
        this.$google_plusLink.attr('href', 'https://plus.google.com/share?url=' + url);
      }, this ));
      ga('send', 'event', 'Map', 'Share', 'Share Link clicked');
    },

    _generateLinkUrl: function(url, callback) {
      $.ajax({
        url: 'https://api-ssl.bitly.com/v3/shorten?longUrl=' + encodeURIComponent(url) + '&login=vizzuality&apiKey=R_de188fd61320cb55d359b2fecd3dad4b',
        type: 'GET',
        async: false,
        dataType: 'jsonp',
        success: function(r) {
          if (!r.data.url) {
            callback && callback(url);

            throw new Error('BITLY doesn\'t allow localhost alone as domain, use localhost.lan for example');
          } else {
            callback && callback(r.data.url);
          }
        },
        error: function() {
          callback && callback(url);
        }
      });
    },

    _renderEmbed: function(){
      this.$input.val(this._generateEmbedSrc());

      this.$shareinfo.html('Click and paste HTML to embed in website.');
      // Only show preview on desktop, mobile preview is quite fiddly
      // for the user
      if (!this._isMobile()) {
        this.$shareinfo.append('<button id="preview" class="btn gray little uppercase">Preview</button></p>');
      }

      ga('send', 'event', 'Map', 'Share', 'Share Embed clicked');
    },

    _generateEmbedSrc: function() {
      var dim_x = 600, dim_y = 600;
      return '<iframe width="' +dim_x+ '" height="' +dim_y+ '" frameborder="0" src="' + this.model.get('embedUrl') + '"></iframe>';
    },

    _setUrlsFromEvent: function(event) {
      var url = $(event.currentTarget).data('share-url');
      if (url !== undefined) {
        this.model.set('url', url);
      }else{
        this.model.set('url', window.location.href);
      }

      var embedUrl = $(event.currentTarget).data('share-embed-url');
      if (embedUrl !== undefined) {
        this.model.set('embedUrl', embedUrl);
      }else{
        var urlWithEmbed = window.location.origin + '/embed' + window.location.pathname + window.location.search;
        this.model.set('embedUrl', urlWithEmbed);
      }
    },

    _setTypeFromEvent: function(event) {
      var target_type = $(event.currentTarget).data('type');
      var type = target_type || this.model.get('type') || 'link';
      this.model.set('type', type);
    },

    _toggleTypeButtons: function() {
      this.$changeType.toggleClass('green').toggleClass('gray');
      this._renderInput();
    },

    _selectTarget: function(e){
      $(e.currentTarget).select();
    },

    _showPreview: function(){
      var iframeView = new SharePreviewView({
        src: this.model.get('embedUrl')
      });

      $('body').append(iframeView.render().$el);
    },

    _shareToSocial: function(e){
      e && e.preventDefault();

      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = $(e.currentTarget).attr('href'),
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;

      window.open(url, 'Share this map view', opts);
    },

    _isMobile: function() {
      return ($(window).width() > 850) ? false : true;
    }
  });

  return ShareView;

});
