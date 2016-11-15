import {UploadFS} from 'meteor/jalik:ufs';
import {Mongo} from 'meteor/mongo';

export const Items = new Mongo.Collection('items');

Items.allow({
    insert: function (userId, file) {
        return Meteor.userId();
    },
    remove: function (userId, file) {
        return true
    },
    update: function (userId, file, fields, mod) {
        return true;
    }
});

if (Meteor.isServer) {
    export const ItemStore = new UploadFS.store.GridFS({

        collection: Items,
        name: 'items',
        chunkSize: 1024 * 255,
        filter: new UploadFS.Filter({
            minSize: 1,
            maxSize: 1024 * 1000,
            contentTypes: ['image/*']
        }),
        permissions: new UploadFS.StorePermissions({
            insert: function (userId, file) {
                return Meteor.userId()
            },
            remove: function (userId, file) {
                return true;
            },
            update: function (userId, file) {
                return true;
            }
        }),
        simulateWriteDelay: 0
    });
}
    Meteor.methods({
        'items.insert'(url, name, price, amount){
            if (Meteor.isClient) {    ///errors 500, not defined isClient && meteor dont like mongo cursors
                UploadFS.selectFile(function (file) {
                    let info = {
                        name: file.name,
                        size: file.size,
                        createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                        owner: Meteor.userId(),
                        itemUrl: url,
                    };
                    if (amount) {
                        info.itemName = name;
                        info.price = price;
                        info.amount = amount;
                    }
                    const ONE_MB = 1024 * 1024;
                    let uploader = new UploadFS.Uploader({
                        adaptive: true,
                        chunkSize: ONE_MB,
                        maxChunkSize: ONE_MB * 2,
                        data: file,
                        file: info,
                        store: ItemStore || 'items',
                        maxTries: 3,
                        maxSize: ONE_MB,
                        onComplete(file) {
                            if (!file.itemName) {  //logo
                                Meteor.call('items.remove',price); ///actually old logo url ??
                                Meteor.call('groups.newLogo', name, file.url);  //new one
                            }
                        },
                    });
                    uploader.start();
                });
            }
        },
        'items.remove'(filter) {
            return Items.remove({$or: [{_id: filter}, {itemUrl: filter}, {url: filter}]});
        }
    });