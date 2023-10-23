import Navbar from "../../components/navbar/navbar";
import Header from "../../components/projects/header";
import { Container, Grid, Typography } from "@material-ui/core";
import { useEffect, useState, useRef } from "react";
import ProductCard from "../../components/projects/ProductCard";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import config from '../../config'


function fetchUserProjects(user_id, token) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const requestOptions = {
    method: 'GET',
    headers: headers,
  };
  const api_endpoint = `${config.baseUrl}/users/${user_id}/projects`;
  console.log("from index")
  return fetch(api_endpoint, requestOptions)
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      return response.json();
    })
    .then((data) => data.userProjects)
    .catch((error) => {
      console.log('API request failed:', error);
      throw error;
    });
}

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state && location.state.user;
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const handleProjectUpdate = (updatedProjects) => {
    setProjects(updatedProjects);
  };

  const isApiCallInitiated = useRef(false);

  useEffect(() => {
    const loaderTimeout = 500;

    if (!user) {
      const errorMessage = "Not Authorized, Kindly Login to access this page";
      setError(errorMessage);
      console.log("Error:", errorMessage);
      navigate('/login', { state: { error: errorMessage } });
      return;
    } 

    if (projects.length === 0 && !isApiCallInitiated.current) {
      isApiCallInitiated.current = true;
    const user_id = user.user_id;

    fetchUserProjects(user_id, user.access_token)
      .then((projects) => {
        setTimeout(() => {
          if (projects && projects.length === 0) {
            setProjects([]);
          } else {
            setProjects(projects);
          }
          setIsLoading(false);
        }, loaderTimeout);
      })
      .catch((error) => {
        if (error.message === 'Unauthorized') {
          const errorMessage = "Not Authorized, Kindly Login to access this page";
          setError(errorMessage);
          console.log("Error:", errorMessage);
          navigate('/login', { state: { error: errorMessage } });
        } else {
          setError(error);
          setIsLoading(false);
        }
      });
    }
  }, [user, navigate]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (event, page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',    
          height: '100vh',        
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return ( 
    <Container style={{ paddingLeft: "200px", paddingRight: "200px", maxWidth: "100%", backgroundColor: "#F5F6F8",  paddingBottom: "70px"}}>
      <Navbar user={user}/>
      <Header user={user} onProjectUpdate={handleProjectUpdate}/>

      <Grid container style={{marginLeft:"10px",justifyContent: "space-around"}}>
      {currentProjects && currentProjects.length > 0 ? (
        currentProjects.map((project, index) => (
          <ProductCard project={project} key={index} user={user} />
        ))
      ) : (
        <Typography variant="h3" color="secondary" style={{ marginTop: "200px", height:"100%"}}>No Projects Found</Typography>
      )}
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {projects.length > projectsPerPage && (
          <Pagination
            count={Math.ceil(projects.length / projectsPerPage)}
            page={currentPage}
            onChange={paginate}
            shape="rounded"
          />
        )}
      </div>
   
  </Container>
   );
}
 
export default Projects;