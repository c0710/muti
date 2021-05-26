const fs = require('fs');
const path = require('path');
const { done } = require('@vue/cli-shared-utils');
const ftp = require('basic-ftp');

module.exports = async () => {
    if (fs.existsSync(path.resolve(process.cwd(), './dist/sourcemap'))) {
        const client = new ftp.Client();
        try {
            await client.access({
                host: '0.0.0.0',
                port: '21',
                user: 'xxx',
                password: 'xxx'
            });
            done('Upload sourcemap strat');
            await client.uploadFromDir(path.resolve(__dirname, '../../dist/sourcemap'), '/sourcemap');
            done('Upload sourcemap end');
        } catch (e) {
        } finally {
            client.close();
        }
    }
};
