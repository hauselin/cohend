import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { Typography, makeStyles } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    paddingBottom: "2em"
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular
  },
  content: {
    minWidth: "100%"
  }
}));

const FaqPage = React.memo(() => {
  const classes = useStyles();
  const data = useStaticQuery(
    graphql`
      query {
        allMdx(
          filter: { fileAbsolutePath: { regex: "/FAQ/" } }
          sort: { fields: frontmatter___order, order: ASC }
        ) {
          edges {
            node {
              id
              body
              frontmatter {
                title
                order
              }
            }
          }
          totalCount
        }
      }
    `
  );

  return (
    <div className={classes.root}>
      {data.allMdx.edges.map(({ node }) => (
        <ExpansionPanel key={node.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`FAQ-${node.id}`}
            id={`FAQ-${node.id}`}
          >
            <Typography className={classes.heading}>
              {node.frontmatter.title}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography
              variant="body1"
              component="div"
              className={classes.content}
            >
            <MDXRenderer>{ node.body}</MDXRenderer>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
});

export default FaqPage;
