import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useUserState } from "./UserContext";

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: action.error
      };
    default:
      throw new Error();
  }
};

export const useAnalyticsApi = (initialUrl, initialData) => {
  const { user } = useUserState();
  const [url, setUrl] = useState(
    `${process.env.REACT_APP_SITE_URL}/api/analytic/` +
      initialUrl +
      `?username=${user}`
  );
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAILURE", error: error });
      }
    };
    fetchData();
  }, [url]);

  return [state, setUrl];
};
