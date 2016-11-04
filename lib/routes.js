Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: '404'
});

Router.route('/about');

Router.route('/', {
    template: 'home',
    name: 'home'
});
Router.route('/groups',{
    template: 'groups',
    waitOn () {
        return [
            Meteor.subscribe('groups'),Meteor.subscribe('items')
        ]
    }
});
Router.route('/groups/:url', function () {
    this.render('logo', {to: 'aside'});
    this.render('group');
    Session.set('current_url',this.params.url);
    // this.render('itemsData', {to: 'below'});
}, {
    name: 'group',
    waitOn(){
        return [Meteor.subscribe('group', this.params.url),
            Meteor.subscribe('items', this.params.url),
            // Meteor.subscribe('logo'),
            Meteor.subscribe('users')
        ]
    }
});
Router.route('/groups/:url/edit',function () {
    Session.set('current_url',this.params.url);
    this.render('groupEdit');
},{
    name: 'groupEdit',
    waitOn(){
        return [Meteor.subscribe('group', this.params.url),
                 Meteor.subscribe('users')];
    }
});
Router.route('/users', {
    template: 'users',
    waitOn(){
        return Meteor.subscribe('users');
    }
});

Router.route('/events',{
    template:'events',
    name:'events',
    waitOn(){
        return Meteor.subscribe('events');
    }
});

//
Router.route('/events/:url', function () {

    this.render('event');
    // this.render('itemsData', {to: 'below'});
}, {
    name: 'event',
    waitOn(){
        return [Meteor.subscribe('event', this.params.url),
            // Meteor.subscribe('items', this.params.url),
            // Meteor.subscribe('logo'),
            // Meteor.subscribe('users')
        ]
    }
});
Router.route('/events/:url/edit', {
    name: 'eventEdit',
    template: 'eventEdit',
    waitOn(){
        return [Meteor.subscribe('event', this.params.url),
            Meteor.subscribe('users')];
    }
});