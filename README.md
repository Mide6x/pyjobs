## Job Listings Scraper and Frontend

This project is a web application that scrapes job listings from TimesJobs and displays them on a frontend built with React. The backend server uses Express and Cheerio for web scraping, and the frontend leverages Tailwind CSS for styling.

## Features

- Scrape job listings for different categories.
- Display jobs dynamically as they are fetched.
- Filter jobs by category.
- Paginate job listings for easy navigation.
- Styled using Tailwind CSS.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, Cheerio
- **Data Fetching:** Axios
- **Event Streaming:** Server-Sent Events (SSE)

## Installation

### Prerequisites

- Node.js and npm installed on your system.
- Git installed on your system.

### Clone the Repository

```bash
git clone https://github.com/your-username/job-listings-scraper.git
cd job-listings-scraper
```

### Install Dependencies

**Backend:**

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
npm install
```

**Frontend:**

Navigate to the `frontend` directory and install the dependencies:

```bash
cd ../frontend
npm install
```

**Configure Tailwind CSS:**

Ensure that Tailwind CSS is configured correctly in your `postcss.config.cjs` and `tailwind.config.cjs` files. Refer to the configuration files for details.

## Usage

### Start the Backend Server

Navigate to the `server` directory and start the server:

```bash
cd server
npm start
```

The backend server will start running on `http://localhost:5000`.

### Start the Frontend Development Server

Navigate to the `job-scraper` directory and start the development server:

```bash
cd ../job-scraper
npm start
```

The frontend will be available at `http://localhost:3000`.

## Project Structure

```
job-scraper/
├── server/
│   ├── index.js
│   ├── package.json
│   └── ... (other backend files)
│── src/
│   ├── App.js
│   │── index.js
│   └── ... (other frontend files)
│── public/
│── package.json
│── postcss.config.cjs
│── tailwind.config.cjs
├── README.md
└── ... (other root files)
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- TimesJobs for providing the job listings.
- Cheerio for HTML parsing and scraping.
- Tailwind CSS for utility-first CSS framework.
- Express for the web framework for Node.js.
- React for building the user interface.
