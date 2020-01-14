import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";

export const NOTIFICATION_TYPE = {
  ERROR: "error",
  INFO: "info",
  SUCCESS: "success",
  warning: "warning"
};

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

function NotificationWrapper(props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

NotificationWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf([
    NOTIFICATION_TYPE.ERROR,
    NOTIFICATION_TYPE.INFO,
    NOTIFICATION_TYPE.SUCCESS,
    NOTIFICATION_TYPE.WARNING
  ]).isRequired
};

Notification.propTypes = {
  type: PropTypes.oneOf([
    NOTIFICATION_TYPE.ERROR,
    NOTIFICATION_TYPE.INFO,
    NOTIFICATION_TYPE.SUCCESS,
    NOTIFICATION_TYPE.WARNING
  ]).isRequired
};

const useStyles2 = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

export default function Notification({ type, message, popup }) {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    console.log("handleClose", event);
    console.log("handleClose", reason);
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const notificationWrapper = (
    <NotificationWrapper
      variant={type}
      className={classes.margin}
      message={message}
      onClose={handleClose}
    />
  );

  if (popup) {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {notificationWrapper}
      </Snackbar>
    );
  }

  return <>{open && notificationWrapper}</>;
}
