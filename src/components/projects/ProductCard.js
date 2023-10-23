import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const colors = ["#007DFA", "#FF69B4", "#00FF00", "#FFD700", "#FF4500", "#9400D3"];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

const useStyles = makeStyles({
  root: {
    minWidth: 360,
    borderRadius:"9px",
    marginLeft: '10px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  projectLogo: {
    height: '58px',
    width: '58px',
    borderRadius: "5px",
    display: "flex",
    marginBottom: "32px",
    alignItems: "center",
    justifyContent: "center"

  }
});

const ProductCard = ({ project, user }) => {
  const classes = useStyles();
  const [allBugs, setAllBugs] = useState();
  const [resolvedBugs, setResolvedBugs] = useState();
  const solvedTask = Math.floor(Math.random() * 20) + 1
  const totalTask = Math.floor(Math.random() * 20) + solvedTask
  const randomBackgroundColor = getRandomColor();
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate('/bugs/',  { state: { user: user, project: project }});
  };

  useEffect(() => {

    const all_bugs = `${config.baseUrl}/projects/${project.project_id}/all-bugs`
    const resolved_bugs = `${config.baseUrl}/projects/${project.project_id}/resolved-bugs`

    // Fetch data for all bugs
    fetch(all_bugs)
      .then((response) => response.json())
      .then((data) => {
        setAllBugs(data.all_bugs && data.all_bugs.count)})
      .catch((error) => console.error('Error fetching all bugs:', error));

    // Fetch data for resolved bugs
    fetch(resolved_bugs)
      .then((response) => response.json())
      .then((data) => {setResolvedBugs(data.resolved_bugs && data.resolved_bugs.count)})
      .catch((error) => console.error('Error fetching resolved bugs:', error));
  }, []);


  const cardStyle = {
    backgroundColor: randomBackgroundColor, 
  };
  return (
      <Grid item md={4} style={{ paddingRight: "52px", marginTop: "50px", cursor: "pointer"}}>
        <Card className={classes.root} onClick={handleCardClick}>
          <CardContent>
            <div className={classes.projectLogo} style={cardStyle}>
              <img src="/images/Group.png" alt="" />
            </div>
            
            <Typography variant="h6" component="h2">
              {project.project_name}
            </Typography>
            <Typography variant="body2" color='secondary' style={{ marginTop: "10px"}}>
              {project.manager_id}
            </Typography>
            <Typography variant="body2" color='secondary' style={{ marginTop: "10px", marginBottom: "15px"}}>
              Task Done: <span style={{color: "#000"}}>{resolvedBugs || 0} / {allBugs ||0 } </span>
            </Typography>
          </CardContent>
        </Card> 
      </Grid>
  );
}
 
export default ProductCard;