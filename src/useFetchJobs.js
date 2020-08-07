import { useReducer, useEffect } from "react";
import axios from "axios";

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  ERROR: "error",
  UPDATE_HAS_NEXT_PAGE: "next-page"
};
const BASE_URL = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";
// const BASE_URL = "https://jobs.github.com/positions.json";


function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
}

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  const source = axios.CancelToken.source();
  const source2 = axios.CancelToken.source();

  useEffect(() => {
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axios.get(BASE_URL, {
        cancelToken: source.token,
        params: { markdown: true, page: page, ...params }
    }).then(res => {
        // console.log(res.data)
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
    }).catch(e => {
        // if(axios.isCancel(e)) { console.log("mutliple request cancelled", e.message) }
        if(axios.isCancel(e)) return
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
    });

    axios.get(BASE_URL, {
      cancelToken: source2.token,
      params: { markdown: true, page: page + 1, ...params }
    }).then(res => {
      // console.log(res.data)
      dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length !== 0 } });
    }).catch(e => {
      // if(axios.isCancel(e)) { console.log("mutliple request cancelled", e.message) }
      if(axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
    })

    return () => {
        source2.cancel();
        source.cancel();
    }
  }, [params, page]);

  return state;
}
