// context creation
// provider
// consumer lengthy remove useContext hook
// useContext hook

import React, { useContext, useReducer, useEffect } from 'react';
import reducer from './Reducer';

let API = "http://hn.algolia.com/api/v1/search?";

const initialState = {
    isLoading : true,
    query : "CSS",
    nbPages : 0,
    page : 0,
    hits : [],
};

const AppContext = React.createContext();

// to create a provider function
const AppProvider = ({ children }) => {
  //const [ state, setState ] = useState(initialState);

  const [ state, dispatch ] = useReducer(reducer, initialState);

  const fetchApiData =  async (url) =>{
    dispatch({ type : "SET_LOADING" });

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      dispatch({
        type : "GET_STORIES",
        payload: {
           hits: data.hits,
           nbPages: data.nbPages,
        },
      });
      // isLoading = false;
    } catch (error) {
      console.log(error);
    }
  };

  // to remove  the post
  const removePost = (post_ID) => {
    dispatch({ type: "REMOVE_POST", payload: post_ID });
  };

  // search
  const searchPost = (searchQuery) => {
    dispatch({ 
      type: "SEARCH_QUERY", 
      payload: searchQuery,
    });
  };

  // pagination 
  const getNextPage = () => {
    dispatch({
      type: "NEXT_PAGE",
    });
  };

  const getPrevPage = () => {
    dispatch({
      type: "PREV_PAGE",
    });
  };
  
  // to call teh api func
  useEffect(()=> {
    fetchApiData(`${API}query=${state.query}&page=${state.page}`);
  }, [state.query, state.page]);

    return ( 
      <AppContext.Provider 
      value={{ ...state, removePost, searchPost, getNextPage, getPrevPage }}>
        {children}
      </AppContext.Provider>
    );
};


// custom hook create
const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppContext, AppProvider, useGlobalContext };
