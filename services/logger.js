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
        return [value.message, value.stack].join('\n');
    }

    if(value instanceof Object) {
        return Object.keys(value).map(key => `${key} = ${value[key]}`).join(' ');
    }

    return value;
}

module.export = Logger;