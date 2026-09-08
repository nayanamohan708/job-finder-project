async function loadJobs() {

    try {

        const response = await fetch("http://localhost:5000/jobs");
        const jobs = await response.json();

        displayJobs(jobs);

    } catch (error) {

        document.getElementById("jobResults").innerHTML =
            "<p>Backend connection failed!</p>";

    }
}


function searchJobs() {

    let searchText =
        document.getElementById("searchInput").value.toLowerCase();

    let locationText =
        document.getElementById("locationInput").value.toLowerCase();

    fetch("http://localhost:5000/jobs")
        .then(response => response.json())
        .then(jobs => {

            let results = jobs.filter(function(job) {

                return (
                    (searchText === "" ||
                    job.title.toLowerCase().includes(searchText) ||
                    job.company.toLowerCase().includes(searchText) ||
                    job.location.toLowerCase().includes(searchText))
                    &&
                    (locationText === "" ||
                    job.location.toLowerCase().includes(locationText))
                );

            });

            displayJobs(results);

        })
        .catch(error => {

            document.getElementById("jobResults").innerHTML =
                "<p>Backend connection failed!</p>";

        });
}


function displayJobs(jobs) {

    let output = "";

    jobs.forEach(function(job) {

        output += `
            <div class="job-card">

                <h3>${job.title}</h3>

                <p>Company: ${job.company}</p>

                <p>Location: ${job.location}</p>

                <p>Salary: ${job.salary}</p>

                <p>${job.description}</p>

                <button onclick="viewDetails(
                    '${job._id}',
                    '${job.title}',
                    '${job.company}',
                    '${job.location}',
                    '${job.salary}',
                    '${job.description}'
                )">
                    View Details
                </button>

                <button class="apply-btn"
                    onclick="applyJob('${job._id}', '${job.title}', '${job.company}')">
                    Apply Now
                </button>

            </div>
        `;

    });

    document.getElementById("jobResults").innerHTML = output;
}


function viewDetails(jobId, title, company, location, salary, description) {

    localStorage.setItem("jobId", jobId);
    localStorage.setItem("jobTitle", title);
    localStorage.setItem("jobCompany", company);
    localStorage.setItem("jobLocation", location);
    localStorage.setItem("jobSalary", salary);
    localStorage.setItem("jobDescription", description);

    window.location.href = "job-details.html";
}


async function applyJob(jobId, jobTitle, company) {

    let applicantEmail = prompt("Enter your email:");

    if (!applicantEmail) {
        return;
    }

    try {

        const response = await fetch("http://localhost:5000/applications", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                jobId: jobId,
                jobTitle: jobTitle,
                company: company,
                applicantEmail: applicantEmail
            })

        });

        const data = await response.json();

        alert(data.message);

    } catch (error) {

        alert("Application failed!");

    }
}


loadJobs();
function logout() {
    alert("Logged out successfully!");
    window.location.href = "login.html";
}