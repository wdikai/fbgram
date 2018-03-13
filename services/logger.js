class Logger {
    constructor(name) {
        this.name = name || '';
    }

    info(...args) {
        console.info(`INFO [${this.name.toUpperCase()}]~~~~~~~~~`);
        args.forEach(arg => console.info(format(arg)));
        console.info(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
    }

    error(...args) {
        console.error(`ERROR [${this.name.toUpperCase()}]~~~~~~~~~`);
        args.forEach(arg => console.error(format(arg)));
        console.error(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
    }
}

function format (value) {
    if(value instanceof Error) {
        return [value.message, `status: ${value.status}`, value.stack];
    }

    if(value instanceof Object) {
        return Object.keys(value).map(key => `${key} = ${JSON.stringify(value[key])}`).join(' ');
    }

    return JSON.stringify(value);
}

module.exports = Logger;