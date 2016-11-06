import {Meteor} from 'meteor/meteor';
import {UploadFS} from 'meteor/jalik:ufs'
import {Items} from '../../../api/items'
if (Meteor.isClient) {


    Template.itemsData.events({

        'click [name=upload]'(e)  {
            e.preventDefault();
            let d = document;
            let name = d.getElementsByName('item')[0].value;
            let price = d.getElementsByName('item')[1].value;
            let amount = d.getElementsByName('item')[2].value;

            if (name && price && amount) {
                Meteor.call('items.insert', Session.get('current_url'), name, price, amount);
                d.getElementsByName('item')[0].value = '';
                d.getElementsByName('item')[1].value = '';
                d.getElementsByName('item')[2].value = '';
            }else{
                alert('Please fill all required fields')
            }
        },
        'click [name=delete]'(e) {
            e.preventDefault();
            Meteor.call('items.remove', this._id);
        },
        // 'click [name=edit]'(ev){
        //     ev.preventDefault();
        //     let name = document.getElementsByName('edit')[0].value;
        //     let price = document.getElementsByName('edit')[1].value;
        //     let amount = document.getElementsByName('edit')[2].value;
        // }
    });

    Template.itemsData.helpers({

        files() {
            return Items.find({price: {$exists: true}}, {
                sort: {createdAt: 1}
            });
        },
        isOwner() {

            return Meteor.userId() === this.owner || !this.userId;
        }
    });
}