define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/contact.html',
	'text!templates/edit.html'
], function ($, _, Backbone, contactTemplate, editTemplate) {
	var ContactView = Backbone.View.extend({
		tagName: "article",
		className: "contact-container",
		template: _.template(contactTemplate),
		editTemplate: _.template(editTemplate),
		events: {
			"click button.delete": "deleteContact",
			"click button.edit": "editContact",
			"change select.type": "addType",
			"click button.save": "saveEdits",
			"click button.cancel": "cancelEdit"
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		deleteContact: function () {
			var removedType = this.model.get("type").toLowerCase();

			this.model.destroy();

			this.remove();

			if (_.indexOf(directory.getTypes(), removedType) === -1) {
				directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
			}
		},

		editContact: function () {
			this.$el.html(this.editTemplate(this.model.toJSON()));

			var newOpt = $("<option/>", {
				html: "<em>Add new...</em>",
				value: "addType"
			});

			this.select = directory.createSelect()
									.addClass("type")
									.val(this.$el.find("#type").val())
									.append(newOpt)
									.insertAfter(this.$el.find(".name"));

			this.$el.find("input[type='hidden']").remove();
		},

		addType: function () {
			if (this.select.val() === "addType") {
				this.select.remove();

				$("<input />", {
					"class": "type"
				}).insertAfter(this.$el.find(".name")).focus();
			}
		},

		saveEdits: function (e) {
			e.preventDefault();

			var formData = {},
				prev = this.model.previousAttributes();

			$(e.target).closest("form").find(":input").not("button").each(function () {
				var el = $(this);
				formData[el.attr("class")] = el.val();
			});

			if (formData.photo === "") {
				delete formData.photo;
			}

			this.model.set(formData);

			this.render();

			if (prev.photo === "img/placeholder.png") {
				delete prev.photo;
			}

			_.each(contacts, function (contact) {
				if (_.isEqual(contact, prev)) {
					contacts.splice(_.indexOf(contacts, contact), 1, formData);
				}
			});
		},

		cancelEdit: function () {
			this.render();
		}
	});

	return ContactView;
});