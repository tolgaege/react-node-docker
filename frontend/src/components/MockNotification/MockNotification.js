import React from "react";
import Button from "@material-ui/core/Button";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NotificationsIcon from "@material-ui/icons/NotificationsNone";
import TicketIcon from "@material-ui/icons/LocalOffer";
import DeliveredIcon from "@material-ui/icons/BusinessCenter";
import FeedbackIcon from "@material-ui/icons/SmsFailed";
import DiscIcon from "@material-ui/icons/DiscFull";
import MessageIcon from "@material-ui/icons/Email";
import ReportIcon from "@material-ui/icons/Report";
import DefenceIcon from "@material-ui/icons/Error";
import CustomerIcon from "@material-ui/icons/AccountBox";
import ShippedIcon from "@material-ui/icons/Done";
import UploadIcon from "@material-ui/icons/Publish";
import useTheme from "@material-ui/styles/useTheme";
import classnames from "classnames";
import tinycolor from "tinycolor2";

// styles
import useStyles from "./styles";

// components
import { Typography } from "../Wrappers";

const typesIcons = {
  "e-commerce": <ShoppingCartIcon />,
  notification: <NotificationsIcon />,
  offer: <TicketIcon />,
  info: <ThumbUpIcon />,
  message: <MessageIcon />,
  feedback: <FeedbackIcon />,
  customer: <CustomerIcon />,
  shipped: <ShippedIcon />,
  delivered: <DeliveredIcon />,
  defence: <DefenceIcon />,
  report: <ReportIcon />,
  upload: <UploadIcon />,
  disc: <DiscIcon />
};

export default function MockNotification({ variant, ...props }) {
  var classes = useStyles();
  var theme = useTheme();

  const icon = getIconByType(props.type);
  const iconWithStyles = React.cloneElement(icon, {
    classes: {
      root: classes.notificationIcon
    },
    style: {
      color:
        variant !== "contained" &&
        theme.palette[props.color] &&
        theme.palette[props.color].main
    }
  });

  return (
    <div
      className={classnames(classes.notificationContainer, props.className, {
        [classes.notificationContained]: variant === "contained",
        [classes.notificationContainedShadowless]: props.shadowless
      })}
      style={{
        backgroundColor:
          variant === "contained" &&
          theme.palette[props.color] &&
          theme.palette[props.color].main
      }}
    >
      <div
        className={classnames(classes.notificationIconContainer, {
          [classes.notificationIconContainerContained]: variant === "contained",
          [classes.notificationIconContainerRounded]: variant === "rounded"
        })}
        style={{
          backgroundColor:
            variant === "rounded" &&
            theme.palette[props.color] &&
            tinycolor(theme.palette[props.color].main)
              .setAlpha(0.15)
              .toRgbString()
        }}
      >
        {iconWithStyles}
      </div>
      <div className={classes.messageContainer}>
        <Typography
          className={classnames({
            [classes.containedTypography]: variant === "contained"
          })}
          variant={props.typographyVariant}
          size={variant !== "contained" && !props.typographyVariant && "md"}
        >
          {props.message}
        </Typography>
        {props.extraButton && props.extraButtonClick && (
          <Button
            onClick={props.extraButtonClick}
            disableRipple
            className={classes.extraButton}
          >
            {props.extraButton}
          </Button>
        )}
      </div>
    </div>
  );
}

// ####################################################################
function getIconByType(type = "offer") {
  return typesIcons[type];
}
