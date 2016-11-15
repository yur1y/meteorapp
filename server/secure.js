import {BrowserPolicy} from 'meteor/browser-policy-common';

export let secure = () => {
    BrowserPolicy.framing.disallow();
    BrowserPolicy.content.disallowInlineScripts();
    BrowserPolicy.content.disallowEval();
    BrowserPolicy.content.allowInlineStyles();
    BrowserPolicy.content.allowFontDataUrl();

    var trusted = [
        '*.cloudfront.net',
        '*.github.io',          //some nice urls
        'pp.vk.me',
        '*.googleusercontent.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
    ];

    trusted.forEach((x) =>BrowserPolicy.content.allowOriginForAll(x))
};