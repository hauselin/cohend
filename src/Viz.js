import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Cohend from "./components/viz/Overlap";
import DonutChart from "./components/viz/Donuts";
import ResponsiveChart from "./components/viz/ResponsiveChart";
import Slider from "./components/navigation/SettingsSlider";
import Button from '@material-ui/core/Button';
import svgSaver from "svgsaver";

const useStyles = makeStyles(theme => ({
  paper: {
    boxShadow: "none"
  },
  control: {
    padding: theme.spacing(2)
  }
}));

const saveSvg = () => {
  var svgsaver = new svgSaver(); 
  var svg = document.querySelector("#overlapChart");
  const height = svg.getAttribute("height");
  const width = svg.getAttribute("width");
  // Increase top&bottom margins so chart isn't cropped in some viewers
  const marg = 20;
  svg.setAttribute("viewBox", `0, -${marg/2}, ${width}, ${Number(height) + marg}`);
  svgsaver.asSvg(svg, "rpsychologist-cohend.svg");
  svg.setAttribute("viewBox", `0, 0, ${width}, ${height}`);
};

const Content = ({ openSettings, vizState, toggleDrawer }) => {
  const classes = useStyles();
  const { NNT, CER, U3, propOverlap, CL } = vizState;
  const NNTdata = [CER / 100, 1 / NNT, 1 - (1 / NNT + CER / 100)];

  return (
    <div>
      <Box my={4}>
        <Container maxWidth="lg">
          <Slider
            value={vizState.cohend}
            max={vizState.sliderMax}
            step={vizState.sliderStep}
            openSettings={openSettings}
            handleDrawer={toggleDrawer}
          />
          <ResponsiveChart chart={Cohend} {...vizState} />
          <Button onClick={() => saveSvg()} >Save SVG</Button>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <ResponsiveChart
                  chart={DonutChart}
                  data={[U3, 1 - U3]}
                  formatType={".3p"}
                  className={"donut--two-arcs"}
                />
                <Typography align="center" variant="body1">
                  Cohen's U<sub>3</sub>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <ResponsiveChart
                  chart={DonutChart}
                  data={[propOverlap, 1 - propOverlap]}
                  formatType={".3p"}
                  className={"donut--two-arcs"}
                />
                <Typography align="center" variant="body1">
                  % Overlap
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <ResponsiveChart
                  chart={DonutChart}
                  data={[CL, 1 - CL]}
                  formatType={".3p"}
                  className={"donut--two-arcs"}
                />
                <Typography align="center" variant="body1">
                  Probability of Superiority
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <ResponsiveChart
                  chart={DonutChart}
                  data={NNTdata}
                  label={vizState.NNT}
                  formatType={".3n"}
                  className={"donut--NNT"}
                />
                <Typography align="center" variant="body1">
                  Number Needed to Treat
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};
export default Content;
