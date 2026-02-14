// ===================================
// SMART BLOOD ALERT SYSTEM - JAVASCRIPT
// ===================================

// Blood Availability Data (Demo Data - Replace with API later)
const bloodAvailability = [
    { group: 'A+', status: 'available', units: 45 },
    { group: 'A-', status: 'low', units: 8 },
    { group: 'B+', status: 'available', units: 32 },
    { group: 'B-', status: 'urgent', units: 2 },
    { group: 'AB+', status: 'available', units: 18 },
    { group: 'AB-', status: 'low', units: 5 },
    { group: 'O+', status: 'available', units: 56 },
    { group: 'O-', status: 'urgent', units: 3 }
];

// Motivational Quotes
const quotes = [
    "A single blood donation can save up to three lives.",
    "Not all heroes wear capes. Some donate blood.",
    "Blood donors are life savers.",
    "Give blood, give life. The gift that keeps on beating.",
    "Your blood type doesn't matter. Your willingness to donate does.",
    "Be someone's hero. Donate blood today.",
    "Every two seconds, someone needs blood. Be the reason they survive.",
    "Blood donation: A small act of kindness with a lifetime of impact."
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initStatCounters();
    initBloodAvailability();
    initQuoteRotation();
    addInteractiveEffects();
    // Start periodic updates
    setInterval(updateDonorCount, 30000); // 30s
    setInterval(updateBloodAvailability, 30000); // 30s
    // Form validation removed - forms exist on separate pages
});

// ===================================
// Blood Availability Display (Real-time)
// ===================================
async function fetchBloodAvailability() {
    const url = '/api/donor/availability?t=' + Date.now();
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching blood availability:', error);
    }
    return null;
}

function getStatusFromUnits(units) {
    if (units < 2) return { status: 'urgent', text: 'Urgent' };
    if (units < 5) return { status: 'low', text: 'Low' };
    return { status: 'available', text: 'Available' };
}

async function updateBloodAvailability() {
    const data = await fetchBloodAvailability();
    if (!data) return;

    const container = document.getElementById('bloodAvailability');
    if (!container) return;

    container.innerHTML = '';

    // Sort keys alphabetically or in a specific order if desired
    const groups = Object.keys(data).sort();

    groups.forEach((group, index) => {
        const units = data[group];
        const { status, text } = getStatusFromUnits(units);

        const bloodItem = document.createElement('div');
        bloodItem.className = 'blood-item-premium';
        bloodItem.style.animation = `fadeInUp 0.6s ease ${index * 0.05}s both`;

        bloodItem.innerHTML = `
            <div class="blood-group-label">
                <span class="blood-type">${group}</span>
                <i class="fas fa-tint blood-icon"></i>
            </div>
            <div class="blood-status">
                <span class="status-badge-premium status-${status}">${text}</span>
                <span class="units-text">${units} units</span>
            </div>
        `;

        bloodItem.setAttribute('title', `${group}: ${units} units available - ${text}`);
        container.appendChild(bloodItem);
    });
}

function initBloodAvailability() {
    updateBloodAvailability();
}

// ===================================
// Animated Statistics Counters
// ===================================
async function fetchTotalDonors() {
    const url = '/api/donor/count?t=' + Date.now();
    console.log('Fetching donor count from:', url);
    try {
        const response = await fetch(url);
        console.log('Response status:', response.status);
        if (response.ok) {
            const rawData = await response.text();
            console.log('Raw data received:', rawData);
            const count = parseInt(rawData);
            if (!isNaN(count)) {
                return count;
            }
            console.error('Failed to parse donor count:', rawData);
        } else {
            console.error('Failed to fetch donor count. Status:', response.status);
        }
    } catch (error) {
        console.error('Error fetching donor count:', error);
    }
    return null;
}

async function updateDonorCount() {
    const count = await fetchTotalDonors();
    if (count !== null) {
        const donorCounter = document.getElementById('totalDonorCount');
        if (donorCounter) {
            donorCounter.setAttribute('data-target', count);
            donorCounter.textContent = count + '+';
        }
        const heroCounter = document.getElementById('heroDonorCount');
        if (heroCounter) {
            heroCounter.textContent = `Trusted by ${count}+ Donors`;
        }
    }
}

async function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');

    // Fetch real-time count for donors before starting animation
    const liveCount = await fetchTotalDonors();
    if (liveCount !== null) {
        const donorCounter = document.getElementById('totalDonorCount');
        if (donorCounter) {
            donorCounter.setAttribute('data-target', liveCount);
        }
        const heroCounter = document.getElementById('heroDonorCount');
        if (heroCounter) {
            heroCounter.textContent = `Trusted by ${liveCount}+ Donors`;
        }
    } else {
        // Fallback if fetch fails
        const heroCounter = document.getElementById('heroDonorCount');
        if (heroCounter) {
            heroCounter.textContent = `Join our Donor Network`;
        }
    }

    const speed = 200; // Animation speed

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (target === 0) {
            counter.textContent = '0+';
            return;
        }
        // Ensure increment is at least 1 so it actually animates/reaches target
        const increment = Math.max(1, target / speed);
        let current = 0;

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target + '+';
            }
        };

        updateCounter();
    };

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===================================
// Quote Rotation
// ===================================
function initQuoteRotation() {
    const quoteElement = document.getElementById('motivationalQuote');
    let currentIndex = 0;

    // Display first quote
    quoteElement.textContent = quotes[currentIndex];

    // Rotate quotes every 5 seconds
    setInterval(() => {
        quoteElement.style.opacity = '0';
        quoteElement.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % quotes.length;
            quoteElement.textContent = quotes[currentIndex];
            quoteElement.style.opacity = '1';
            quoteElement.style.transform = 'translateY(0)';
        }, 300);
    }, 5000);

    // Add smooth transition
    quoteElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ===================================
// Form Validation - NOT NEEDED
// Forms exist on separate pages
// ===================================
// Removed - Donor and Blood Request forms are on separate pages
// This homepage only provides navigation

// ===================================
// Success Message Display
// ===================================
function showSuccessMessage(title, message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
             style="z-index: 9999; min-width: 300px;" role="alert">
            <strong><i class="fas fa-check-circle me-2"></i>${title}</strong>
            <p class="mb-0 mt-2">${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', alertHTML);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// ===================================
// Interactive Effects
// ===================================
function addInteractiveEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add hover effect to blood items
    const bloodItems = document.querySelectorAll('.blood-item');
    bloodItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// Real-time Blood Availability Update
// (Simulated - Replace with WebSocket/API)
// ===================================
function simulateRealTimeUpdates() {
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * bloodAvailability.length);
        const randomChange = Math.floor(Math.random() * 5) - 2; // -2 to +2

        bloodAvailability[randomIndex].units = Math.max(0, bloodAvailability[randomIndex].units + randomChange);

        // Update status based on units
        if (bloodAvailability[randomIndex].units < 5) {
            bloodAvailability[randomIndex].status = 'urgent';
        } else if (bloodAvailability[randomIndex].units < 15) {
            bloodAvailability[randomIndex].status = 'low';
        } else {
            bloodAvailability[randomIndex].status = 'available';
        }

        // Refresh display
        document.getElementById('bloodAvailability').innerHTML = '';
        initBloodAvailability();
    }, 10000); // Update every 10 seconds
}

// Uncomment to enable real-time simulation
// simulateRealTimeUpdates();

// ===================================
// Form Helper Functions - NOT NEEDED
// ===================================
// Removed - Forms are on separate pages (/donor/register and /blood/request)
// This homepage only handles navigation and information display

// ===================================
// Emergency Contact - Quick Call
// ===================================
function callEmergencyHotline() {
    const confirmation = confirm('Do you want to call the Emergency Blood Hotline?\n1-800-BLOOD-HELP');
    if (confirmation) {
        window.location.href = 'tel:1-800-BLOOD-HELP';
    }
}

// ===================================
// Auto-save Feature - NOT NEEDED
// ===================================
// Removed - Forms exist on /donor/register and /blood/request pages

// ===================================
// Accessibility Enhancements
// ===================================
function enhanceAccessibility() {
    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            // Close all modals on ESC
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                bootstrap.Modal.getInstance(modal)?.hide();
            });
        }
    });

    // Announce dynamic content changes to screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    window.announceToScreenReader = function (message) {
        liveRegion.textContent = message;
        setTimeout(() => liveRegion.textContent = '', 1000);
    };
}

enhanceAccessibility();

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🩸 Smart Blood Alert System', 'color: #dc3545; font-size: 20px; font-weight: bold;');
console.log('%cSave Lives, Donate Blood', 'color: #28a745; font-size: 14px;');
console.log('%cVersion 1.0 | Ready to Connect Donors with Patients', 'color: #6c757d; font-size: 12px;');
