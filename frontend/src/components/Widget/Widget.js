import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import MoreIcon from "@material-ui/icons/MoreVert";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import classnames from "classnames";

// styles
import useStyles from "./styles";

export default function Widget({
  children,
  title,
  noBodyPadding,
  bodyClass,
  disableWidgetMenu,
  header,
  tooltipText,
  filterMenu,
  ...props
}) {
  var classes = useStyles();

  // local
  var [moreButtonRef, setMoreButtonRef] = useState(null);
  var [isMoreMenuOpen, setMoreMenuOpen] = useState(false);
  return (
    <div className={classes.widgetWrapper}>
      <Paper className={classes.paper} classes={{ root: classes.widgetRoot }}>
        <div className={classes.widgetHeader}>
          {header ? (
            header
          ) : (
            <>
              <Typography variant="h5" color="textSecondary">
                {title}
              </Typography>
              <div className={classes.widgetGroup}>
                {filterMenu && (
                  <div className={classes.widgetRightMargin}>{filterMenu}</div>
                )}

                {tooltipText && (
                  <Tooltip
                    title={<div className={classes.tooltip}>{tooltipText}</div>}
                  >
                    <HelpOutlineIcon className={classes.widgetRightMargin} />
                  </Tooltip>
                )}
              </div>
            </>
          )}
        </div>
        <div
          className={classnames(classes.widgetBody, {
            [classes.noPadding]: noBodyPadding,
            [bodyClass]: bodyClass
          })}
        >
          {children}
        </div>
      </Paper>
    </div>
  );
}
