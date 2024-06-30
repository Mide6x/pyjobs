import { useEffect, useState } from "react";
import "./index.css"; // Ensure you import the CSS file

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      const eventSource = new EventSource(`/api/jobs/stream/${filter}`);

      eventSource.onmessage = function (event) {
        if (event.data === "[END]") {
          eventSource.close();
        } else {
          const newJobs = JSON.parse(event.data);
          setJobs((prevJobs) => [...prevJobs, ...newJobs]);
        }
      };

      eventSource.onerror = function (err) {
        console.error("EventSource failed:", err);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    };

    fetchJobs();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setJobs([]);
    setFilter(newFilter);
    setCurrentPage(1);
  };

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
      <div className="mb-4">
        <button
          onClick={() => handleFilterChange("python")}
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
        >
          Python Jobs
        </button>
        <button
          onClick={() => handleFilterChange("software")}
          className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
        >
          Software Engineer Jobs
        </button>
        <button
          onClick={() => handleFilterChange("sales")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sales Jobs
        </button>
      </div>
      {currentJobs.length > 0 ? (
        <>
          <ul className="space-y-4">
            {currentJobs.map((job, index) => (
              <li key={index} className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">{job.jobTitle}</h2>
                <p>
                  <strong>Company:</strong> {job.companyName}
                </p>
                <p>
                  <strong>Skills Required:</strong> {job.skillsRequired}
                </p>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Apply Here
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
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
