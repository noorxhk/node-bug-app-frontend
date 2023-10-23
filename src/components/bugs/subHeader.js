import {Container, Divider, Grid, Typography } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  textField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    height: '100%'
  },
  text: {
    fontSize: "14px",
    fontWeight: "400",
  },
  button: {
    marginLeft: '20px',
    textTransform: "none",
    marginTop: '22px',
    height:"45px",
    backgroundColor: "#007DFA",
    color: "#FFFF",
    "&:hover": {
      backgroundColor: "#4169E1", 
    },
  },
  searchField: {
    border: '1px solid #DDE2E4',
    borderRadius: '5px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
  }
}));


const SubHeader = () => {
  const classes = useStyles();
  return (  
    <Container style={{maxWidth: "100%"}}>
      <Grid container style={{ marginTop: "20px"}}>
        <Grid item md={3}>
          <div className={classes.searchField}>
            <SearchIcon style={{ margin: '0 8px' }} color="secondary" />
            <TextField
              placeholder="Search"
              InputProps={{ disableUnderline: true }}
              fullWidth
            />
          </div>
        </Grid>
        <Grid item md={2} ></Grid>
        <Grid item md={1}>
          <div className={classes.textField}>
            <Typography className={classes.text}> Subtasks</Typography>
            <KeyboardArrowDownIcon/>
          </div>
        </Grid>
        <Grid item md={1} style={{marginLeft: "60px"}}>
          <div className={classes.textField}>
            <Typography className={classes.text}> Me</Typography>
            <KeyboardArrowDownIcon/>
          </div>
        </Grid>
        <Grid item md={1} style={{marginLeft: "20px"}}>
          <div className={classes.textField}>
            <Typography className={classes.text}> Assignees</Typography>
            <KeyboardArrowDownIcon/>
          </div>
        </Grid>
        <Grid item md={3} container alignItems="center"justifyContent="flex-end">
          <img src="/images/bug_menu.png" alt="" />
          <img src="/images/bug_sort.png" alt=""  style={{ marginLeft: '8px'}}/>
          <img src="/images/bug_group.png" alt="" style={{ marginLeft: '8px'}}/>
        </Grid>
      </Grid>
      <Divider style={{ marginTop: "20px"}}/>
    </Container>
  );
}
 
export default SubHeader;