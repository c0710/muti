const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const CatalogPage = {
    name: '___catalog',
    entry: path.resolve(__dirname, '../catalog/main.js'),
    filename: `index.html`
}; //目录页面

module.exports = (api, options) => {
    if (isProduction) {
        return;
    }
    if (options.pages) {
        api.chainWebpack((webpackConfig) => {
            const pages = Object.entries(options.pages)
                .reduce((res, [key, value]) => {
                    return [].concat(res, {
                        name: key,
                        ...value
                    });
                }, [])
                .filter((item) => item.name !== CatalogPage.name);
            webpackConfig.plugin('define').tap((options) => {
                options[0] = {
                    ...options[0],
                    'process.pages': JSON.stringify(pages)
                };
                return options;
            }); //给catalog用
        });
        options.pages = Object.assign({}, options.pages, {
            [CatalogPage.name]: {
                entry: CatalogPage.entry,
                filename: CatalogPage.filename
            }
        });
    }
};

module.exports.defaultModes = {
    'muti-dev': 'development'
};
