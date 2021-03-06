/**
 * @ignore
 * load tpl from file in nodejs
 * @author yiminghe@gmail.com
 */
KISSY.add(function (S, require) {
    /*global requireNode*/
    var fs = requireNode('fs');
    var XTemplate = require('xtemplate');
    var cached = {};

    /**
     * load xtemplate from file on nodejs
     * @class KISSY.XTemplate.Nodejs
     * @singleton
     */
    return  {
        /**
         * load xtemplate module on nodejs and return xtemplate instance
         * @param {String} moduleName xtemplate module name
         * @param config xtemplate config object
         * @param {String} [config.extname='html'] template file's extension name
         * @returns {KISSY.XTemplate} xtemplate instance
         */
        loadFromModuleName: function (moduleName, config) {
            config = config || {};
            config.extname = config.extname || 'html';
            var loader = getLoader(config);
            config.name = moduleName;
            config.loader = loader;
            var tpl = loader(moduleName);
            delete config.extname;
            return new XTemplate(tpl, config);
        }
    };

    function getLoader(cfg) {
        // cache also means cacheFile on server side
        var cacheFile = cfg.cache;
        var extname = cfg.extname;
        return function (subTplName) {
            if (cacheFile && cached[subTplName]) {
                return cached[subTplName];
            }
            var module = new S.Loader.Module({
                name: subTplName,
                type: extname,
                runtime: S
            });
            var tpl = fs.readFileSync(new S.Uri(module.getPath()).getPath(), {
                encoding: 'utf-8'
            });
            if (cacheFile) {
                cached[subTplName] = tpl;
            }
            return tpl;
        };
    }
});