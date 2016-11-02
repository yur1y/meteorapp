 Groups = new Mongo.Collection('groups');

Meteor.methods({
    'groups.insert'(name){

        if (noRepeat(Groups,name)) //no  copies
        {
            Groups.insert({
                name: name,
                createdAt: moment().format('MMMM Do YYYY, h:mm a'),
                url: getSlug(name),
                owner: this.userId,
                open: false,
                items:[],
                users:[]
            });

        } else {
            throw new Meteor.Error('group already exist');
        }
    },
    'groups.remove'(groupId){

        Meteor.users.update({},{$pull: {groups: groupId}});
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