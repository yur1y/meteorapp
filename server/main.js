import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';

import {secure} from './secure';
import {configure} from './configure'

Meteor.startup(function () {
    return Meteor.isServer ?
        [
            configure(),
            secure(),
        ]
        : null
});
