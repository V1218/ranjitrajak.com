const INDIA_COUNTRY_CODE = 'IN';
const STORAGE_KEYS = {
    INDIA: 'india_visits',
    OUTSIDE: 'outside_visits',
    TOTAL: 'total_visits'
};
const API_URL = 'https://ipapi.co/json/';
const UPDATE_INTERVAL = 1000; // Update interval in milliseconds

// Function to fetch user's IP info with error handling
async function getVisitorInfo() {
    try {
        const response = await fetch(API_URL, { method: 'GET', cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching visitor info:', error);
        return null;
    }
}

// Function to initialize or get stored counts
function getStoredCounts() {
    return {
        india: parseInt(localStorage.getItem(STORAGE_KEYS.INDIA)) || 0,
        outside: parseInt(localStorage.getItem(STORAGE_KEYS.OUTSIDE)) || 0,
        total: parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL)) || 0
    };
}

// Function to update counts
function updateCounters(visitorCountry, counts) {
    if (visitorCountry === INDIA_COUNTRY_CODE) {
        counts.india += 1;
    } else if (visitorCountry) {
        counts.outside += 1;
    }
    counts.total += 1;

    // Save updated counts
    localStorage.setItem(STORAGE_KEYS.INDIA, counts.india);
    localStorage.setItem(STORAGE_KEYS.OUTSIDE, counts.outside);
    localStorage.setItem(STORAGE_KEYS.TOTAL, counts.total);

    // Update the HTML with animation
    updateCounterDisplay('india_visits', counts.india);
    updateCounterDisplay('outside_visits', counts.outside);
    updateCounterDisplay('total_visits', counts.total);
}

// Function to animate counter display
function updateCounterDisplay(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let currentValue = parseInt(element.innerText) || 0;
    const increment = targetValue > currentValue ? 1 : -1;

    if (currentValue !== targetValue) {
        const interval = setInterval(() => {
            currentValue += increment;
            element.innerText = currentValue;
            if (currentValue === targetValue) {
                clearInterval(interval);
            }
        }, UPDATE_INTERVAL / Math.abs(targetValue - currentValue));
    }
}

// On page load
window.addEventListener('load', async () => {
    const counts = getStoredCounts();
    const visitorInfo = await getVisitorInfo();
    if (visitorInfo && visitorInfo.country_code) {
        updateCounters(visitorInfo.country_code, counts);
    } else {
        console.warn('Could not determine visitor country, updating total only');
        updateCounters(null, counts); // Update total visits even if country detection fails
    }
});