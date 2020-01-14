import React, { useState, useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import HomeIcon from "@material-ui/icons/Home";
import TypographyIcon from "@material-ui/icons/FormatSize";
import NotificationsIcon from "@material-ui/icons/NotificationsNone";
import UIElementsIcon from "@material-ui/icons/FilterNone";
import CodeIcon from "@material-ui/icons/Code";
import GroupIcon from "@material-ui/icons/Group";
import TableIcon from "@material-ui/icons/BorderAll";
import SupportIcon from "@material-ui/icons/QuestionAnswer";
import LibraryIcon from "@material-ui/icons/LibraryBooks";
import PersonIcon from "@material-ui/icons/Person";
import FAQIcon from "@material-ui/icons/HelpOutline";
import InfoIcon from "@material-ui/icons/Info";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import useTheme from "@material-ui/styles/useTheme";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar
} from "../../context/LayoutContext";
import { useUserState } from "../../context/UserContext";

const structure = [
  {
    id: 0,
    label: "Baseline",
    link: "/app/baseline",
    icon: <HomeIcon />
  },
  {
    id: 1,
    label: "Sprint",
    link: "/app/sprint",
    icon: <RotateRightIcon />
  },
  {
    id: 2,
    label: "Beta",
    link: "/app/beta",
    icon: <TypographyIcon />
  },
  { id: 5, type: "divider" },
  { id: 6, type: "title", label: "HELP" },
  {
    id: 7,
    label: "Library",
    link: "https://usehaystack.io/book-of-eng-management.html",
    icon: <LibraryIcon />
  },
  {
    id: 8,
    label: "Support",
    link: "https://meetings.hubspot.com/julian113/haystack-demo",
    icon: <SupportIcon />
  },
  { id: 9, label: "FAQ", link: "", icon: <FAQIcon /> }
];

const mockStructure = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  {
    id: 1,
    label: "Code Quality",
    link: "/app/code-quality",
    icon: <CodeIcon />
  },
  // { id: 2, label: "Redash", link: "/app/redash", icon: <LibraryIcon /> },
  // {
  //   id: 1,
  //   label: "Typography",
  //   link: "/app/typography",
  //   icon: <TypographyIcon />,
  // },
  // { id: 2, label: "Tables", link: "/app/tables", icon: <TableIcon /> },
  // {
  //   id: 3,
  //   label: "Notifications",
  //   link: "/app/notifications",
  //   icon: <NotificationsIcon />,
  // },
  {
    id: 4,
    label: "Team",
    icon: <GroupIcon />,
    children: [
      {
        label: "Backend",
        icon: <SupervisedUserCircleIcon />,
        children: [
          { label: "Info", link: "/app/team/1/info", icon: <InfoIcon /> },
          {
            label: "Jason Calderone",
            link: "/app/team/1/member/1",
            icon: <PersonIcon />
          },
          {
            label: "Esperanza Susanne",
            link: "/app/team/1/member/2",
            icon: <PersonIcon />
          },
          {
            label: "Christian Birgitte",
            link: "/app/team/1/member/3",
            icon: <PersonIcon />
          },
          {
            label: "Meral Elias",
            link: "/app/team/1/member/4",
            icon: <PersonIcon />
          }
        ]
      },
      {
        label: "Data Science",
        icon: <SupervisedUserCircleIcon />,
        children: [
          { label: "Info", link: "/app/team/2/info", icon: <InfoIcon /> },
          {
            label: "Sebastiana Hani",
            link: "/app/team/2/member/1",
            icon: <PersonIcon />
          },
          {
            label: "Marciano Oihana",
            link: "/app/team/2/member/2",
            icon: <PersonIcon />
          },
          {
            label: "Gaston Festus",
            link: "/app/team/2/member/3",
            icon: <PersonIcon />
          }
        ]
      }
    ]
  },
  { id: 5, type: "divider" },
  { id: 6, type: "title", label: "HELP" },
  { id: 7, label: "Library", link: "", icon: <LibraryIcon /> },
  { id: 8, label: "Support", link: "", icon: <SupportIcon /> },
  { id: 9, label: "FAQ", link: "", icon: <FAQIcon /> }
  // { id: 10, type: "divider" },
  // { id: 11, type: "title", label: "PROJECTS" },
  // {
  //   id: 12,
  //   label: "My recent",
  //   link: "",
  //   icon: <Dot size="large" color="warning" />,
  // },
  // {
  //   id: 13,
  //   label: "Starred",
  //   link: "",
  //   icon: <Dot size="large" color="primary" />,
  // },
  // {
  //   id: 14,
  //   label: "Background",
  //   link: "",
  //   icon: <Dot size="large" color="secondary" />,
  // },
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  var { user } = useUserState();

  let sideBarItems = structure;
  if (user === "demo") {
    sideBarItems = mockStructure;
  }

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened
        })
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse)
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {sideBarItems.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
