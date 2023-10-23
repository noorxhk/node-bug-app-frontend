import Navbar from "../../components/navbar/navbar";
import { useEffect, useState,useRef } from "react";
import { Container, Typography } from "@material-ui/core";
import BugHeader from "../../components/bugs/header";
import SubHeader from "../../components/bugs/subHeader";
import BugTable from "../../components/bugs/bugTable";
import { useLocation } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import config from "../../config";



const Bugs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state && location.state.user;
  const project = location.state && location.state.project;
  const [bugs, setBugs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bugsPerPage = 10;

  const handleBugUpdate = (updatedBugs) => {
    setBugs(updatedBugs);
  };

  const isApiCallInitiated = useRef(false);

  useEffect(() => {
    const loaderTimeout = 500;
    
    if (!user || !user.access_token) {
      const errorMessage = "Not Authorized, Kindly Login to access this page";
      setError(errorMessage);
      console.log("Error:", errorMessage);
      navigate('/login', { state: { error: errorMessage } });
      return;
    }
    if (bugs.length === 0 && !isApiCallInitiated.current) {
      isApiCallInitiated.current = true;
    const user_id = user.user_id;

    
    
    const headers = {
      Authorization: `Bearer ${user.access_token}` 
    };

    const api_endpoint = `${config.baseUrl}/projects/${project.project_id}/bugs`

    fetch(api_endpoint, {
      method: 'GET',
      headers: headers
    })
    .then((response) => {
      if (response.status === 401) {
        const errorMessage = "Not Authorized, Kindly Login to access this page";
        setError(errorMessage);
        console.log("Error:", errorMessage);
        navigate('/login', { state: { error: errorMessage } });
        return;
      }
      return response.json();
    })
      .then((data) => {
        setTimeout(() => {
          if (data && data.success === false){
            setBugs([]);
          } else {
          setBugs(data && data.bugs);
          }
        setIsLoading(false);
      }, loaderTimeout)
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
    }
  }, [project, user]);

  const indexOfLastBug = currentPage * bugsPerPage;
  const indexOfFirstBug = indexOfLastBug - bugsPerPage;
  const currentBugs = bugs.slice(indexOfFirstBug, indexOfLastBug);

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

    <Container style={{ paddingLeft: "200px", paddingRight: "200px", maxWidth: "100%"}}>
      <Navbar user={user}/>
      <BugHeader project={project} user={user} onBugUpdate={handleBugUpdate}/>
      <SubHeader/>
      {currentBugs && currentBugs.length > 0 ? (
        <BugTable bugs={currentBugs} onBugUpdate={handleBugUpdate} />
      ) : (
        <div>
          {bugs.length > 0 ? (
            <BugTable bugs={bugs} onBugUpdate={handleBugUpdate} />
          ) : (
            <Typography variant="h3" color="secondary" style={{ marginTop: "200px", width: "100%", textAlign: "center" }}>
              No Bugs Found
            </Typography>
          )}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {bugs.length > bugsPerPage && (
          <Pagination
            count={Math.ceil(bugs.length / bugsPerPage)}
            page={currentPage}
            onChange={paginate}
            shape="rounded"
          />
        )}
      </div>
    </Container>

  );
}
 
export default Bugs
;