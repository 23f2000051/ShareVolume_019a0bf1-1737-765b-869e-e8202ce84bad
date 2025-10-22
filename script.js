async function fetchData(cik) {
    const url = `https://data.sec.gov/api/xbrl/companyconcept/${cik}/dei/EntityCommonStockSharesOutstanding.json`;
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Bio-Techne Stock Data Fetcher - your_email@example.com' }
        });
        if (!response.ok) throw new Error('Failed to fetch data.');
        const data = await response.json();
        processSharesData(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading data. Please try again.');
    }
}

function processSharesData(data) {
    const entityName = data.entityName;
    const shares = data.units.shares.filter(entry => entry.fy > '2020' && !isNaN(entry.val));
    if (shares.length === 0) {
        console.warn('No valid data found.');
        showEmptyState();
        return;
    }
    const max = shares.reduce((a, b) => a.val > b.val ? a : b);
    const min = shares.reduce((a, b) => a.val < b.val ? a : b);
    document.getElementById('share-entity-name').textContent = entityName;
    document.getElementById('share-max-value').textContent = max.val;
    document.getElementById('share-max-fy').textContent = max.fy;
    document.getElementById('share-min-value').textContent = min.val;
    document.getElementById('share-min-fy').textContent = min.fy;
    document.title = `${entityName} - Company Stock Data`;
}

function showEmptyState() {
    document.getElementById('share-max-value').textContent = 'N/A';
    document.getElementById('share-max-fy').textContent = 'N/A';
    document.getElementById('share-min-value').textContent = 'N/A';
    document.getElementById('share-min-fy').textContent = 'N/A';
}

function init() {
    const params = new URLSearchParams(window.location.search);
    const cik = params.get('CIK') || '0000842023';
    fetchData(cik);
}

document.addEventListener('DOMContentLoaded', init);