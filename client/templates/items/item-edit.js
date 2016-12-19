import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

Template.itemEdit.events({

    'click .remove'(e) {
        e.preventDefault();

        document.querySelector('#update-' + this._id).close();

        Meteor.call('items.remove', this._id, function (err, res) {
            !err ? Meteor.call('ok', 'item deleted') : null
        });

    },
    'click .editItem'(e){
        e.preventDefault();

        let dialog = document.querySelector('#update-' + this._id);

        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialog.showModal();
    },
    'click .cancel'(e){
        e.preventDefault();
        let dialog = document.querySelector('#update-' + this._id);
        dialog.close();
    },
    'submit .update'(e){
        e.preventDefault();

        Meteor.call('items.update', this._id, e.target.name.value,
            Number(e.target.cash.value), Number(e.target.amount.value), Number(e.target.coupons.value));
        let dialog = document.querySelector('#update-' + this._id);
        dialog.close();
    }
});