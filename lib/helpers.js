export let ownsDocument = (userId, doc) => doc.owner == userId;

export let noRepeat = (data, name,oldName) =>
    data.find({name: name}).count() === 0 || name ===oldName;

// export let thisUrl = ()=> document.URL.split('/').pop();

export let noLogo = () => 'http://localhost:3000/no-image.jpg';