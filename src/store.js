var initialState = {
  year: "2010",
  showDiff: false
};

var updateState = state => data => Object.assign({}, state, data);

function appReducer(state = initialState, action) {
  var setState = updateState(state);
  switch (action.type) {
    case "SET_YEAR":
      return setState({ year: action.year });
    case "SHOW_DIFF":
      return setState({ showDiff: true });
    case "HIDE_DIFF":
      return setState({ showDiff: false });
    default:
      return state;
  }
}

export var store = window.Redux.createStore(appReducer);
