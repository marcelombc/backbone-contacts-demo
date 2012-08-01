(function ($) {

	var contacts = [
		{ name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
	];

	var Contact = Backbone.Model.extend({
		defaults: {
			photo: "img/placeholder.png",
			name: "",
			address: "",
			tel: "",
			email: "",
			type: ""
		}
	});

	var Directory = Backbone.Collection.extend({
		model: Contact
	});

	var ContactView = Backbone.View.extend({
		tagName: "article",
		className: "contact-container",
		template: $("#contactTemplate").html(),
		events: {
			"click button.delete": "deleteContact",
			"click button.edit": "editContact",
			"change select.type": "addType",
			"click button.save": "saveEdits",
			"click button.cancel": "cancelEdit"
		},

		render: function () {
			var tmpl = _.template(this.template);

			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		},

		deleteContact: function () {
			var removedType = this.model.get("type").toLowerCase();

			this.model.destroy();

			this.remove();

			if (_.indexOf(directory.getTypes(), removedType) === -1) {
				directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
			}
		}
	});

	var DirectoryView = Backbone.View.extend({
		el: $("#contacts"),
		events: {
			"change #filter select": "setFilter",
			"click #add": "addContact",
			"click #showForm": "showForm"
		},

		initialize: function () {
			this.collection = new Directory(contacts);
			this.render();
			this.$el.find("#filter").append(this.createSelect());
			this.on("change:filterType", this.filterByType, this);
			this.collection.on("reset", this.render, this);
			this.collection.on("add", this.renderContact, this);
			this.collection.on("remove", this.removeContact, this);
		},

		render: function () {
			this.$el.find("article").remove();

			_.each(this.collection.models, function (item) {
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
			return _.uniq(this.collection.pluck("type"), false, function (type) {
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
				this.collection.reset(contacts);

				contactsRouter.navigate("filter/all");

			} else {
				this.collection.reset(contacts, { silent: true });

				var filterType = this.filterType,
					filtered = _.filter(this.collection.models, function (item) {
						return item.get("type").toLowerCase() === filterType;
					});

				this.collection.reset(filtered);

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
				this.collection.add(new Contact(formData));
				this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
			} else {
				this.collection.add(new Contact(formData));
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

	var ContactsRouter = Backbone.Router.extend({
		routes: {
			"filter/:type": "urlFilter"
		},

		urlFilter: function (type) {
			directory.filterType = type;
			directory.trigger("change:filterType");
		}
	});

	var directory = new DirectoryView();

	var contactsRouter = new ContactsRouter();

	Backbone.history.start();

}(jQuery));