 import {Router} from 'meteor/iron:router';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: '404'
});

 Router.onBeforeAction(function () {

     if(!Meteor.userId() && Router.current().route.getName() != 'about'){
         this.render('home');
         Router.go('/');
     }else{
         this.next();
     }
 });
Router.route('/about',{
    template:'about',
    name:'about'
});

Router.route('/', {
    template: 'home',
    name: 'home'
});
Router.route('/groups',{
    template: 'groups',
    waitOn () {
        return [
            this.subscribe('groups'),this.subscribe('items')
        ]
    }
});
Router.route('/groups/:url', function () {
    this.render('group');
    // this.render('itemsData', {to: 'below'});
}, {
    name: 'group',
    waitOn(){
        return [this.subscribe('group', this.params.url),
            this.subscribe('items', this.params.url),
            this.subscribe('users')
        ]
    }
});
Router.route('/groups/:url/edit',function () {
    this.render('groupEdit');
},{
    name: 'groupEdit',
    waitOn(){
        return [this.subscribe('group', this.params.url),
            this.subscribe('users')];
    }
});
Router.route('/users', {
    template: 'users',
    waitOn(){
        return this.subscribe('users');
    }
});

Router.route('/events',{
    template:'events',
    name:'events',
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
            this.subscribe('users'),this.subscribe('groups')];
    }
});