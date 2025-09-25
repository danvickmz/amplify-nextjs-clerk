// copy-files.js
const fs = require('fs-extra');
const path = require('path');

const source = path.join(__dirname, 'start-server.sh');
const destination = path.join(__dirname, '.next', 'start-server.sh');

fs.copy(source, destination)
    .then(() => console.log('Successfully copied start-server.sh'))
    .catch(err => console.error(err));
