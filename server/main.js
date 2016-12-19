import {Meteor} from 'meteor/meteor';
import {sAlert} from 'meteor/juliancwirko:s-alert';

import {secure} from './secure';
import {configure} from './configure'

Meteor.startup(function () {
    return Meteor.isServer ?

        [
            configure(),
            secure(),


        ] : sAlert.config({
        position: 'bottom-right',
        timeout: 5000,
        html: false,
        onRouteClose: false,
        stack: true,

        offset: 10, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,

    })

});
