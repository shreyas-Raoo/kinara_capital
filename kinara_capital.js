
/*1. Load Student Details API: Implement an API that retrieves student details from a file(csv/json / any other format)  and returns the data in a paginated manner. The API should accept parameters such as page number and page size to allow pagination.*/


const express = require('express');
const app = express();

// Mock data
const students = [
    { id: 1, name: 'John Doe', totalMarks: 85, grade: 'A' },
    { id: 2, name: 'Jane Smith', totalMarks: 92, grade: 'A+' },
    { id: 3, name: 'Michael Johnson', totalMarks: 78, grade: 'B+' },
    { id: 4, name: 'Emily Davis', totalMarks: 88, grade: 'A-' },
    // Add more student data as needed
];
// API endpoint for retrieving student details with pagination
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of students per page

    // Calculate the start and end index of the students array for the requested page
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Get the students for the requested page
    const pagedStudents = students.slice(startIndex, endIndex);

    res.json({
        page,
        pageSize,
        totalStudents: students.length,
        data: pagedStudents,
    });
});

// API endpoint for filtering student details
app.get('/students/filter', (req, res) => {
    const filterKey = req.query.key; // Column to filter on
    const filterValue = req.query.value; // Value to filter by

    // Filter the students based on the provided column and value
    const filteredStudents = students.filter((student) => {
        return student[filterKey] === filterValue;
    });

    res.json({
        filterKey,
        filterValue,
        totalStudents: filteredStudents.length,
        data: filteredStudents,
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});


/* 2. Server-side Filtering API: Implement server-side filtering functionality in the backend. The filtering mechanism should allow the UI to send filter criteria to the backend API, which will then return the filtered results to the UI.
*/

const express = require('express');
const app = express();

// Mock data
const students = [
    { id: 1, name: 'John Doe', totalMarks: 85, grade: 'A' },
    { id: 2, name: 'Jane Smith', totalMarks: 92, grade: 'A+' },
    { id: 3, name: 'Michael Johnson', totalMarks: 78, grade: 'B+' },
    { id: 4, name: 'Emily Davis', totalMarks: 88, grade: 'A-' },
    // Add more student data as needed
];

// API endpoint for retrieving student details with pagination and filtering
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of students per page

    const filterKey = req.query.filterKey; // Column to filter on
    const filterValue = req.query.filterValue; // Value to filter by

    // Filter the students based on the provided column and value
    let filteredStudents = students;
    if (filterKey && filterValue) {
        filteredStudents = students.filter((student) => {
            return student[filterKey] === filterValue;
        });
    }

    // Calculate the start and end index of the students array for the requested page
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    // Get the students for the requested page
    const pagedStudents = filteredStudents.slice(startIndex, endIndex);

    res.json({
        page,
        pageSize,
        totalStudents: filteredStudents.length,
        data: pagedStudents,
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

/* 3.Developing  UI/*

<!DOCTYPE html>
<html>
<head>
  <title>Student Grid System</title>
  <style>
    /* CSS styles for the grid and filter section */
    /* CSS and HTML file seperatly can also be created in the same folder for better understanding but in this situation i will be using both in one file*/  
    .grid - container {
    display: grid;
    grid - template - columns: repeat(4, 1fr);
    grid - gap: 10px;
    margin - bottom: 10px;
}

    .filter - section {
    margin - bottom: 10px;
}

    .filter - input {
    margin - right: 10px;
}

    /* CSS styles for the pagination */
    .pagination {
    margin - top: 10px;
}

    .pagination - button {
    margin - right: 5px;
}
  </style >
</head >
    <body>
        <div class="filter-section">
            <label for="filterKey">Filter By:</label>
            <select id="filterKey">
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="totalMarks">Total Marks</option>
                <option value="grade">Grade</option>
            </select>
            <input type="text" id="filterValue" placeholder="Filter Value">
                <button onclick="filterStudents()">Filter</button>
        </div>

        <div id="grid" class="grid-container"></div>

        <div id="pagination" class="pagination">
            <button onclick="previousPage()" class="pagination-button">Previous</button>
            <button onclick="nextPage()" class="pagination-button">Next</button>
        </div>

        <script>
            const pageSize = 10; // Number of students per page
            let currentPage = 1; // Current page number

            // Function to fetch student data from the backend API
            async function fetchStudents() {
      const filterKey = document.getElementById('filterKey').value;
            const filterValue = document.getElementById('filterValue').value;
            const url = `/students?page=${currentPage}&pageSize=${pageSize}&filterKey=${filterKey}&filterValue=${filterValue}`;

            try {
        const response = await fetch(url);
            const data = await response.json();
            return data;
      } catch (error) {
                console.error('Error fetching student data:', error);
            return null;
      }
    }

            // Function to render the student grid with the retrieved data
            function renderStudents(students) {
      const grid = document.getElementById('grid');
            grid.innerHTML = '';

      students.forEach((student) => {
        const studentElement = document.createElement('div');
            studentElement.classList.add('grid-item');
            studentElement.textContent = `ID: ${student.id}, Name: ${student.name}, Total Marks: ${student.totalMarks}, Grade: ${student.grade}`;
            grid.appendChild(studentElement);
      });
    }

            // Function to update the UI with pagination information
            function updatePagination(page, pageSize, totalStudents) {
      const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';

            const totalPages = Math.ceil(totalStudents / pageSize);

            const previousButton = document.createElement('button');
            previousButton.textContent = 'Previous';
            previousButton.classList.add('pagination-button');
            previousButton.disabled = page === 1;
      previousButton.onclick = () => {
        if (page > 1) {
                currentPage--;
            fetchAndRenderStudents();
        }
      };
            pagination.appendChild(previousButton);

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.classList.add('pagination-button


