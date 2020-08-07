import React, { useState } from 'react';
import useFetchJobs from './useFetchJobs';
import './App.css';
import { Container } from 'react-bootstrap';
import Job from './Job';
import JobPagination from './JobPagination';
import SearchForm from './SearchForm';

function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState(false);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  const handleParamChange = e => {
    const param = e.target.name;
    let value = e.target.value;
    if(param === "full_time") {
      // console.log(e.target.checked);
      value = e.target.checked;
      setChecked(value);
    } 
    setPage(1);
    setParams(prevParams => {
      return { ...prevParams, [param]: value}
    });
    // setParams({ 
    //     ...params, [param]: value
    // });
  }

  let jobList = jobs.map( job => <Job key={job.id} job={job}></Job> );
  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} checked={checked} />
      <JobPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      {loading && <h1 className="mb-4">Loading...</h1>}
      {error && <h1 className="mb-4">Error! Try refreshing.</h1>}
      { jobList }
      <JobPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  )
}

export default App;
