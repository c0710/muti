const inquirer = require('../utils/inquirer');
const { info } = require('@vue/cli-shared-utils');

module.exports = async function selectModule(pages, defaultAlias) {
    if (defaultAlias.length === 1 && defaultAlias[0] === 'all') {
        //全部打包
        return pages;
    }
    if (!defaultAlias.length) {
        defaultAlias = await inquirer(pages.map(({ name }) => name));
    }
    return defaultAlias
        .map((alias) => alias.replace('_', '/'))
        .reduce((res, alias) => {
            const suits = pages.filter(({ name }) => name === alias || name.startsWith(`${alias}/`));
            if (!suits.length) {
                info(alias, '没找到');
                process.exit();
            }
            return res.concat(suits);
        }, []);
};
