apos.define('apostrophe-fuzzy-finder', {
  extend: 'apostrophe-context',

  afterConstruct: function(self) {
    apos.on('ready', function() {
      self.init();
      self.enableShortcut();
      self.enable();
    });
  },

  construct: function(self, options) {

    self.init = function() {
      self.$body = $('body');
      self.$adminBar = self.$body.find('[data-apos-admin-bar]');
      self.$finder = self.$body.find('[data-apos-fuzzy-finder]');
      self.active = false;
    };

    self.enableShortcut = function() {
      self.$body.on('click', '[data-apos-fuzzy-finder-trigger]', function() {
        self.open();
        return false;
      });
      self.$body.on('click', '[data-apos-fuzzy-finder-close]', function() {
        self.close();
        return false;
      });
      self.$body.on('keydown', function(e) {
        if (apos.ui.shiftActive && e.keyCode === 84) {
          self.open();
          return false;
        }
        if (self.active && e.keyCode === 27) {
          self.close();
          return false;
        }
      });
    };

    self.enable = function() {
      self.$finder.autocomplete({
        source: function(request, response) {
          return self.api('autocomplete', {
            term: request.term
          }, response);
        },
        autoFocus: true,
        minLength: 1,
        focus: function(event, ui) {
          // self.$finder.val(ui.item.label);
          return false;
        },
        select: function(event, ui) {
          window.location.href = ui.item._url;
          return false;
        }
      }).data('uiAutocomplete')._renderItem = function( ul, item) {
          var re = new RegExp(this.term, 'i') ;
          var t = item.label.replace(re, "<span style='color: #6666FF;'>"
            + this.term
            + "</span>");
          return $( "<li class='ui-menu-item'></li>" )
            .data( "item.autocomplete", item )
            .append( t )
            .appendTo( ul );
      };
    };

    self.open = function() {
      if (self.active) {
        // Finder is already active
        return;
      }
      self.active = true;
      self.$adminBar.addClass('apos-active apos-finder-open');
      self.$finder.focus();
    };

    self.close = function() {
      self.active = false;
      self.$adminBar.removeClass('apos-finder-open');
    };

  }
});
