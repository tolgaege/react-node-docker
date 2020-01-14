import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";
import { FILTER_TYPE } from "../Graphs/GraphFilter/GraphFilter";

// mock pages
import Dashboard from "../../pages/dashboard";
import CodeQuality from "../../pages/codeQuality";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Redash from "../../pages/redash";
import Maps from "../../pages/maps";
// import Icons from "../../pages/icons";
import Member from "../../pages/member";
import Team from "../../pages/team";

// pages
import BaselineReport from "../../pages/Baseline";
import SprintReport from "../../pages/Sprint";
import BetaReport from "../../pages/Beta";

// context
import { useLayoutState } from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";

function Layout(props) {
  var classes = useStyles();
  var layoutState = useLayoutState();
  var { user } = useUserState();

  return (
    <div className={classes.root}>
      <>
        <Header history={props.history} />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened
          })}
        >
          <div className={classes.fakeToolbar} />
          {user === "demo" && (
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/code-quality" component={CodeQuality} />
              <Route path="/app/typography" component={Typography} />
              <Route path="/app/notifications" component={Notifications} />
              <Route path="/app/redash" component={Redash} />
              <Route
                exact
                path="/app/ui"
                render={() => <Redirect to="/app/ui/icons" />}
              />
              {/* <Route path="/app/ui/icons" component={Icons} /> */}
              <Route path="/app/team/1/info" component={Team} />
              <Route path="/app/team/2/info" component={Team} />
              <Route path="/app/team/1/member/1" component={Member} />
              <Route path="/app/team/1/member/2" component={Member} />
              <Route path="/app/team/1/member/3" component={Member} />
              <Route path="/app/team/1/member/4" component={Member} />
              <Route path="/app/team/2/member/1" component={Member} />
              <Route path="/app/team/2/member/2" component={Member} />
              <Route path="/app/team/2/member/3" component={Member} />
            </Switch>
          )}
          {user !== "demo" && (
            <Switch>
              <Route
                path="/app/baseline"
                render={props => <BaselineReport {...props} />}
              />
              <Route
                path="/app/sprint"
                render={props => <SprintReport {...props} />}
              />
              <Route
                path="/app/Beta"
                render={props => <BetaReport {...props} />}
              />
            </Switch>
          )}
        </div>
      </>
    </div>
  );
}

export default withRouter(Layout);
