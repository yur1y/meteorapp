import {Meteor} from 'meteor/meteor';
import {Router} from 'meteor/iron:router';
import {throwError} from '../lib/helpers';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: '404'
});

Router.onBeforeAction(function () {

    return  !Meteor.userId() && ['about','home'].indexOf(Router.current().route.getName())==-1   ?
        [
         this.render('unsigned'),
           throwError('sign in','why not to sign in?'),
        setTimeout(() => {
            this.render('home');
            Router.go('/');
        }, 2000)
        ]:
         this.next();
});

Router.route('/about', {
    template: 'about',
    name: 'about'
});

Router.route('/', {
    template: 'home',
    name: 'home'
});
Router.route('/groups', {
    template: 'groups',
    waitOn () {
        return [
            this.subscribe('groups'), this.subscribe('items')
        ]
    }
});
Router.route('/groups/:url', function () {
    this.render('group');

}, {
    name: 'group',
    waitOn(){
        return [this.subscribe('group', this.params.url),
            this.subscribe('items', this.params.url),
            this.subscribe('users')
        ]
    }
});
Router.route('/groups/:url/edit', function () {
    this.render('groupEdit');
}, {
    name: 'groupEdit',
    waitOn(){
        return [this.subscribe('group', this.params.url),
            this.subscribe('users')];
    }
});

Router.route('/events', {
    template: 'events',
    name: 'events',
    waitOn(){
        return this.subscribe('events');
    }
});

Router.route('/events/:url', function () {

    this.render('event');
    // this.render('itemsData', {to: 'below'});
}, {
    name: 'event',
    waitOn(){
        return [this.subscribe('event', this.params.url),
            this.subscribe('groups')
            // this.subscribe('users')
        ]
    }
});
Router.route('/events/:url/edit', {
    name: 'eventEdit',
    template: 'eventEdit',
    waitOn(){
        return [this.subscribe('event', this.params.url),
            this.subscribe('users'), this.subscribe('groups')];
    }
});

Router.route('/account',{
    name:'account',
    template : 'account',
    waitOn(){
        return [this.subscribe('account'),
        this.subscribe('items')]
    }
});