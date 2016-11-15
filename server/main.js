import {Meteor} from 'meteor/meteor';

import {secure} from './secure';
import {configure} from './configure'

if(Meteor.isServer) {
    Meteor.startup(() => {

        configure();
        secure();
    });
}