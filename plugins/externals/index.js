const newVueHasKey = require('../utils/newVueHasKey');
const isProduction = process.env.NODE_ENV === 'production';

const externals = [
    //todo 根据是否引入的第三方库判断
    {
        quote: {
            vue: 'Vue'
        },
        path: isProduction ? '/static/js/vue.runtime.min.js' : '/static/js/vue.runtime.js',
        match() {
            return true;
        }
    },
    {
        quote: {
            'vue-router': 'VueRouter'
        },
        path: '/static/js/vue-router.min.js',
        match(entry) {
            return newVueHasKey(entry, 'router');
        }
    },
    {
        quote: {
            vuex: 'Vuex'
        },
        path: '/static/js/vuex.min.js',
        match(entry) {
            return newVueHasKey(entry, 'store');
        }
    }
];

module.exports = (api, options) => {
    // console.log('~~~');
    // console.log(options.pages);
    if (options.pages) {
        Object.values(options.pages).forEach((page) => {
            page.externalJs = externals.filter(({ match }) => match(page.entry)).map(({ path }) => path);
        });
    }
    api.configureWebpack(() => {
        return {
            externals: externals.reduce((res, item) => {
                return Object.assign({}, res, item.quote);
            }, {})
        };
    });
};
