define([
	'backbone'
], function (Backbone) {
	var ContactModel = Backbone.Model.extend({
		defaults: {
			photo: "../img/placeholder.png",
			name: "",
			address: "",
			tel: "",
			email: "",
			type: ""
		}
	});

	return ContactModel;
});