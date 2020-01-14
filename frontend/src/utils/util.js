import _ from "lodash";
import moment from "moment";

export const EPOCH = new Date(1970, 1, 1);
export const TODAY = new Date();
export const DAY = 24 * 60 * 60 * 1000;
export const WEEK = 7 * DAY;

export const PULL_REQUEST_STATE = {
  OPEN: "open",
  CLOSED: "closed",
  MERGED: "merged"
};

export const average = (arr, key) => {
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    if (key) {
      total = total + _.get(arr[i], key);
    } else {
      total = total + arr[i];
    }
  }

  return total / arr.length;
};

export const openInNewTab = url => {
  var win = window.open(url, "_blank");
  win.focus();
};

export const groupByWeek = (data, key) => {
  return Object.values(_.groupBy(data, dt => moment(_.get(dt, key)).week()));
};

export const getMean = data => {
  return (
    data.reduce(function(a, b) {
      return Number(a) + Number(b);
    }) / data.length
  );
};

export const getStandardDeviation = data => {
  let m = getMean(data);
  return Math.sqrt(
    data.reduce(function(sq, n) {
      return sq + Math.pow(n - m, 2);
    }, 0) /
      (data.length - 1)
  );
};

export const getPullRequestState = (state, date) => {
  if (state === PULL_REQUEST_STATE.OPEN) return state;
  return new Date(date).getTime() > EPOCH.getTime()
    ? PULL_REQUEST_STATE.MERGED
    : PULL_REQUEST_STATE.CLOSED;
};
