import Grid from '@material-ui/core/Grid';


const LeftPane = () => {
  return ( 
    <Grid item md={6}>
    <img src="/Left.png" 
    alt="" 
    style={{ height: '100%', maxWidth: '100%', display: 'block' }}
    />
  </Grid>
   );
}
 
export default LeftPane;