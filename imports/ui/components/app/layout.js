import {Template} from 'meteor/templating';

import './layout.html'

Template.layout.onRendered(function () {

    $(".mdl-layout__drawer-button").click(function () {

        $('.mdl-layout__drawer').show();
    });

    $(".links").click(function () {

        $('.mdl-layout__drawer').fadeOut('slow');

        $('.mdl-layout__obfuscator').trigger('click');
    });
    $('document').ready(function () {
        $('.login-close-text').trigger('click');
    });

});
Template.home.onRendered(function () {

    $('.mdl-layout__content').css('width','100%');
});

Template.home.onDestroyed(function () {
    $('.main').css('width', '');
});