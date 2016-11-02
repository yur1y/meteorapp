import {UploadFS} from 'meteor/jalik:ufs';


export const Items = new Mongo.Collection('items');

Items.allow({
    insert: function (userId, file) {
        return true;
    },
    remove: function (userId, file) {
        return true;
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
                return Meteor.userId()
            },
            update: function (userId, file) {
                return !file.userId || userId === file.userId;
            }
        }),
        onRead (fileId, file, req, res) {
            // Deny access if file is private and token is not valid
            if (file.userId && (file.token !== req.query.token)) {
                res.writeHead(403, {"Content-Type": 'text/plain'});
                res.end('Forbidden');
                return false;
            }
        },
        simulateWriteDelay: 0,

    });

// Add custom MIME types
    UploadFS.addMimeType('kml', 'application/vnd.google-earth.kml+xml');
    UploadFS.addMimeType('kmz', 'application/vnd.google-earth.kmz');
}

Meteor.methods({
    'items.insert'(name, price, amount){

        if (price === 'logo') {
            Items.find({
                $and: [
                    {itemUrl: Session.get('current_url')},
                    {price: 'logo'}]
            }).forEach((item)=> {
                Items.remove({_id: item._id});
            })
        }

        UploadFS.selectFile(function (file) {

            let info = {
                name: file.name,
                size: file.size,
                itemName: name,
                price: price,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                owner: Meteor.userId(),
                itemUrl: Session.get('current_url'),
                amount: amount
            };
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
        });
    },
    'items.delete'(filter) {
        return Items.remove(filter);
    }
});