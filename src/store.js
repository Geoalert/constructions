import { createStore } from "redux";

const defaultState = {
  showDiff: false,
  year: null
};

const stateSetter = state => update => {
  return Object.assign({}, state, update);
};

function reducer(state = defaultState, action) {
  const setState = stateSetter(state);
  switch (action.type) {
    case "SET_YEAR":
      return setState({ year: action.year });
    case "SET_DIFF":
      return setState({ showDiff: action.showDiff });
    default:
      return state;
  }
}

const store = createStore(reducer);

const setYear = year => ({ type: "SET_YEAR", year });
const setDiff = showDiff => ({ type: "SET_DIFF", showDiff });

const actions = { setYear, setDiff };
export { actions, store as default };
