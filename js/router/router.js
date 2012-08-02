define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {

	var AppRouter = Backbone.Router.extend({
		routes: {
			"filter/:type": "urlFilter"
		},

		urlFilter: function (type) {
			directory.filterType = type;
			directory.trigger("change:filterType");
		}
	});

	var initialize = function () {
		var appRouter = new AppRouter();
		Backbone.history.start();
	};

	return {
		initialize: initialize
	}
	
});