var i18n = require('i18n');

i18n.configure({
    locales:['en', 'ko', 'jp', 'cn'],
    directory:__dirname + '/locales',
    defaultLocale:'en',
    cookie:'lang',
});

module.exports = (req, res, next) => {

    let {lang} = req.query;

    lang = lang ? lang : 'ko';

    i18n.init(req, res);
    //res.local('__', res.__);
    res.locals.__ = res.__;

    var current_locale = i18n.getLocale();
    //i18n.setLocale(req, lang);

    return next();
}