const execa = require('execa');
const queue = require('queue');
const fs = require('fs-extra');

const { info, error, done } = require('@vue/cli-shared-utils');
const getRepositoryModule = require('../utils/getRepositoryModule');
const selectModule = require('../utils/selectModule');
const uploadSourceMap = require('../utils/uploadSourceMap');

module.exports = (api, options) => {
    if (process.env.___buildPage) {
        const { filename, entry, name } = JSON.parse(process.env.___buildPage);
        options.pages = {
            app: {
                entry,
                filename
            }
        };
        options.assetsDir = name;
    }

    api.registerCommand('muti-build', async (args) => {
        const { pluginOptions: { 'muti-build': config = {} } = {} } = options;
        const modules = await selectModule(getRepositoryModule(config.sourceSrc), args._);
        await fs.remove(api.resolve(options.outputDir));
        buildModules(modules, config);
    });
};

function buildModules(modules, config) {
    const len = modules.length;
    const q = queue({
        concurrency: config.concurrency,
        autostart: true
    });
    let i = 0;
    const startTime = new Date().getTime();
    info(`Building start`);

    q.on('success', function() {
        info(`Building pending ${i++ + 1}/${len}`);
    });
    q.on('end', function() {
        const second = (new Date().getTime() - startTime) / 1000;
        info(`${Math.floor(second / 60)}分${Math.round(second % 60)}秒`);
        done(`Building end`);
        uploadSourceMap();
    });
    q.push(
        ...modules.map((module) => async (cb) => {
            await build(module, config);
            cb();
        })
    );
}

async function build(module, { modern = false, report = false, debug = false, concurrency }) {
    const map = {
        '--modern': modern,
        '--report': report,
        '--no-clean': true
    };
    const opts = Object.entries(map)
        .filter((item) => item[1])
        .map((item) => item[0]);
    return execa('vue-cli-service', ['build'].concat(opts), {
        stdio: concurrency === 1 ? 'inherit' : undefined,
        env: {
            ___buildPage: JSON.stringify(module),
            VUE_APP_DEBUG: debug
        }
    }).catch((err) => {
        error(err.stack);
        process.exit(0);
    });
}

module.exports.defaultModes = {
    'muti-build': 'production'
};
