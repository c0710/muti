const inquirer = require('inquirer');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = (options) => {
    function search(answers, input) {
        return new Promise(function(resolve) {
            resolve(options.filter((opt) => opt.toLowerCase().indexOf(input || '') > -1));
        });
    }

    return inquirer
        .prompt([
            {
                type: 'autocomplete',
                name: 'entry',
                message: 'Pick one or input!!!',
                source: search,
                pageSize: 5
            }
        ])
        .then((res) => [res.entry]);
};
