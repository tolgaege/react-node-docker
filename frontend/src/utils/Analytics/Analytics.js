import { Mixpanel } from "./Mixpanel";
import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

const ANALYTICS_ACTIVE = process.env.NODE_ENV === "production";

// Example Usage
// Analytics.track(Analytics.Constants.Events.PAGE_VISIT, { location: Analytics.Constants.Pages.LOGIN_PAGE, otherStuff: 123 })

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let Analytics = {
  Constants: {
    Events: {
      PAGE_VISIT: "Page Visit",
      BUTTON_CLICK: "Button Click",
      FILTER_CLICK: "Filter Click"
    },
    Pages: {
      LOGIN_PAGE: "Login Page",
      LIBRARY_PAGE: "Library Page",
      SUPPORT_PAGE: "Support Page"
    }
  },

  init: () => {
    if (ANALYTICS_ACTIVE) {
      ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TOKEN);
      ReactGA.pageview("/");
      Mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN);
      Mixpanel.identify(makeid(20));
      hotjar.initialize(
        process.env.REACT_APP_HOTJAR_TOKEN,
        process.env.REACT_APP_HOTJAR_SNIPPET_VERSION
      );
    }
  },
  identify: id => {
    if (ANALYTICS_ACTIVE) {
      Mixpanel.identify(id);
    }
  },
  alias: id => {
    if (ANALYTICS_ACTIVE) {
      Mixpanel.alias(id);
    }
  },
  track: (name = "", props = {}) => {
    if (ANALYTICS_ACTIVE) {
      console.log("Tracking: ", name, props);
      Mixpanel.track(name, props);

      ReactGA.event({
        category: name,
        action: props.action || "",
        label: props.label || ""
      });
    }
  },
  people: {
    set: props => {
      if (ANALYTICS_ACTIVE) {
        Mixpanel.people.set(props);
      }
    }
  }
};

export default Analytics;
