const glob = require('glob');
const path = require('path');

/*获取 目录PAGES_PATH 下所有的main.js*/
module.exports = (PAGES_PATH) => {
    const pages = [];
    glob.sync(PAGES_PATH + '/**/main.js').forEach((filepath) => {
        const pageName = path.dirname(path.relative(PAGES_PATH, filepath)).replace(/\\/, '/');
        pages.push({
            name: pageName,
            entry: filepath,
            filename: `${pageName}/index.html`
        });
    });
    return pages;
};
