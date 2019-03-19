const initialState = {};

const UPDATE_USER = "UPDATE_USER";
const CLEAR_USER = "CLEAR_USER";

export function updateUser(userObj) {
  return {
    type: UPDATE_USER,
    payload: userObj
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER
  };
}

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_USER:

      const { id, app_id, name, address, isadmin, ismechanic, number, username, disapproved, items, email, url } = payload
      return { ...state, id, app_id, name, address, isadmin, ismechanic, number, username, disapproved, items, email, url }

    case CLEAR_USER:
      const user = {};
      return { ...user };
    default:
      return state;
  }
}