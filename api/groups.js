export const Groups = new Mongo.Collection('groups');

Meteor.methods({
    'groups.insert'(name){

        if (noRepeat(Groups, name)) //no  copies
        {
            Groups.insert({
                name: name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: this.userId,
                open: false,
                items: [],
                users: [],
                logo: noLogo()
            });

        } else {
            throw new Meteor.Error('group already exist');
        }
    },
    'groups.remove'(groupId, url){
        Meteor.call('items.remove', url);
        Meteor.users.update({}, {$pull: {groups: groupId}});
        Groups.remove(groupId);
        Router.go('/groups');
    },
    'groups.update'(id, name, open){

        Groups.update({_id: id}, {
            $set: {
                name: name,
                url: getSlug(name),
                open: open
            }
        });
        Router.go('/groups/' + this.url);
    },
    'groups.newLogo'(id, url){
        Groups.update({_id: id}, {$set: {logo: url}})
    }, 'groups.noLogo'(id){
    Groups.update({_id:id},{$set:{logo:noLogo()}});
    }

});

Groups.allow({
    insert () {
        return Meteor.userId();
    },
    update (userId, doc) {
        return ownsDocument(userId, doc);
    },
    remove (userId, doc) {
        return ownsDocument(userId, doc);
    }
});