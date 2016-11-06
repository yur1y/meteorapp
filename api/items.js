import {UploadFS} from 'meteor/jalik:ufs';

export const Items = new Mongo.Collection('items');

Items.allow({
    insert: function (userId, file) {
        return true;
    },
    remove: function (userId, file) {
        return !file.userId || userId === file.userId;
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
            contentTypes: ['image/*'],


        }),
        permissions: new UploadFS.StorePermissions({
            insert: function (userId, file) {
                return true;
            },
            remove: function (userId, file) {
                return !file.userId || userId === file.userId;
            },
            update: function (userId, file) {
                return true;
            }
        }),
        simulateWriteDelay: 0,
    });
}
Meteor.methods({
    'items.insert'(url, name, price, amount){

        if (!name && Items.find({       //count ,foreach , limit, are  cursor methods
                $and: [
                    {itemUrl: url},
                    {itemName: {$exists: false}},   //it can be only logo
                ]
            }).count() == 2) {
            Items.find({
                $and: [
                    {itemUrl: url},
                    {itemName: {$exists: false}},   //it can be only logo
                ]
            }, {sort: {createdAt: 1}}).forEach((item)=> { //old
                Items.remove({_id: item._id}).limit(1);//        logo remove
            });
        }

        UploadFS.selectFile(function (file) { ///

            let info = {
                name: file.name,
                size: file.size,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                owner: Meteor.userId(),
                itemUrl: url,
            };
            if (name) {
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
            });
            uploader.start();
            uploader.onComplete =function (file) {
                if(!file.itemName){  //logo
                    Meteor.call('groups.newLogo',Session.get('current_g'),file.url)
                }
            }
        });
    },
    'items.remove'(filter) {
        return Items.remove({$or: [{_id: filter}, {itemUrl: filter}]});
    }
});