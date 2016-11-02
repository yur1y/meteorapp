ownsDocument = (userId, doc) => {
    return doc && doc.owner == userId;
};


noRepeat = (collection, name) => {
    return collection.find(
            {name: name}
        ).count() === 0
};

thisUrl = () =>{
   return document.URL.split('/').pop()
};