const RequestShortener = require('webpack/lib/RequestShortener');

const requestShortener = new RequestShortener(process.cwd());

module.exports = class StatFilterPlugin {
    //过滤指定loader 的 warning 和error
    constructor({ ignoreLoaders = [], warnings = false, errors = false } = {}) {
        this.ignoreLoaders = ignoreLoaders;
        this.warnings = warnings;
        this.errors = errors;
    }
    apply(compiler) {
        if (!this.ignoreLoaders.length) {
            return;
        }
        compiler.hooks.done.intercept({
            //拦截done.tap 把过滤后的stats传给 friendly-errors-webpack-plugin 中的tap
            register: (tapInfo) => {
                const fn = tapInfo.fn;
                tapInfo.fn = (stats) => {
                    if (this.errors && stats.hasErrors()) {
                        this.filterStats(stats, 'errors'); //过滤errors
                    }
                    if (this.warnings && stats.hasWarnings()) {
                        this.filterStats(stats, 'warnings'); //过滤warnings
                    }
                    return fn(stats);
                };
                return tapInfo;
            }
        });
    }

    filterStats(stats, type) {
        if (isMultiStats(stats)) {
            stats.stats.forEach((item) => {
                this.filterStats(item, type);
            });
            return;
        }
        stats.compilation[type] = filter(stats.compilation[type], this.ignoreLoaders);
    }
};

function filter(warnings = [], ignoreLoaders) {
    return warnings.filter((warning) => {
        const fileName = getFile(warning); //获取报错的文件名 和 处理它的loader
        return ignoreLoaders.every((loaderName) => fileName.indexOf(loaderName) === -1); //文件名中 是否含有忽略的loader名
    });
}

function getFile(e) {
    if (e.file) {
        return e.file;
    } else if (e.module && e.module.readableIdentifier && typeof e.module.readableIdentifier === 'function') {
        return e.module.readableIdentifier(requestShortener);
    }
}

function isMultiStats(stats) {
    return !!stats.stats;
}
