import { RequestMock } from 'testcafe';

const reqHandler = (req, res, handler) => {
  res.headers['access-control-allow-origin'] = '*';
  res.headers['access-control-allow-methods'] = '*';
  res.headers['access-control-allow-headers'] = '*';
  res.headers['content-type'] = 'application/json';

  if (req.method === 'OPTIONS') {
    res.headers['allow'] = '*';
  }

  // Handler must return string
  const resToSend = handler(req, res);
  res.setBody(resToSend);
};

const addRequestHandlers = (handlerConfigArray) => {
  const rmRef = handlerConfigArray.reduce((curr, elem) => {
    const { path, handler } = elem;
    curr.onRequestTo(path).respond((req, res) => reqHandler(req, res, handler));
    return curr;
  }, RequestMock());

  return rmRef;
};

export default addRequestHandlers;
