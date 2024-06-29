import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

const urls = {
  python: (page) =>
    `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&searchTextSrc=as&searchTextText=Python&txtKeywords=Python&txtLocation=&sequence=${page}&startPage=${page}`,
  software: (page) =>
    `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&searchTextSrc=ft&searchTextText=&txtKeywords=Software+Developer&txtLocation=&sequence=${page}&startPage=${page}`,
  sales: (page) =>
    `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&searchTextSrc=&searchTextText=&txtKeywords=sales&txtLocation=&sequence=${page}&startPage=${page}`,
};

const fetchJobsFromPage = async (page, type) => {
  try {
    const { data } = await axios.get(urls[type](page));
    const $ = cheerio.load(data);
    const newJobs = [];

    $("li.clearfix.job-bx.wht-shd-bx").each((index, element) => {
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

    return newJobs;
  } catch (error) {
    console.error(
      `Error occurred while fetching job details from page ${page} for ${type}:`,
      error
    );
    return [];
  }
};

const fetchJobs = async (type, res) => {
  try {
    let page = 1;
    let totalJobs = 0;
    let consecutiveEmptyPages = 0;

    while (totalJobs < 700) {
      const jobsFromPage = await fetchJobsFromPage(page, type);
      if (jobsFromPage.length === 0) {
        consecutiveEmptyPages++;
        if (consecutiveEmptyPages >= 5) break; // Stop if no more jobs are found for 5 consecutive pages
      } else {
        consecutiveEmptyPages = 0;
        totalJobs += jobsFromPage.length;

        // Send jobs to client as they are fetched
        res.write(`data: ${JSON.stringify(jobsFromPage)}\n\n`);
      }

      page += 1;
    }

    // Close the SSE connection
    res.write("data: [END]\n\n");
    res.end();
  } catch (error) {
    console.error(
      `Error occurred while fetching job details for ${type}:`,
      error
    );
    res.status(500).send("Error occurred while fetching job details");
  }
};

// SSE endpoint to send job updates
app.get("/api/jobs/stream/:type", (req, res) => {
  const { type } = req.params;
  if (!urls[type]) {
    return res.status(400).send("Invalid job type");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  fetchJobs(type, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
