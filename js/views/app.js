define([
	'jquery',
	'underscore',
	'backbone',
	'collections/contact',
	'views/contact',
	'text!templates/contact.html'
], function ($, _, Backbone, ContactsCollection, ContactView, contactTemplate) {
	
	var AppView = Backbone.View.extend({
		el: $("#contacts"),
		events: {
			"change #filter select": "setFilter",
			"click #add": "addContact",
			"click #showForm": "showForm"
		},

		initialize: function () {
			this.render();
			this.$el.find("#filter").append(this.createSelect());
			this.on("change:filterType", this.filterByType, this);
			ContactsCollection.on("reset", this.render, this);
			ContactsCollection.on("add", this.renderContact, this);
			ContactsCollection.on("remove", this.removeContact, this);
		},

		render: function () {
			this.$el.find("article").remove();

			_.each(ContactsCollection.models, function (item) {
				this.renderContact(item);
			}, this);
		},

		renderContact: function (item) {
			var contactView = new ContactView({
				model: item
			});
			this.$el.append(contactView.render().el);
		},

		getTypes: function () {
			return _.uniq(ContactsCollection.pluck("type"), false, function (type) {
				return type.toLowerCase();
			});
		},

		createSelect: function () {
			var filter = this.$el.find("#filter"),
				select = $("<select/>", {
					html: "<option>All</option>"
				});

			_.each(this.getTypes(), function (item) {
				var option = $("<option/>", {
					value: item,
					text: item
				}).appendTo(select);
			});
			return select;
		},

		setFilter: function (e) {
			this.filterType = e.currentTarget.value;
			this.trigger("change:filterType");
		},

		filterByType: function () {
			if (this.filterType === "All") {
				ContactsCollection.reset(contacts);

				contactsRouter.navigate("filter/all");

			} else {
				ContactsCollection.reset(contacts, { silent: true });

				var filterType = this.filterType,
					filtered = _.filter(ContactsCollection.models, function (item) {
						return item.get("type").toLowerCase() === filterType;
					});

				ContactsCollection.reset(filtered);

				contactsRouter.navigate("filter/" + filterType);
			}
		},

		addContact: function (e) {
			e.preventDefault();

			var formData = {};
			$("#addContact").children("input").each(function (i, el) {
				if ($(el).val() !== "") {
					formData[el.id] = $(el).val();
				}
			});

			contacts.push(formData);

			if (_.indexOf(this.getTypes(), formData.type) === -1) {
				ContactsCollection.add(new Contact(formData));
				this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
			} else {
				ContactsCollection.add(new Contact(formData));
			}
		},

		removeContact: function (removedModel) {
			var removed = removedModel.attributes;

			if (removed.photo === "img/placeholder.png") {
				delete removed.photo;
			}

			_.each(contacts, function (contact) {
				if (_.isEqual(contact, removed)) {
					contacts.splice(_.indexOf(contacts, contact), 1);
				}
			});
		},

		showForm: function () {
			this.$el.find("#addContact").slideToggle();
		}
	});

	return AppView;

});