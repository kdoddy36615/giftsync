// Global state
let currentTab = 'emily';
let selections = {
    emily: new Set(),
    lucas: new Set()
};
let completed = {
    emily: new Set(),
    lucas: new Set()
};

// Load selections from localStorage on init
function loadSelections() {
    Object.keys(giftData).forEach(person => {
        const saved = localStorage.getItem(`selections-${person}`);
        if (saved) {
            selections[person] = new Set(JSON.parse(saved));
        }
        const savedCompleted = localStorage.getItem(`completed-${person}`);
        if (savedCompleted) {
            completed[person] = new Set(JSON.parse(savedCompleted));
        }
    });
}

// Save selections to localStorage
function saveSelections(person) {
    localStorage.setItem(`selections-${person}`, JSON.stringify([...selections[person]]));
}

// Save completed items to localStorage
function saveCompleted(person) {
    localStorage.setItem(`completed-${person}`, JSON.stringify([...completed[person]]));
}

// Switch between tabs
function switchTab(person) {
    currentTab = person;

    // Update app card color theme
    const appCard = document.getElementById('appCard');
    appCard.classList.remove('emily-active', 'lucas-active');
    appCard.classList.add(`${person}-active`);

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tab-btn').classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${person}-tab`).classList.add('active');

    // Update filter buttons to work with current tab
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons[0].classList.add('active'); // Set "All" as active

    // Re-render to reflect current tab's state
    renderItems(person);
    updateSelection(person);
}

// Render items for a specific person
function renderItems(person) {
    const tbody = document.getElementById(`${person}-itemsTable`);
    tbody.innerHTML = '';

    const items = giftData[person];

    items.forEach((item, index) => {
        const pricesHTML = item.prices.map(p => {
            const priceClass = p.best ? 'price best' : 'price';
            return `
                <div class="price-item">
                    <a href="${p.url}" target="_blank">
                        <div class="store-name">${p.store}</div>
                        <div class="${priceClass}">$${p.price}</div>
                    </a>
                </div>
            `;
        }).join('');

        // Add Google search icon
        const googleSearchHTML = `
            <div class="google-icon">
                <a href="https://www.google.com/search?q=${encodeURIComponent(item.googleSearch)}" target="_blank" onclick="event.stopPropagation()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                </a>
            </div>
        `;

        const priorityTag = item.priority ? '<span class="priority-tag">ORDER SOON</span>' : '';
        const valueTag = item.value === 'HIGH' ? '<span class="value-tag">HIGH VALUE</span>' : '';
        const dropTag = item.drop ? `<span class="drop-tag">${item.drop}</span>` : '';

        // Create button group for research and images
        let buttonsHTML = '';
        if (item.hasResearch || item.productImages) {
            buttonsHTML = '<div class="item-buttons">';
            if (item.hasResearch) {
                buttonsHTML += `<span class="research-toggle" onclick="event.stopPropagation(); toggleResearch('${person}', ${index})">More Information</span>`;
            }
            if (item.productImages) {
                buttonsHTML += `<span class="images-toggle" onclick="event.stopPropagation(); toggleImages('${person}', ${index})">View Images</span>`;
            }
            buttonsHTML += '</div>';
        }

        // Load rating from localStorage
        const savedRating = localStorage.getItem(`rating-${person}-${index}`) || item.rating || 0;
        const starRatingHTML = `
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(star =>
                    `<span class="star ${star <= savedRating ? 'filled' : 'empty'}" onclick="event.stopPropagation(); setRating('${person}', ${index}, ${star})">★</span>`
                ).join('')}
            </div>
        `;

        const row = document.createElement('tr');
        row.setAttribute('data-status', item.status);
        row.setAttribute('data-value', item.value || '');
        row.setAttribute('data-index', index);

        // Add selected class if this item is selected
        if (selections[person].has(index)) {
            row.classList.add('selected');
        }

        // Add completed class if this item is completed
        if (completed[person].has(index)) {
            row.classList.add('completed');
        }

        row.innerHTML = `
            <td>
                <div class="item-name">
                    ${item.name}
                    ${priorityTag}
                </div>
                ${buttonsHTML}
            </td>
            <td>
                <span class="status-badge status-${item.status}">${item.status}</span>
            </td>
            <td>
                <div class="range">$${item.low}-${item.high}</div>
            </td>
            <td onclick="event.stopPropagation()">
                ${starRatingHTML}
            </td>
            <td onclick="event.stopPropagation()">
                <div class="price-grid">
                    ${pricesHTML}
                    ${googleSearchHTML}
                </div>
            </td>
            <td>
                <div class="notes">
                    ${item.notes}
                    ${valueTag}
                    ${dropTag}
                </div>
            </td>
        `;

        // Add click handler for row selection
        row.addEventListener('click', function() {
            toggleSelection(person, index);
        });

        tbody.appendChild(row);

        // Add research row if available
        if (item.hasResearch && item.research) {
            const researchRow = document.createElement('tr');
            researchRow.classList.add('research-row', 'hidden');
            researchRow.setAttribute('data-research-index', index);

            const sectionsHTML = item.research.sections.map(section => `
                <div class="research-section">
                    <h5>${section.heading}</h5>
                    <ul>
                        ${section.points.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

            const imagesHTML = item.research.images ? `
                <div class="research-images">
                    ${item.research.images.map(img => `<img src="${img}" class="research-image" alt="Research image" />`).join('')}
                </div>
            ` : '';

            researchRow.innerHTML = `
                <td colspan="6">
                    <div class="research-content">
                        <h4>${item.research.title}</h4>
                        ${sectionsHTML}
                        ${imagesHTML}
                        <div class="research-source">${item.research.source}</div>
                    </div>
                </td>
            `;

            tbody.appendChild(researchRow);
        }

        // Add images row if available
        if (item.productImages && item.productImages.length > 0) {
            const imagesRow = document.createElement('tr');
            imagesRow.classList.add('images-row', 'hidden');
            imagesRow.setAttribute('data-images-index', index);

            const carouselHTML = `
                <div class="images-carousel">
                    ${item.productImages.map(img => `<img src="${img}" class="carousel-image" alt="${item.name}" />`).join('')}
                </div>
            `;

            imagesRow.innerHTML = `
                <td colspan="6">
                    <div class="images-content">
                        <h4>Product Images: ${item.name}</h4>
                        ${carouselHTML}
                    </div>
                </td>
            `;

            tbody.appendChild(imagesRow);
        }
    });

    // Update totals
    updateTotals(person);
}

// Toggle selection of an item
function toggleSelection(person, index) {
    if (selections[person].has(index)) {
        selections[person].delete(index);
    } else {
        selections[person].add(index);
    }

    saveSelections(person);
    updateSelection(person);
    updateTabCounts();
}

// Select all items
function selectAll(person) {
    const items = giftData[person];
    items.forEach((item, index) => {
        selections[person].add(index);
    });
    saveSelections(person);
    updateSelection(person);
    updateTabCounts();
}

// Select only required items
function selectRequired(person) {
    selections[person].clear();
    const items = giftData[person];
    items.forEach((item, index) => {
        if (item.status === 'required') {
            selections[person].add(index);
        }
    });
    saveSelections(person);
    updateSelection(person);
    updateTabCounts();
}

// Select only optional items
function selectOptional(person) {
    selections[person].clear();
    const items = giftData[person];
    items.forEach((item, index) => {
        if (item.status === 'optional') {
            selections[person].add(index);
        }
    });
    saveSelections(person);
    updateSelection(person);
    updateTabCounts();
}

// Clear all selections
function clearSelection(person) {
    selections[person].clear();
    saveSelections(person);
    updateSelection(person);
    updateTabCounts();
}

// Mark selected items as purchased/complete
function markSelectedAsComplete(person) {
    if (selections[person].size === 0) {
        showAlert('No Items Selected', 'Please select at least one item to mark as purchased.');
        return;
    }

    // Add selected items to completed
    selections[person].forEach(index => {
        completed[person].add(index);
    });

    // Clear selections after marking complete
    selections[person].clear();

    saveCompleted(person);
    saveSelections(person);
    renderItems(person);
    updateSelection(person);
    updateTabCounts();
}

// Unmark selected items as complete
function unmarkSelectedAsComplete(person) {
    if (selections[person].size === 0) {
        showAlert('No Items Selected', 'Please select at least one item to unmark as purchased.');
        return;
    }

    // Remove selected items from completed
    selections[person].forEach(index => {
        completed[person].delete(index);
    });

    // Clear selections after unmarking
    selections[person].clear();

    saveCompleted(person);
    saveSelections(person);
    renderItems(person);
    updateSelection(person);
    updateTabCounts();
}

// Update visual state based on selections
function updateSelection(person) {
    const rows = document.querySelectorAll(`#${person}-itemsTable tr[data-index]`);
    let totalLow = 0;
    let totalHigh = 0;

    rows.forEach((row) => {
        const index = parseInt(row.getAttribute('data-index'));
        const item = giftData[person][index];

        if (selections[person].has(index)) {
            row.classList.add('selected');
            totalLow += item.low;
            totalHigh += item.high;
        } else {
            row.classList.remove('selected');
        }
    });

    // Update selected total display
    const selectedTotalDiv = document.getElementById(`${person}-selectedTotal`);
    const selectedTotalAmount = document.getElementById(`${person}-selectedTotalAmount`);

    if (selections[person].size > 0) {
        selectedTotalDiv.classList.add('show');
        selectedTotalAmount.textContent = `$${totalLow} - $${totalHigh}`;
    } else {
        selectedTotalDiv.classList.remove('show');
    }
}

// Update tab counts
function updateTabCounts() {
    Object.keys(giftData).forEach(person => {
        const countEl = document.getElementById(`${person}-count`);
        if (countEl) {
            countEl.textContent = selections[person].size;
        }
    });
}

// Calculate and update totals
function updateTotals(person) {
    const items = giftData[person];
    const requiredItems = items.filter(item => item.status === 'required');
    const optionalItems = items.filter(item => item.status === 'optional');

    const requiredLow = requiredItems.reduce((sum, item) => sum + item.low, 0);
    const requiredHigh = requiredItems.reduce((sum, item) => sum + item.high, 0);
    const optionalLow = optionalItems.reduce((sum, item) => sum + item.low, 0);
    const optionalHigh = optionalItems.reduce((sum, item) => sum + item.high, 0);

    const totalsDiv = document.getElementById(`${person}-totals`);
    totalsDiv.innerHTML = `
        <div class="total-box required">
            <div class="total-label">Required</div>
            <div class="total-amount">$${requiredLow} - $${requiredHigh}</div>
        </div>
        <div class="total-box optional">
            <div class="total-label">Optional</div>
            <div class="total-amount">$${optionalLow} - $${optionalHigh}</div>
        </div>
        <div class="total-box">
            <div class="total-label">Combined Total</div>
            <div class="total-amount">$${requiredLow + optionalLow} - $${requiredHigh + optionalHigh}</div>
        </div>
    `;
}

// Set rating for an item
function setRating(person, index, rating) {
    localStorage.setItem(`rating-${person}-${index}`, rating);
    renderItems(person);
    updateSelection(person);
}

// Toggle research panel
function toggleResearch(person, index) {
    const researchRow = document.querySelector(`#${person}-itemsTable tr[data-research-index="${index}"]`);
    if (researchRow) {
        researchRow.classList.toggle('hidden');
    }
}

// Toggle images panel
function toggleImages(person, index) {
    const imagesRow = document.querySelector(`#${person}-itemsTable tr[data-images-index="${index}"]`);
    if (imagesRow) {
        imagesRow.classList.toggle('hidden');
    }
}

// Filter items
function filterItems(person, filter) {
    const rows = document.querySelectorAll(`#${person}-itemsTable tr`);
    const buttons = event.target.parentElement.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    rows.forEach(row => {
        // Skip research and images rows in filtering
        if (row.classList.contains('research-row') || row.classList.contains('images-row')) {
            row.classList.add('hidden');
            return;
        }

        const status = row.getAttribute('data-status');
        const value = row.getAttribute('data-value');

        let show = false;
        if (filter === 'all') {
            show = true;
        } else if (filter === 'required' && status === 'required') {
            show = true;
        } else if (filter === 'optional' && status === 'optional') {
            show = true;
        } else if (filter === 'high-value' && value === 'HIGH') {
            show = true;
        }

        row.classList.toggle('hidden', !show);
    });
}

// Open selected items
function openSelected(person, type) {
    if (selections[person].size === 0) {
        showAlert('No Items Selected', 'Please select at least one item to open links.');
        return;
    }

    const selectedIndices = [...selections[person]];
    const missingAmazon = [];
    const urlsToOpen = [];

    selectedIndices.forEach(index => {
        const item = giftData[person][index];

        if (type === 'cheapest') {
            const cheapest = item.prices.reduce((min, p) => p.price < min.price ? p : min);
            urlsToOpen.push(cheapest.url);
        } else if (type === 'amazon') {
            const amazon = item.prices.find(p => p.store.toLowerCase().includes('amazon'));
            if (amazon) {
                urlsToOpen.push(amazon.url);
            } else {
                missingAmazon.push(item.name);
            }
        } else if (type === 'highend') {
            // Find items marked as highend, or use the highest price
            const highend = item.prices.find(p => p.highend) ||
                          item.prices.reduce((max, p) => p.price > max.price ? p : max);
            urlsToOpen.push(highend.url);
        }
    });

    // Show warning if Amazon links are missing
    if (type === 'amazon' && missingAmazon.length > 0) {
        const itemsList = missingAmazon.map(name => `• ${name}`).join('\n');
        showAlert(
            'Missing Amazon Links',
            `The following items don't have Amazon links:\n\n${itemsList}\n\nOpening available Amazon links...`
        );
    }

    // Open all URLs in new tabs with small delay to avoid popup blocker
    urlsToOpen.forEach((url, index) => {
        setTimeout(() => {
            window.open(url, '_blank');
        }, index * 100); // 100ms delay between each tab
    });
}

// Alert modal functions
function showAlert(title, content) {
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertContent').textContent = content;
    document.getElementById('alertOverlay').classList.add('show');
    document.getElementById('alertModal').classList.add('show');
}

function closeAlert() {
    document.getElementById('alertOverlay').classList.remove('show');
    document.getElementById('alertModal').classList.remove('show');
}

// Toggle blur on all tables
function toggleBlur() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.classList.toggle('blurred');
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSelections();

    // Render all tabs
    Object.keys(giftData).forEach(person => {
        renderItems(person);
        updateSelection(person);
    });

    updateTabCounts();

    // Blur tables on page load
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.classList.add('blurred');
    });

    // Add spacebar toggle for blur
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
            toggleBlur();
        }
    });
});
