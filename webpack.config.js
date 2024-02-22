const path = require('path');

module.exports = [
    {
        mode: 'development', 
        entry: './js/app.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        watch: true
    },
    {
        mode: 'development', 
        entry: './js/authenticator.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'mySiteBundle.js'
        },
        watch: true
    }
];
