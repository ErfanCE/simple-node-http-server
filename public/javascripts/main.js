renderTable();

// Rendering Functions
async function renderTable(sortBy = null) {
  try {
    const response = await fetch('http://localhost:8000/users');

    if (!response.ok) {
      throw new Error('user error');
    }

    const { data } = await response.json();
    const users = data.users;

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (!!sortBy) {
      users.sort((a, b) => {
        const current = a[sortBy].toString();
        const next = b[sortBy].toString();

        return next.localeCompare(current, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });
    }

    const tableColumns = ['row', ...tablePattern]
      .map((column) => {
        if (column === 'row') return `<th>${column}</th>`;
        return `<th onclick="renderTable('${column}')">${column}</th>`;
      })
      .join('');

    thead.innerHTML = `<tr>${tableColumns}</tr>`;

    for (const [index, user] of users.entries()) {
      tbody.innerHTML += `
    <tr onclick="renderReadUser(${user.uid})">
      <td>${index + 1}</td>
      <td>${user.uid}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.city}</td>
      <td>${user.postalCode}</td>
      <td>${user.phoneNumber}</td>
      <td>${user.position}</td>
    </tr>`;
    }
  } catch (err) {
    console.log(err);
  }
}

async function renderReadUser(uid) {
  try {
    const response = await fetch(`http://localhost:8000/user?uid=${uid}`);

    if (!response.ok) {
      const { error } = await response.json();

      throw new Error(error.message);
    }

    const { data } = await response.json();
    const user = data.user;

    modalHeader.textContent = 'User Info';

    modalBody.innerHTML = Object.keys(user)
      .map(
        (property) => `<p><strong>${property}:</strong> ${user[property]}</p>`
      )
      .join('');

    modalFooter.innerHTML = `
    <button class="button" onclick="renderUpdateUser(${uid})">Update</button>
    <button class="button" onclick="deleteUser(${uid})">delete</button>`;

    openModal();
  } catch (err) {
    console.log(err);
  }
}

function renderCreateUser() {
  modalHeader.textContent = 'Add new User';

  modalBody.innerHTML = tablePattern
    .map((property) => {
      if (property === 'uid') {
        return `<input type="number" min="0" id="${property}"  class="create-inputs" value="1" placeholder="${property}" />`;
      }

      return `<input type="text" id="${property}"  class="create-inputs" value="e" placeholder="${property}" />`;
    })
    .join('');

  modalFooter.innerHTML = `
    <button class="button" onclick="createUser()">Save</button>
    <button class="button" onclick="modalClose()">Cancel</button>`;

  openModal();
}

async function renderUpdateUser(uid) {
  try {
    const response = await fetch(`http://localhost:8000/user?uid=${uid}`);

    if (!response.ok) {
      const { error } = await response.json();

      throw new Error(error.message);
    }

    const { data } = await response.json();
    const user = data.user;

    modalHeader.textContent = 'Edit User Info';

    modalBody.innerHTML = Object.keys(user)
      .map((property) => {
        if (property === 'uid') {
          return `<input type="text" id="${property}"  class="update-inputs" value="${user[property]}" placeholder="${property}" disabled />`;
        }
        return `<input type="text" id="${property}"  class="update-inputs" value="${user[property]}" placeholder="${property}" />`;
      })
      .join('');

    modalFooter.innerHTML = `
    <button class="button" onclick="updateUser(${uid})">Save</button>
    <button class="button" onclick="renderReadUser(${uid})">Cancel</button>`;
  } catch (err) {
    console.log(err);
  }
}

// Operational Functions
async function createUser() {
  try {
    const getUserResponse = await fetch('http://localhost:8000/users');

    if (!getUserResponse.ok) {
      throw new Error('user error');
    }

    const { data } = await getUserResponse.json();
    const users = data.users;

    const createInputs = document.querySelectorAll('.create-inputs');

    const newUser = {};

    for (const input of createInputs) {
      // if (input.value.trim() === '') return alert('invalid input');

      // if (
      //   input.id === 'uid' &&
      //   !!users.find((user) => user.uid === Number(input.value))
      // ) {
      //   return alert('duplicated uid!');
      // }

      if (input.id === 'uid') {
        newUser[input.id] = Number(input.value);
        continue;
      }

      newUser[input.id] = input.value;
    }

    const createUserResponse = await fetch('http://localhost:8000/add-user', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!createUserResponse.ok) {
      const { error } = await createUserResponse.json();
      throw new Error(error.message);
    }

    await createUserResponse.json();

    closeModal();
    renderTable();
  } catch (err) {
    console.log(err);
  }
}

async function updateUser(uid) {
  try {
    const response = await fetch(`http://localhost:8000/user?uid=${uid}`);

    if (!response.ok) {
      const { error } = await response.json();

      throw new Error(error.message);
    }

    const { data } = await response.json();
    const user = data.user;

    const updateInputs = document.querySelectorAll('.update-inputs');

    for (const input of updateInputs) {
      if (input.value.trim() === '') return alert('invalid input');

      if (input.id === 'uid') {
        user[input.id] = Number(input.value);
        continue;
      }

      user[input.id] = input.value;
    }

    const editUserResponse = await fetch(
      `http://localhost:8000/edit-user?uid=${uid}`,
      {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!editUserResponse.ok) {
      const { error } = await editUserResponse.json();

      throw new Error(error.message);
    }

    const { data: modifiedUser } = await editUserResponse.json();
    console.log(modifiedUser.user);

    closeModal();
    renderTable();
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser(uid) {
  try {
    const response = await fetch(
      `http://localhost:8000/delete-user?uid=${uid}`
    );

    if (!response.ok) {
      const { error } = await createUserResponse.json();
      throw new Error(error.message);
    }

    renderTable();
    closeModal();
  } catch (error) {}
}

function deleteAllUsers() {
  usersData = [];

  renderTable();
}
