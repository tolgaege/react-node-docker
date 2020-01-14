import makeStyles from "@material-ui/styles/makeStyles";

export default makeStyles(theme => ({
  container: {
    position: "fixed",
    height: "100%",
    width: "100%"
  },
  logotypeContainer: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "50%"
    },
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  logotypeImage: {
    width: 165,
    marginBottom: theme.spacing(4)
  },
  logotypeText: {
    color: "white",
    fontWeight: 500,
    fontSize: 84,
    [theme.breakpoints.down("md")]: {
      fontSize: 48
    }
  }
}));
