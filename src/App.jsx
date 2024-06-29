import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Calculate the jobs to display for the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <h1>Job Listings</h1>
      {currentJobs.length > 0 ? (
        <>
          <ul>
            {currentJobs.map((job, index) => (
              <li key={index}>
                <h2>{job.jobTitle}</h2>
                <p>
                  <strong>Company:</strong> {job.companyName}
                </p>
                <p>
                  <strong>Skills Required:</strong> {job.skillsRequired}
                </p>
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  Apply Here
                </a>
              </li>
            ))}
          </ul>
          <div>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              {" "}
              Page {currentPage} of {totalPages}{" "}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>Loading jobs...</p>
      )}
    </div>
  );
};

export default App;
