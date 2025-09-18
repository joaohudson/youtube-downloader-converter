const languages = require('./lang/index.json');
const acceptLanguageParser = require('accept-language-parser');

class Translator{
    constructor(){
        this.dictionaries = {};
        for(const lang of languages){
            this.dictionaries[lang.name] = require('./lang/' + lang.path);
        }
    }

    getByRequest(req){
        return this.get(acceptLanguageParser.parse(req.headers['accept-language']));
    }

    get(langs){
        for(const {code} of langs){
            if(this.dictionaries[code]){
                return this.dictionaries[code];
            }
        }

        return this.dictionaries[languages[0].name];
    }
}

module.exports = {
    Translator
}