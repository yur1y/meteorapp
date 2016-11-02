Accounts.onCreateUser(function (options, user) {
    if (options.profile) {
        user.profile = options.profile;
    }
    if( user.services.google){
        Meteor.call('users.onRegister', user.services.google.email
            //          path to the users email in their profile
        );
    }
    if (user.services.vk) {
        Meteor.call('users.onRegister', user.services.vk.email);
    }
    user.groups = [];
    user.items = [];

    return user;
});
Meteor.methods({
    'users.Addgroup'(userId, groupId){
        return [Meteor.users.update({_id: userId}, {$addToSet: {groups: groupId}}),
            Groups.update({_id: groupId}, {$addToSet: {users: userId}})    ]
    },
    'users.Removegroup'(userId, groupId){
        return [ Meteor.users.update({_id: userId}, {$pull: {groups: groupId}}),
            Groups.update({_id: groupId}, {$pull: {users: userId}})]
    },
    'users.onRegister'(to) {
        SSR.compileTemplate('htmlEmail',Assets.getText('invitation.html'));

        //  email sending method
        Email.send({
            to: to,
            from: 'admin@meteorapp.com',
            subject: 'Hello from Meteor... App!',
            // text: 'Thank you for registration,meet me...Somewhere  ! .'
            html:SSR.render('htmlEmail')
        })
    }
});