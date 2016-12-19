import {Template} from 'meteor/templating';

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

    // $('.mdl-layout--large-screen-only').click(function () {
    //     $('.mdl-layout--large-screen-only').trigger('click');
    // })
   });