
ownsDocument = (userId, doc) => {
    return doc && doc.owner == userId;
};


noRepeat = (collection, name) => {
    return collection.find(
            {name: name}
        ).count() === 0
};

thisUrl = () => {
    return document.URL.split('/').pop()
};

countdown = (end) => {

    var t = ((new Date(end) - new Date()) / 1000);//1000ms
    var count = new ReactiveCountdown(t);
    count.start();
    count.get();
    var s = Math.floor((t) % 60);
    var m = Math.floor((t / 60) % 60);
    var h = Math.floor((t / (60 * 60)) % 24);
    var d = Math.floor(t / (60 * 60 * 24));
    var result = ' ';
    if (d > 0) result += d + (d == 1 ? ' day ' : ' days');
    if (h > 0) result += h + (h == 1 ? ' hour ' : ' hours ');
    if (m > 0)result += m + (m == 1 ? ' minute ' : ' minutes ');
    if (s > 0) result += s + (s == 1 ? ' second ' : ' seconds ');
    if (s < 0) result = "event is expired";
    return result;
};