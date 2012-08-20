define([
	'jquery',
	'backbone',
	'collections/contact'
], function ($, Backbone, Contact) {

	var AppRouter = Backbone.Router.extend({
		routes: {
			"filter/:type": "urlFilter"
		},

		urlFilter: function (type) {
			Contact.filterType = type;
			Contact.trigger("change:filterType");
		}
	});

	return AppRouter
	
});