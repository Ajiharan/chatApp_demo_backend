let users = [];

export const addUser = ({ name, room, id }) => {
  console.log("name", name);

  const isExists = users.find((res) => res.name === name && res.room === room);
  if (isExists) {
    return { error: "user is already taken" };
  }
  users.push({ name, room, id });
  const user = { name, room, id };
  console.log("users", users);
  return { user };
};

export const removeUser = (id) => {
  if (id) {
    const removeUser = users.find((res) => res.id === id);
    users = users.filter((res) => res.id !== id);
    if (removeUser) {
      return removeUser;
    }
    return null;
  }
  return null;
};

export const getUser = (id) => {
  return users.find((user) => user.id === id);
};

export const getUserInRoom = (room) => {
  return users.filter((user) => user.room == room);
};
