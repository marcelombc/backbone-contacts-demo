require.config({
	paths: {
		'jquery': 'libs/jquery/jquery-1.7.2',
		'underscore': 'libs/underscore/underscore',
		'backbone': 'libs/backbone/backbone',
		'templates': '../templates',
		'text': 'libs/amd/plugins/text'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});

require([
	'views/app',
	'router/router'
], function (AppView, AppRouter) {
	// Initialize routing and start Backbone.history()
	new AppRouter();
	Backbone.history.start();
	
	// Initialize the application view
	new AppView();
});