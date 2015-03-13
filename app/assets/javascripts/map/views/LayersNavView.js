/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'amplify',
  'chosen',
  'map/presenters/LayersNavPresenter',
  'handlebars',
  'text!map/templates/layersNav.handlebars',
  'text!map/templates/layersNavByCountry.handlebars'
], function(Backbone, _, amplify, chosen, Presenter, Handlebars, tpl, tplCountry) {

  'use strict';

  var LayersNavView = Backbone.View.extend({

    el: '.layers-menu',

    template: Handlebars.compile(tpl),
    templateCountry: Handlebars.compile(tplCountry),

    events: {
      'click .layer': '_toggleLayer',
      'click #country-layers' : '_showNotification'
    },

    initialize: function() {
      _.bindAll(this, '_toggleSelected');
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
      //Experiment
      this.presenter.initExperiment('source');

      //Init
      this.$layersCountry = $('#layers-country-nav');
      this.$countryLayers = $('#country-layers');
    },


    /**
     * Used by LayersNavPresenter to toggle the class
     * name selected.
     *
     * @param  {object} layerSpec
     */
    _toggleSelected: function(layers) {

      this.layers = layers;

      // Toggle sublayers
      _.each(this.$el.find('.layer'), function(li) {
        var $li = $(li);
        var $toggle = $li.find('.onoffradio, .onoffswitch');
        var $toggleIcon = $toggle.find('span');
        var $layerTitle = $li.find('.layer-title');
        var layer = layers[$li.data('layer')];

        if (layer) {
          var isBaselayer = (layer.category_slug === 'forest_clearing');

          $li.addClass('selected');
          $toggle.addClass('checked');
          $layerTitle.css('color', layer.title_color);

          if (!isBaselayer) {
            $toggle.css('background', layer.title_color);
          } else {
            $toggle.css('border-color', layer.title_color);
            $toggleIcon.css('background-color', layer.title_color);
          }
          ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layer.slug);
        } else {
          $li.removeClass('selected');
          $toggle.removeClass('checked').css('background', '').css('border-color', '');
          $toggleIcon.css('background-color', '');
          $layerTitle.css('color', '');
        }
      });
    },

    /**
     * Handles a toggle layer change UI event by dispatching
     * to LayersNavPresenter.
     *
     * @param  {event} event Click event
     */
    _toggleLayer: function(event) {
      event && event.preventDefault();
      // this prevents layer change when you click in source link
      if (!$(event.target).hasClass('source') && !$(event.target).parent().hasClass('source')) {
        var layerSlug = $(event.currentTarget).data('layer');

        if ($(event.currentTarget).hasClass('ifl') || $(event.currentTarget).hasClass('c_f_peru')) {
            var fil_type = 'ifl_2013_deg';
          if ($(event.currentTarget).hasClass('c_f_peru')) {
            fil_type = 'concesiones_forestalesNS';
          }
          event && event.stopPropagation();
          var $elem = $(event.currentTarget);
            if (event.target.nodeName === 'LABEL') {
              $elem.find('input').click();
              return false;
            }
          if ($elem.hasClass('selected')) {$elem.find('input').prop('checked',false);}
          else {$elem.find('[data-layer="' + fil_type + '"] input').prop('checked', true);}
          if ($elem.prop('tagName') !== 'LI'){
            for (var i=0;i < $elem.siblings().length; i++) {
              if ($($elem.siblings()[i]).hasClass('selected')) {
                this.presenter.toggleLayer($($elem.siblings()[i]).data('layer'));
              }
              $elem.parents('li').data('layer' , $elem.data('layer')).addClass('selected');
            }
          }
        }
        this.presenter.toggleLayer(layerSlug);
        ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layerSlug);
      }
    },

    setIso: function(iso){
      this.iso = iso.country;
      this.region = iso.region;
      this.setIsoLayers();
    },

    updateIso: function(iso){
      (iso.country !== this.iso) ? this.resetIsoLayers() : null;
      this.iso = iso.country;
      this.region = iso.region;
      this.setIsoLayers();
    },


    _getIsoLayers: function(layers) {
      this.layersIso = layers;
    },

    resetIsoLayers: function(){
      _.each(this.$countryLayers.find('.layer'),function(li){
        if ($(li).hasClass('selected')) {
          $(li).trigger('click');
        }
      })
    },

    /**
     * Render Iso Layers.
     */
    setIsoLayers: function(e){
      var layersToRender = [];
      _.each(this.layersIso, _.bind(function(layer){
        if (layer.iso === this.iso) {
          layersToRender.push(layer);
        }
      }, this ));
      (layersToRender.length > 0) ? this.$countryLayers.addClass('active').removeClass('disabled') : this.$countryLayers.removeClass('active').addClass('disabled');
      this.renderIsoLayers(layersToRender);
    },

    renderIsoLayers: function(layers){
      var country = _.find(amplify.store('countries'), _.bind(function(country){
        return country.iso === this.iso;
      }, this ));
      var name = (country) ? country.name : 'Country';
      (country) ? this.$countryLayers.addClass('iso-detected') : this.$countryLayers.removeClass('iso-detected');

      this.$countryLayers.html(this.templateCountry({ country: name ,  layers: layers }));
      this.presenter.initExperiment('source');
      this._toggleSelected(this.layers);
    },

    _showNotification: function(e){
      if ($(e.currentTarget).hasClass('disabled')) {
        ($(e.currentTarget).hasClass('iso-detected')) ? this.presenter.notificate('country-not-layers') : this.presenter.notificate('country-choose');
      }
    }

  });

  return LayersNavView;

});
