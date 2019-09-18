const neighbourgUpdater = items => (fn, condition = () => true) => {
  return function(n, padding) {
    const index = items.indexOf(n) + padding;
    // console.log("n, padding", n, padding, index);
    if (items[index] !== undefined) {
      const item = items[index];
      if (condition(item)) {
        fn(item);
      }
    }
  };
};

export class NeighbourgLoader {
  constructor(map) {
    this.map = map;
    this.loadedItems = new Set();
  }
  clearLoaded = () => (this.loadedItems = new Set());
  updateSet = fn => item => {
    this.loadedItems.add(item);
    fn(item);
  };
  setItems = items => (this.doWithNeighbourg = neighbourgUpdater(items));
  bindLoaders(loaders) {
    const bindedLoaders = {};
    for (let l in loaders) bindedLoaders[l] = loaders[l].bind(this);
    return bindedLoaders;
  }

  loadNeighbourg = fn => this.doWithNeighbourg(this.updateSet(fn));
  unloadNeighbourg = fn =>
    this.doWithNeighbourg(fn, item => !this.loadedItems.has(item));
}
