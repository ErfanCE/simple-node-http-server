const { writeFile } = require('node:fs/promises');
const { join } = require('node:path');
const url = require('node:url');

const users = require('../models/users.json');
const { requestHandler } = require('./request-handler-controller');

const getAllUsers = (_req, res) => {
  requestHandler(res, 200, {
    status: 'success',
    data: { users }
  });
};

// * /users/112233
// const getUserByUid = (req, res) => {
//   const { url } = req;
//   const [, , uid] = url.split('/');

//   const user = users.find((user) => user.uid === Number(uid));

//   if (!user) {
//     return requestHandler(res, 404, {
//       status: 'fail',
//       error: {
//         message: `user uid:${uid} not found`
//       }
//     });
//   }

//   requestHandler(res, 200, {
//     status: 'success',
//     data: { user }
//   });
// };

// * /users?uid=112233
const getUserByUid = (req, res) => {
  const { query } = url.parse(req.url, true);
  const { uid } = query;

  if (!uid) {
    return requestHandler(res, 400, {
      status: 'fail',
      error: {
        message: `provide uid`
      }
    });
  }

  const user = users.find((user) => user.uid === Number(uid));

  if (!user) {
    return requestHandler(res, 404, {
      status: 'fail',
      error: {
        message: `user uid:${uid} not found`
      }
    });
  }

  requestHandler(res, 200, {
    status: 'success',
    data: { user }
  });
};

const addUser = (req, res) => {
  const body = [];

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', async () => {
    try {
      const requestBody = Buffer.concat(body).toString();
      const {
        uid = null,
        city = null,
        position = null,
        firstname = null,
        lastname = null,
        postalCode = null,
        phoneNumber = null
      } = JSON.parse(requestBody);

      console.log(requestBody);

      const isDuplicatedUid = !!users.find((user) => user.uid === uid);

      if (isDuplicatedUid) {
        return requestHandler(res, 400, {
          status: 'fail',
          error: {
            message: `user uid:${uid} already exist`
          }
        });
      }

      // add new user
      users.push({
        uid,
        city,
        position,
        firstname,
        lastname,
        postalCode,
        phoneNumber
      });

      const usersAsText = JSON.stringify(users);

      await writeFile(join(__dirname, '../models/users.json'), usersAsText);

      requestHandler(res, 200, {
        status: 'success',
        data: {
          user: {
            uid,
            city,
            position,
            firstname,
            lastname,
            postalCode,
            phoneNumber
          }
        }
      });
    } catch (err) {
      console.error(err);

      requestHandler(res, 500, {
        status: 'error',
        error: {
          message: `internal server error`
        }
      });
    }
  });
};

const editUserByUid = (req, res) => {
  const { query } = url.parse(req.url, true);
  const { uid } = query;

  if (!uid) {
    return requestHandler(res, 400, {
      status: 'fail',
      error: {
        message: `provide uid`
      }
    });
  }

  const body = [];

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', async () => {
    try {
      const requestBody = Buffer.concat(body).toString();
      const {
        city = null,
        position = null,
        firstname = null,
        lastname = null,
        postalCode = null,
        phoneNumber = null
      } = JSON.parse(requestBody);

      const user = users.find((user) => user.uid === Number(uid));

      if (!user) {
        return requestHandler(res, 404, {
          status: 'fail',
          error: {
            message: `user uid:${uid} not found`
          }
        });
      }

      // patch user data
      user.city = city ?? user.city;
      user.position = position ?? user.position;
      user.lastname = lastname ?? user.lastname;
      user.firstname = firstname ?? user.firstname;
      user.postalCode = postalCode ?? user.postalCode;
      user.phoneNumber = phoneNumber ?? user.phoneNumber;

      const usersAsText = JSON.stringify(users);

      await writeFile(join(__dirname, '../models/users.json'), usersAsText);

      requestHandler(res, 200, {
        status: 'success',
        data: { user }
      });
    } catch (err) {
      console.error(err);

      requestHandler(res, 500, {
        status: 'error',
        error: {
          message: `internal server error`
        }
      });
    }
  });
};

const deleteUserByUid = async (req, res) => {
  try {
    const { query } = url.parse(req.url, true);
    const { uid } = query;

    if (!uid) {
      return requestHandler(res, 400, {
        status: 'fail',
        error: {
          message: `provide uid`
        }
      });
    }

    const userIndex = users.findIndex((user) => user.uid === Number(uid));

    if (userIndex === -1) {
      return requestHandler(res, 404, {
        status: 'fail',
        error: {
          message: `user uid:${uid} not found`
        }
      });
    }

    // remove user
    const modifiedUsers = users.toSpliced(userIndex, 1);
    const usersAsText = JSON.stringify(modifiedUsers);

    await writeFile(join(__dirname, '../models/users.json'), usersAsText);

    requestHandler(res, 204);
  } catch (err) {
    console.error(err);

    requestHandler(res, 500, {
      status: 'error',
      error: {
        message: `internal server error`
      }
    });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserByUid,
  editUserByUid,
  deleteUserByUid
};
