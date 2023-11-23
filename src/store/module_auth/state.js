export default function () {
  return {
    authorization: null,
    refreshtoken: null,
    loggedIn: false,
    me: {
      id: null,
      username: null,
      status: null,
      addTime: null,
      groupName: null,
      role: null
    },
  };
}
