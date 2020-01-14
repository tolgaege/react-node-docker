import React from "react";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true, user: action.user };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    // isAuthenticated: !!localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("user"),
    user: localStorage.getItem("user")
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, user, token, history, setIsLoading, setError) {
  const allowUsers = [
    "demo",
    "julianmcolina",
    "thellimist",
    "demiculus",
    "gadybadger",
    "zacstockton",
    "thatandyrose"
  ];
  if (!allowUsers.includes(user)) {
    setError("Login Failed");
    return;
  }

  // localStorage.setItem("token", token);
  localStorage.setItem("user", user);
  dispatch({ type: "LOGIN_SUCCESS", user: user });
  history.push("/app/baseline/repository");
}

function signOut(dispatch, history) {
  // localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
