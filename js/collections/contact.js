define([
	'backbone',
	'lib/backbone/localstorage',
	'models/contact'
], function (Backbone, Contact, Store) {
	var ContactsCollection = Backbone.Collection.extend({
		model: Contact

		//localStorage: new Store('contacts-backbone');
	});

	return new ContactsCollection();
});