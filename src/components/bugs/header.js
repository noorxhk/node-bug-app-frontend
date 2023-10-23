import { Button, Container, Divider, Grid, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import BugAdd from "./bugAdd";


const useStyles = makeStyles((theme) => ({
  badge: {
    backgroundColor: "#FDF2F2",
    color: "#EC5962",
    verticalAlign: "text-bottom",
    marginTop: "8px",
    padding: '4.5px 8.5px',
    justifyContent: "center",
    alignItems: "center",
    height:"25.5px",
    borderRadius:"4.25px",
    marginLeft: "24px" 
  },
  button: {
    marginLeft: '8px',
    textTransform: "none",
    height:"40px",
    width: "133px",
    backgroundColor: "#007DFA",
    color: "#FFFF",
    "&:hover": {
      backgroundColor: "#4169E1", 
    },
  },
}));

const BugHeader = ({project, user, onBugUpdate}) => {
  const classes = useStyles()
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (  
    
    <Container style={{ maxWidth: '100%', marginTop: "30px" }}>
      <Grid container>
        <Grid item md={6}>
          <Typography color="secondary" style={{ fontSize: "12px"}}>
            Projects &gt; <span style={{ color: "#000"} }>{project.project_name}</span>
          </Typography>
          <div style={{  display: "flex"}}>
            <Typography variant="h4" style={{ fontWeight: "700"}}>
              All bugs listing
            </Typography>
            <Typography className={classes.badge}>
              Bugs
            </Typography>
          </div>
        </Grid>
        <Grid item md={6} container alignItems="center"justifyContent="flex-end" style={{ marginTop: "12px",  paddingRight: "50px"}}>
          <img src="/images/setting.png" alt="" />
          <img src="/images/more.png" alt="" />
          <Button  size="large"  className={classes.button} onClick={openModal}>
              + New Task
            </Button>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: '30px' }}/>
      <BugAdd open={isModalOpen} onClose={closeModal} user={user} project={project} onBugUpdate={onBugUpdate} />
    </Container>
  );
}
 
export default BugHeader;