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

// export default {
//   state: defaultState,
//   setState(state) {
//     // this.state = { ...this.state, ...state };
//     this.state = Object.assign({}, this.state, state);
//   },
//   getState() {
//     console.log(this.state);
//     return Object.assign({}, this.state);
//   },
//   reducer(action) {
//     switch (action.type) {
//       case "SET_YEAR":
//         this.setState({ year: action.year });
//       case "SET_DIFF":
//         this.state.showDiff = action.setDiff;
//       // this.setState({ showDiff: action.showDiff });
//       default:
//         break;
//     }
//   },
//   dispatch(actionCreator, args) {
//     const action = actionCreator(args);
//     this.reducer(action);
//   },
//   reset() {
//     this.setState(defaultState);
//   }
// };

// export class Store {
//   constructor(initialState) {
//     this.initialState = initialState;
//     this.state = initialState;
//   }
//   setState(state) {
//     this.state = { ...this.state, ...state };
//     // this.state = Object.assign({}, this.state, state);
//   }
//   getState() {
//     console.log(this.state);
//     return Object.assign({}, this.state);
//   }
//   reducer(action) {
//     switch (action.type) {
//       case "SET_YEAR":
//         this.setState({ year: action.year });
//       case "SET_DIFF":
//         // this.state.showDiff = action.setDiff;
//         this.setState({ showDiff: action.showDiff });
//       default:
//         break;
//     }
//   }
//   dispatch(actionCreator, args) {
//     const action = actionCreator(args);
//     this.reducer(action);
//   }
//   reset() {
//     this.setState(this.initialState);
//   }
// }

const setYear = year => ({ type: "SET_YEAR", year });
const setDiff = showDiff => ({ type: "SET_DIFF", showDiff });

// const store = new Store(defaultState);

const actions = { setYear, setDiff };
export { actions, store as default };
