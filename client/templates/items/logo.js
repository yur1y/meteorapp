import{Items} from '../../../api/items';
Template.logo.helpers({
    logo(){
        return Items.find(
            {
                $and: [
                    {price: 'logo'},
                    {itemUrl: Session.get('current_url')}]
            }
        )
    }
});