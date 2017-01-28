import {Meteor} from 'meteor/meteor';
import {Router} from 'meteor/iron:router';
import {throwError} from '../both/helpers';


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: '404'
});

Iron.Router.hooks.unSignedHookFunction = function () {
    if (!Meteor.userId()) {
        this.render('unsigned');
        Router.go('/');
        this.render('home');
        setTimeout(function () {
            throwError('sign in', 'why not to sign in?');
        }, 1);       //без затримки помилку не рендерить (чи рендерить, але на попередній шаблон що відноситься до клацнутого лінку  ??)
    } else this.next()
};
Router.onBeforeAction('unSignedHookFunction', {
    except: ['about', 'home']
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
        $(document).ready(function () {
            $('input:radio:checked').addClass('check');
        })
    }, {
        name: 'event',
        waitOn(){
            return [this.subscribe('event', this.params.url),
                this.subscribe('groups'), this.subscribe('items'), this.subscribe('users')]
        }
    }
);
Router.route('/events/:url/edit', {
    name: 'eventEdit',
    template: 'eventEdit',
    waitOn(){
        return [this.subscribe('event', this.params.url),
            this.subscribe('users'), this.subscribe('groups')];
    }
});

Router.route('/account', {
    name: 'account',
    template: 'account',
    waitOn(){
        return [this.subscribe('account'),
            this.subscribe('items'), this.subscribe('groups'), this.subscribe('events')]
    }
});