import mixpanel from "mixpanel-browser";

let actions = {
  init: token => {
    mixpanel.init(token);
  },
  identify: id => {
    mixpanel.identify(id);
  },
  alias: id => {
    mixpanel.alias(id);
  },
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  people: {
    set: props => {
      mixpanel.people.set(props);
    }
  }
};

export let Mixpanel = actions;
