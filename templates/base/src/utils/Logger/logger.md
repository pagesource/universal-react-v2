/**
 * USAGE: ->
 * import Logger from '../utils/Logger';
 *  call as :-
 * Logger.error({ message: 'Here is the error',
 *    event: {
      name: 'event20', id: 657,
      module: 'modA',
      type: "load|interaction|redirect" ,
      data: { a: "hhhh" },
    },
    error: {
      code: 'ABC',
      message: 'message',
      operationName: 'testing'
    },
    service: {
      name: 'serviceName',
      path: 'servicePath',
    } });
 */
