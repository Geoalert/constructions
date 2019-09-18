export function getRasterLayerUrl(template, year) {
  return template.replace("{year}", year);
}

export function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function debounce(f, t) {
  return function(args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= t) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => f(args), t);
  };
}

export function formatSliderValue(fn) {
  return function([value]) {
    fn("" + parseInt(value, 10));
  };
}
