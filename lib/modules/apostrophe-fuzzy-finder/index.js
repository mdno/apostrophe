var _ = require('lodash');

module.exports = {
  afterConstruct: function(self) {
    self.pushAssets();
    self.pushCreateSingleton();
    self.createRoutes();
  },

  construct: function(self, options) {

    self.pushAssets = function() {
      self.pushAsset('script', 'user', { when: 'user' });
    };

    self.pushCreateSingleton = function() {
      options.browser = options.browser || {};
      options.browser.action = options.browser.action || self.action;
      self.apos.push.browserCall('user', 'apos.create(?, ?)', self.__meta.name, options.browser);
    };


    self.createRoutes = function() {
      self.route('post', 'autocomplete', self.autocomplete);
    };

    self.autocomplete = function(req, res) {
      var term = self.apos.launder.string(req.body.term);
      return self.apos.docs.autocomplete(req, { field: { withType: 'apostrophe-page'}, term: term, withSlug: true }, function(err, response) {
        if (err) {
          res.statusCode = 500;
          return res.send('error');
        }
        response = _.map(response, function(item) {
          item.label = item.label + ' <em>' + item._url + '</em>';
          return item;
        });

        return res.send(
          JSON.stringify(response)
        );
      });
    };
  }
}
