import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

Template.body.helpers({
    favicon()  {
        return Meteor.absoluteUrl() + 'favicon-32x32.png';
    }
});

import '../imports/startup/client';
import '../imports/startup/both';
import '../imports/ui/stylesheets';
import '../imports/ui/components/index'