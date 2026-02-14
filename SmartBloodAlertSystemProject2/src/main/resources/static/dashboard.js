// Load all dashboard data when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadTotalDonors();
    loadActiveDonors();
    loadTotalDonations();
    loadEmergencyRequests();
    loadBloodGroupAvailability();
});

// Animate number counting
function animateNumber(element, finalValue) {
    let currentValue = 0;
    const increment = Math.ceil(finalValue / 30);
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = currentValue;
        }
    }, 30);
}

// Fetch Total Donors
function loadTotalDonors() {
    fetch('/admin/total-donors')
        .then(response => response.json())
        .then(data => {
            const element = document.getElementById('total-donors');
            animateNumber(element, data);
        })
        .catch(error => {
            console.error('Error loading total donors:', error);
            document.getElementById('total-donors').textContent = '-';
        });
}

// Fetch Active Donors
function loadActiveDonors() {
    fetch('/admin/active-donors')
        .then(response => response.json())
        .then(data => {
            const element = document.getElementById('active-donors');
            animateNumber(element, data);
        })
        .catch(error => {
            console.error('Error loading active donors:', error);
            document.getElementById('active-donors').textContent = '-';
        });
}

// Fetch Total Donations
function loadTotalDonations() {
    fetch('/admin/total-donations')
        .then(response => response.json())
        .then(data => {
            const element = document.getElementById('total-donations');
            animateNumber(element, data);
        })
        .catch(error => {
            console.error('Error loading total donations:', error);
            document.getElementById('total-donations').textContent = '-';
        });
}

// Fetch Emergency Requests Count
function loadEmergencyRequests() {
    fetch('/admin/emergency-requests')
        .then(response => response.json())
        .then(data => {
            // Count array length
            const count = Array.isArray(data) ? data.length : 0;
            const element = document.getElementById('emergency-requests');
            animateNumber(element, count);
        })
        .catch(error => {
            console.error('Error loading emergency requests:', error);
            document.getElementById('emergency-requests').textContent = '-';
        });
}

// Fetch and Display Blood Group Availability
function loadBloodGroupAvailability() {
    fetch('/admin/blood-group-availability')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('blood-group-table');
            tableBody.innerHTML = ''; // Clear loading message
            
            // Loop through JSON keys dynamically
            let delay = 0;
            for (const bloodGroup in data) {
                if (data.hasOwnProperty(bloodGroup)) {
                    const availableCount = data[bloodGroup];
                    
                    // Create table row
                    const row = document.createElement('tr');
                    row.className = 'fade-in';
                    row.style.animationDelay = delay + 's';
                    delay += 0.1;
                    
                    // Blood Group cell with badge
                    const bloodGroupCell = document.createElement('td');
                    const badge = document.createElement('span');
                    badge.className = 'blood-group-badge';
                    badge.textContent = bloodGroup;
                    bloodGroupCell.appendChild(badge);
                    
                    // Available Donors cell
                    const countCell = document.createElement('td');
                    const countSpan = document.createElement('span');
                    countSpan.className = 'donor-count';
                    countSpan.textContent = availableCount;
                    countCell.appendChild(countSpan);
                    
                    // Add cells to row
                    row.appendChild(bloodGroupCell);
                    row.appendChild(countCell);
                    
                    // Add row to table
                    tableBody.appendChild(row);
                }
            }
            
            // If no data, show message
            if (Object.keys(data).length === 0) {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.colSpan = 2;
                cell.className = 'text-center text-muted';
                cell.textContent = 'No blood group data available';
                row.appendChild(cell);
                tableBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error loading blood group availability:', error);
            const tableBody = document.getElementById('blood-group-table');
            tableBody.innerHTML = '<tr><td colspan="2" class="text-center text-danger">⚠️ Error loading data</td></tr>';
        });
}
