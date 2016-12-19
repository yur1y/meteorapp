import {Meteor} from 'meteor/meteor';
import {UploadFS} from 'meteor/jalik:ufs';
import {Mongo} from 'meteor/mongo';

import {throwError} from '../lib/helpers';

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
            onCheck(file){
                return (file.size < 1 || file.size > 1024 * 1000)
                    ? throwError('file-size', 'file size is bigger then 1MB') :

                    ['png', 'jpg', 'jpeg', 'gif', 'bmp'].indexOf(file.extension) == -1
                        ? throwError('file', 'file is not an image') : true
            }
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
        'items.insert': (url, name, cash, amount) =>
            Meteor.isClient ?
                UploadFS.selectFile(function (file) {
                    let info = {
                        name: file.name,
                        size: file.size,
                        createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                        owner: Meteor.userId(),
                        itemUrl: url
                    };
                    if (amount) {
                        info.itemName = name;
                        info.amount = amount;
                        info.cash = cash;
                        info.coupons = null;
                        info.wish = [];
                        // info.cart = {user: null, amount: null, cash: null, coupons: null, total: null}; //
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
                            return !file.itemName ? [
                                Meteor.call('items.remove', cash),
                                Meteor.call('groups.newLogo', name, file.url),
                                Meteor.call('ok', 'logo changed')
                            ] : Meteor.call('ok', 'item ' + file.itemName + ' created');

                        },
                        onError(err){
                            return err ? throwError(err.err, err.reason) : null
                        }
                    });
                    uploader.start();
                }) : null,

        'items.remove': (filter) =>
            Items.remove({$or: [{_id: filter}, {itemUrl: filter}, {url: filter}]}),

        'items.update': (id, name, cash, amount, coupons) =>
            Items.update({_id: id}, {$set: {itemName: name, cash: cash, amount: amount, coupons: coupons}})
        ,
        'items.wish': (itemId, userId) =>

            !Items.find({_id: itemId, wish: userId}).count() ?

                Items.update({_id: itemId}, {$addToSet: {wish: userId}}) : //wish

                Items.update({_id: itemId}, {$pull: {wish: userId}}), //un-wish

        'items.inCart': (itemId, userId, amount) =>
            Items.find({
                _id: itemId,
                'cart.user': userId,
            }).count() == 0 ?
                Items.update({_id: itemId}, {  //item added first time by user
                    $push: {
                        cart: {
                            user: userId,
                            amount: amount
                        }
                    }
                }) : Items.find({
                    _id: itemId,
                    'cart.user': userId,
                    'cart.amount':amount
                }).count() == 0?
                Items.update({                    //item is already in cart, but user change amount
                        _id: itemId,
                        'cart.user': userId,
                    }, {
                        $set: {'cart.$.amount': amount}
                    }
                ):
                    Items.update({                    //item is already in cart, so increment it
                            _id: itemId,
                            'cart.user': userId,
                        }, {
                            $inc: {'cart.$.amount':1}
                        }
                    ),

        'items.outCart': (itemId, userId) =>
            Items.update({_id: itemId}, {$pull: {cart: {user: userId}}}),

        'items.preOrder': (itemId, userId, amount, cash, coupons) =>
            Items.update({_id: itemId}, {
                $addToSet: {
                    cart: [{
                        user: userId,
                        amount: amount,
                        cash: cash,         //cash cost
                        coupons: coupons,   //  coupons cost
                    }]
                }
            })
    }
);