import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

let jobs = [];

// Function to fetch jobs
const fetchJobs = async () => {
  try {
    const { data } = await axios.get(
      "https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&searchTextSrc=as&searchTextText=Python&txtKeywords=Python&txtLocation="
    );
    const $ = cheerio.load(data);
    const newJobs = [];

    $("li.clearfix.job-bx.wht-shd-bx").each((index, element) => {
      if (newJobs.length >= 90) return false; // Limit to 90 jobs

      const datePosted = $(element).find("span.sim-posted span").text();
      if (datePosted.includes("few")) {
        const jobTitle = $(element).find("header.clearfix h2").text().trim();
        const companyName = $(element)
          .find("h3.joblist-comp-name")
          .text()
          .trim();
        const skillsRequired = $(element).find("span.srp-skills").text().trim();
        const link = $(element).find("a").attr("href");

        newJobs.push({
          jobTitle,
          companyName,
          skillsRequired,
          link,
        });
      }
    });

    jobs = newJobs;
    console.log(`Fetched ${newJobs.length} jobs`);
  } catch (error) {
    console.error("Error occurred while fetching job details:", error);
  }
};

// Fetch jobs every 2 hours
setInterval(fetchJobs, 2 * 60 * 60 * 1000);

// Fetch jobs immediately on server start
fetchJobs();

app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
