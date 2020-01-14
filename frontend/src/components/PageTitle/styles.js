import makeStyles from "@material-ui/styles/makeStyles";

export default makeStyles(theme => ({
  pageTitleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(5)
  },
  typo: {
    color: theme.palette.text.hint,
    display: "inline-block"
  },
  subtitle: {
    color: theme.palette.text.hint,
    display: "inline-block",
    marginLeft: theme.spacing(1)
  },
  button: {
    boxShadow: theme.customShadows.widget,
    textTransform: "none",
    "&:active": {
      boxShadow: theme.customShadows.widgetWide
    }
  }
}));
