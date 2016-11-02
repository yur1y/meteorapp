import {Meteor} from 'meteor/meteor';
import {UploadFS} from 'meteor/jalik:ufs'
import {Items, ItemStore} from '../../../api/items'
if (Meteor.isClient) {


    Template.itemsData.events({

        'click [name=upload]'(e)  {
            e.preventDefault();

            let name = document.getElementsByName('item')[0].value;
            let price = document.getElementsByName('item')[1].value;
            let amount = document.getElementsByName('item')[2].value;

            Meteor.call('items.insert',name,price,amount);

                document.getElementsByName('item')[0].value = '';
                document.getElementsByName('item')[1].value = '';
                document.getElementsByName('item')[2].value = '';
            },
        'click [name=delete]'(e) {
            e.preventDefault();
           Meteor.call('items.delete',this._id);
        },
        'click [name=edit]'(ev){
            ev.preventDefault();
            let name = document.getElementsByName('edit')[0].value;
            let price = document.getElementsByName('edit')[1].value;
            let amount = document.getElementsByName('edit')[2].value;
        }
    });

    Template.itemsData.helpers({
        files() {
            return Items.find({price:{$not:'logo'}}, {
                sort: {createdAt: 1, name: 1}
            });
        },
        isOwner() {

            return Meteor.userId() === this.owner || !this.userId;
        }
    });
}