define([
	'backbone',
	'libs/backbone/localstorage',
	'models/contact'
], function (Backbone, Store, Contact) {
	var ContactsCollection = Backbone.Collection.extend({
		model: Contact

		//localStorage: new Store('contacts-backbone');
	});

	return ContactsCollection;
});