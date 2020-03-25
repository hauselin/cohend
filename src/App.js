import React, { useReducer, useState, useEffect, createContext, useMemo } from "react";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, useTheme, ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import HeaderAppBar from "./components/navigation/HeaderAppBar";
import SettingsDrawer from "./components/navigation/SettingsDrawer";
import Faq from "./components/content/FAQ";
import MoreViz from "./components/content/MoreViz";
import CommonLanguage from "./components/content/CommonLanguage";
import theme from "./theme.js";
import TwitterIcon from "@material-ui/icons/Twitter";
import IntroText from "./components/content/Intro";
import Posters from "./components/content/Posters";
import Contribute from "./components/content/Contribute";
import Button from "@material-ui/core/Button";
import Content from "./Viz";
import SEO from "./components/SEO";
import Footer from "./components/content/Footer"
import { normal } from "jstat";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  textContent: {
    maxWidth: 700
  },
  siteTitle: {
    margin: theme.spacing(10, 0, 5)
  },
  siteSubTitle: {
    margin: theme.spacing(0, 0, 5)
  },
  twitter: {
    textTransform: "none"
  }
}));

let initialState;
if (typeof localStorage !== `undefined`) {
  initialState = JSON.parse(localStorage.getItem("cohendState")) || {
    M0: 100,
    M1: "",
    SD: 15,
    cohend: "0.2",
    U3: "",
    propOverlap: "",
    CER: 20,
    NNT: "",
    CL: "",
    xLabel: "Outcome",
    muZeroLabel: "Control",
    muOneLabel: "Treatment",
    sliderMax: 2,
    sliderStep: 0.1
  };
} else {
  initialState = {
    muZeroLabel: "Control",
    muOneLabel: "Treatment"
  };
}

const vizReducer = (state, action) => {
  let { name, value } = action;
  value = value === "" ? "" : action.value;
  const calcGaussOverlap = d => 2 * normal.cdf(-Math.abs(d) / 2, 0, 1);
  const calcCL = d => normal.cdf(d / Math.sqrt(2), 0, 1);
  const calcNNT = (d, CER) =>
    1 / (normal.cdf(d + normal.inv(CER, 0, 1), 0, 1) - CER);

  const calcCohend = (value, name) => {
    switch (name) {
      case "M0":
        return (state.M1 - value) / state.SD;
      case "M1":
        return (value - state.M0) / state.SD;
      case "SD":
        return (state.M1 - state.M0) / value;
    }
  };

  const updateDonutData = (d, CER) => {
    const dNumber = Number(d);
    const cerNumber = Number(CER);
    return {
      U3: normal.cdf(dNumber, 0, 1),
      propOverlap: calcGaussOverlap(dNumber),
      CL: calcCL(dNumber),
      NNT: calcNNT(dNumber, cerNumber)
    };
  };
  switch (name) {
    case "cohend":
      return {
        ...state,
        cohend: round(value),
        M1: round(state.M0 + value * state.SD),
        ...updateDonutData(value, state.CER / 100)
      };
    case "SD":
    case "M0":
    case "M1": {
      if (name === "M1") {
        value = value < state.M0 ? state.M0 : value;
      } else if (name === "M0") {
        value = value > state.M1 ? state.M1 : value;
      }
      const cohend = calcCohend(value, name);
      return {
        ...state,
        cohend: cohend,
        [name]: round(value),
        ...updateDonutData(cohend, state.CER / 100)
      };
    }
    case "xLabel":
    case "muZeroLabel":
    case "muOneLabel":
    case "sliderMax":
    case "sliderStep":
      return {
        ...state,
        [name]: value
      };
    case "CER":
      return {
        ...state,
        CER: value,
        NNT: calcNNT(state.cohend, value / 100)
      };
  }
};

export const SettingsContext = createContext(null);
const round = val => Math.round(Number(val) * 1000) / 1000;

const App = () => {
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState(false);
  const [state, dispatch] = useReducer(vizReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => dispatch({ name: "cohend", value: initialState.cohend }), []);

  const toggleDrawer = (side, open) => event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    side == "right" ? setOpenSettings(open) : setOpen(open);
  };

  return (
    <div className={classes.root}>
      <SEO
      />
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SettingsContext.Provider value={contextValue}>
          <HeaderAppBar />
          <SettingsDrawer
            handleDrawer={toggleDrawer}
            open={openSettings}
            vizState={state}
          >
            <Container>
              <Typography
                variant="h2"
                component="h1"
                className={classes.siteTitle}
                gutterBottom
                align="center"
              >
                Interpreting Cohen's <em>d</em> Effect Size
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                className={classes.siteSubTitle}
                gutterBottom
              >
                An Interactive Visualization
              </Typography>
              <Typography align="center">
                <p>
                  Created by{" "}
                  <a href="https://rpsychologist.com/">Kristoffer Magnusson</a>
                  <br />
                  <a href="https://twitter.com/krstoffr">
                    <Button className={classes.twitter}>
                      <TwitterIcon />
                      krstoffr
                    </Button>
                  </a>
                </p>
              </Typography>
            </Container>
            <Container className={classes.textContent}>
              <IntroText />
            </Container>
            <Content
              openSettings={openSettings}
              vizState={state}
              toggleDrawer={toggleDrawer}
            />
            <Container className={classes.textContent}>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
              >
                A Common Language Explanation
              </Typography>
              <CommonLanguage vizState={state} />
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
              >
                FAQ
              </Typography>
              <Faq />
              <Contribute />
              <Posters />
            </Container>
            <Container maxWidth="lg">
              <MoreViz />
            </Container>
          </SettingsDrawer>
        </SettingsContext.Provider>
        <Footer/>
      </ThemeProvider>
    </div>
  );
};
export default App;
