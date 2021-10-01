import createLogger from "./logger";

const browserLogger = (options) => {
    const { returnable = false, remoteURL, user = "Unset user", landingLogs = false, handleExceptions = false } = options || {};
    const Log = createLogger({ returnable, remoteURL });

    if (landingLogs) {
        let lastUrl = window.location.href;
        window.addEventListener('popstate', function (e) {
            if (window.location.href !== lastUrl) {
                const logObj = {
                    logInfo: {
                        component: null,
                        subComponent: null
                    },
                    event: {
                        name: e.type,
                        attributes: {
                            oldUrl: lastUrl,
                            newUrl: window.location.href
                        }
                    },
                    userInfo: user
                }
                Log.info(logObj);
                lastUrl = window.location.href;
            }
        });
    }

    if (handleExceptions) {
        window.addEventListener('error', function (event) {
            const logObj = {
                logInfo: {
                    component: null,
                    subComponent: null
                },
                event: {
                    name: event.type,
                    attributes: {
                        filename: event.filename,
                        message: event.message,
                        line: event.lineno,
                        colno: event.colno
                    }
                },
                error: {
                    name: event.error.name,
                    attributes: event.error.stack
                },
                userInfo: user
            }
            Log.error(logObj)
        })
    }

    let loggingObj = {}
    loggingObj['landing'] = (args) => {
        args.userInfo = user;
        let e = {};
        if (args.event !== undefined) {
            console.log(args.event)
            if (args.event.type !== undefined) {
                e.name = args.event.type;
                e.attributes = {};
                e.attributes.node = args.event.target.nodeName;
                e.attributes.innerText = args.event.target.innerText;
                args.event = e;
            }
        }
        return Log.info(args);
    }

    loggingObj['interaction'] = (args) => {
        args.userInfo = user;
        let e = {};
        if (args.event !== undefined) {
            console.log(args.event)
            if (args.event.type !== undefined) {
                e.name = args.event.type;
                e.attributes = {};
                e.attributes.node = args.event.target.nodeName;
                e.attributes.innerText = args.event.target.innerText;
                args.event = e;
            }
        }
        return Log.info(args);
    }

    loggingObj['error'] = (args) => {
        args.userInfo = user;
        if (args.error === undefined || args.error.name === undefined) {
            console.log('error parameter not passed. Cannot log error without error parameters')
        } else {
            return Log.error(args);
        }
    }

    return loggingObj;
}

export default browserLogger;
