const { createServer } = require('node:http');
const { parse } = require('node:url');

const {
  addUser,
  getAllUsers,
  getUserByUid,
  editUserByUid,
  deleteUserByUid
} = require('./controllers/user-controller');
const {
  indexHtml,
  styleSheet,
  modalStyleSheet,
  tableStyleSheet,
  assetsJs,
  mainJs,
  modalJs
} = require('./controllers/load-public-files-controller');

const { requestHandler } = require('./controllers/request-handler-controller');

const serverPort = 8000;
const serverHost = '127.0.0.1';

// serve public files
require('./controllers/load-public-files-controller');

const server = createServer((req, res) => {
  const { url, method } = req;
  const { pathname } = parse(url);

  // * API Routes
  if (method === 'GET' && pathname === '/users') {
    // READ: get all users
    getAllUsers(req, res);
  } else if (method === 'GET' && pathname === '/user') {
    // READ: get user by uid
    getUserByUid(req, res);
  } else if (method === 'GET' && pathname === '/delete-user') {
    // DELETE: delete user by uid
    deleteUserByUid(req, res);
  } else if (method === 'POST' && pathname === '/add-user') {
    // CREATE: add new user
    addUser(req, res);
  } else if (method === 'POST' && pathname === '/edit-user') {
    // UPDATE: patch user data by uid
    editUserByUid(req, res);
  }
  // * Rendering Routes
  else if (method === 'GET' && pathname === '/') {
    requestHandler(res, 200, indexHtml, 'text/html');
  } else if (method === 'GET' && pathname === '/style.css') {
    requestHandler(res, 200, styleSheet, 'text/css');
  } else if (method === 'GET' && pathname === '/modal.css') {
    requestHandler(res, 200, modalStyleSheet, 'text/css');
  } else if (method === 'GET' && pathname === '/table.css') {
    requestHandler(res, 200, tableStyleSheet, 'text/css');
  } else if (method === 'GET' && pathname === '/assets.js') {
    requestHandler(res, 200, assetsJs, 'text/javascript');
  } else if (method === 'GET' && pathname === '/main.js') {
    requestHandler(res, 200, mainJs, 'text/javascript');
  } else if (method === 'GET' && pathname === '/modal.js') {
    requestHandler(res, 200, modalJs, 'text/javascript');
  }
  // * 404: Unhandled Route
  else {
    requestHandler(res, 404, {
      status: 'fail',
      error: {
        message: '404: not found'
      }
    });
  }
});

server.listen(serverPort, serverHost, () => {
  console.info(`Listening on ${serverHost}:${serverPort} ...`);
});
