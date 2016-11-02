Template.users.helpers({
    users(){
        return Meteor.users.find({$or:[{
            'services.google.picture':{$exists:true}
        },{'services.vk.photo_big':{$exists:true}}]});
    },
    onlineUsers(){
       return Meteor.users.find({'status.online':true})
    }
});