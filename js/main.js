require.config({
	paths: {
		'jquery': "libs/jquery/jquery-1.7.2",
		'underscore': "libs/underscore/underscore",
		'backbone': "libs/backbone/backbone"
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	}
});

require([
	'app'
], function (App) {

	App.initialize();
	
});