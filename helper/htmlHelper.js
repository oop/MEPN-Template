let translation = require('../public/statics/translate.json');

module.exports = {
    "ifCond": (v1, operator, v2, options) => {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },
    "partial": (partial, context) => {
        if (global.handlebars.partials[partial]) return global.handlebars.partials[partial](context, {helpers: global.htmlHelpers});
        else return partial + " partial not found.";
    },
    "json": (object) => {
        return JSON.stringify(object);
    },
    "select": (selected, options) => {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },
    "translate": (text, lang) => {
        if(translation) {
            let data = translation[text][lang];
            if(typeof data == 'undefined') data = translation[text]['en'];
            return data;
        } else {
            return null;
        }
    },
    "getTranslations": (lang) => {
        if(translation) {
            let relatedLang = {};
            Object.entries(translation).forEach(
                ([key, value]) => {
                    if(value[lang]) relatedLang[key] = value[lang];
                }
            );
            return JSON.stringify(relatedLang);
        } else {
            return null;
        }
    },
    "assetImg": (name, extension, location) => {
        if(typeof name == 'string') {
            return '/assets/' + location + '/img/' + name.replace('/', '') + '.' + extension
        }
    }
};