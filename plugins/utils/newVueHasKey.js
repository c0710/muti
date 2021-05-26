const babelParser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const t = require('@babel/types');
const fs = require('fs');

module.exports = (filePath, name) => {
    const fileInfo = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const ast = babelParser.parse(fileInfo, {
        sourceType: 'module'
    });

    return has(ast, name);
};

function has(ast, name) {
    let resBol = false;
    try {
        traverse(ast, {
            NewExpression(path) {
                if (path.node.callee.name === 'Vue') {
                    //找到 new Vue
                    const objExp = path.node.arguments[0]; //取new Vue()的第一个参数
                    if (t.isObjectExpression(objExp)) {
                        resBol = objExp.properties.some((item) => item.key.name === name); //对象的某一个属性全等于name返回true
                    }
                }
            }
        });
    } catch (e) {
        return resBol;
    }
    return resBol;
}
