Template.groups.events({

    'submit .new-group'(e){
        e.preventDefault();


        const name = e.target.name.value;
        Meteor.call('groups.insert', name);
        e.target.name.value = '';
    }
});

Template.groups.helpers({
    groups(){
        return Groups.find({});
    },
    // grouplogo(){
    //     return Items.find({$and:[
    //         {itemUrl:this.url},
    //         {price:'logo'}
    //     ]})
    // }

});