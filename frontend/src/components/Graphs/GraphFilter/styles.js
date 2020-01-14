import makeStyles from "@material-ui/styles/makeStyles";

export default makeStyles(theme => ({
  selectInput: {
    padding: 10,
    paddingRight: 25,
    "&:focus": {
      backgroundColor: "white"
    }
  },
  paper: {
    boxShadow: theme.customShadows.widget
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));
