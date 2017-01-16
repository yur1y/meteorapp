import {BrowserPolicy} from 'meteor/browser-policy-common';

export let secure = () => {
    BrowserPolicy.framing.disallow();
    BrowserPolicy.content.disallowInlineScripts();
    BrowserPolicy.content.disallowEval();
    BrowserPolicy.content.allowInlineStyles();
    BrowserPolicy.content.allowFontDataUrl();

    let trusted = [
        'www.google.com.ua',
        '*.github.io',          //some nice urls
        'pp.vk.me',
        '*.googleusercontent.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'getmdl.io',
        'webassets.mongodb.com',
        'cdn-images-1.medium.com',
        'https://mquandalle.gitbooks.io/apprendre-meteor/content/img/atmosphere.png'
    ];

    trusted.forEach((x) =>BrowserPolicy.content.allowOriginForAll(x))
};