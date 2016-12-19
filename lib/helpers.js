import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';

export let ownsDocument = (userId, doc) => doc.owner == userId;

export let noRepeat = (data, name, oldName) =>
data.find({name: name}).count() === 0 || name === oldName;
// export let thisUrl = ()=> document.URL.split('/').pop();

export let noLogo = () => 'http://localhost:3000/no-image.jpg';

export let throwError = (err, reason) => {
    if (Meteor.isServer) {           //no @#%$! in console
        throw new Meteor.Error(err, reason)
    } else sAlert.error(reason);
};

Meteor.methods({
    'ok'(text){
        Meteor.isClient?
        sAlert.success(text):null
    }

});