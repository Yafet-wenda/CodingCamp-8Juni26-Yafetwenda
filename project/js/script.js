// Expense & Budget Visualizer - Main JavaScript File

// Application State
const AppState = {
    transactions: [],
    theme: 'light',
    sortBy: 'newest',
    highlightEnabled: true,
    chart: null,
    
    // Category colors for chart
    categoryColors: {
        food: '#10b981',
        transportation: '#4f46e5',
        fun: '#f472b6'
    },
    
    // Category names for display
    categoryNames: {
        food: 'Food',
        transportation: 'Transportation',
        fun: 'Fun'
    }
};

// DOM Elements
const DOM = {
    // Form elements
    transactionForm: document.getElementById('transactionForm'),
    itemName: document.getElementById('itemName'),
    amount: document.getElementById('amount'),
    category: document.getElementById('category'),
    
    // Error elements
    itemNameError: document.getElementById('itemNameError'),
    amountError: document.getElementById('amountError'),
    categoryError: document.getElementById('categoryError'),
    
    // Display elements
    totalAmount: document.getElementById('totalAmount'),
    transactionsList: document.getElementById('transactionsList'),
    
    // Controls
    themeToggle: document.getElementById('themeToggle'),
    sortBy: document.getElementById('sortBy'),
    highlightToggle: document.getElementById('highlightToggle'),
    
    // Chart elements
    spendingChart: document.getElementById('spendingChart'),
    chartLegend: document.getElementById('chartLegend')
};

// Initialize the application
function init() {
    loadDataFromStorage();
    setupEventListeners();
    renderTransactions();
    updateTotalAmount();
    initializeChart();
    updateThemeUI();
}

// Load data from localStorage
function loadDataFromStorage() {
    // Load transactions
    const savedTransactions = localStorage.getItem('expenseTransactions');
    if (savedTransactions) {
        AppState.transactions = JSON.parse(savedTransactions);
    }
    
    // Load theme preference
    const savedTheme = localStorage.getItem('expenseTheme');
    if (savedTheme) {
        AppState.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Load sort preference
    const savedSort = localStorage.getItem('expenseSort');
    if (savedSort) {
        AppState.sortBy = savedSort;
        DOM.sortBy.value = savedSort;
    }
    
    // Load highlight preference
    const savedHighlight = localStorage.getItem('expenseHighlight');
    if (savedHighlight !== null) {
        AppState.highlightEnabled = JSON.parse(savedHighlight);
        DOM.highlightToggle.checked = AppState.highlightEnabled;
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('expenseTransactions', JSON.stringify(AppState.transactions));
    localStorage.setItem('expenseTheme', AppState.theme);
    localStorage.setItem('expenseSort', AppState.sortBy);
    localStorage.setItem('expenseHighlight', JSON.stringify(AppState.highlightEnabled));
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    DOM.transactionForm.addEventListener('submit', handleFormSubmit);
    
    // Theme toggle
    DOM.themeToggle.addEventListener('click', toggleTheme);
    
    // Sort control
    DOM.sortBy.addEventListener('change', handleSortChange);
    
    // Highlight toggle
    DOM.highlightToggle.addEventListener('change', handleHighlightToggle);
    
    // Input validation
    DOM.itemName.addEventListener('input', clearError.bind(null, DOM.itemNameError));
    DOM.amount.addEventListener('input', clearError.bind(null, DOM.amountError));
    DOM.category.addEventListener('change', clearError.bind(null, DOM.categoryError));
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Create transaction object
    const transaction = {
        id: Date.now().toString(),
        name: DOM.itemName.value.trim(),
        amount: parseInt(DOM.amount.value),
        category: DOM.category.value,
        date: new Date().toISOString()
    };
    
    // Add to transactions array
    AppState.transactions.push(transaction);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Update UI
    renderTransactions();
    updateTotalAmount();
    updateChart();
    
    // Reset form
    DOM.transactionForm.reset();
    
    // Show success feedback
    showSuccessMessage('Transaction added successfully!');
}

// Validate form inputs
function validateForm() {
    let isValid = true;
    
    // Validate item name
    if (!DOM.itemName.value.trim()) {
        DOM.itemNameError.textContent = 'Item name is required';
        isValid = false;
    }
    
    // Validate amount
    if (!DOM.amount.value || parseInt(DOM.amount.value) <= 0) {
        DOM.amountError.textContent = 'Please enter a valid amount';
        isValid = false;
    }
    
    // Validate category
    if (!DOM.category.value) {
        DOM.categoryError.textContent = 'Please select a category';
        isValid = false;
    }
    
    return isValid;
}

// Clear error message
function clearError(errorElement) {
    errorElement.textContent = '';
}

// Show success message
function showSuccessMessage(message) {
    // Create temporary success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = message;
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successMsg);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
    }, 3000);
    
    // Add CSS animations
    if (!document.getElementById('success-animations')) {
        const style = document.createElement('style');
        style.id = 'success-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', AppState.theme);
    saveDataToStorage();
    updateThemeUI();
}

// Update theme toggle button UI
function updateThemeUI() {
    const icon = DOM.themeToggle.querySelector('i');
    
    if (AppState.theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    // Animasi smooth
    icon.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
}

// Handle sort change
function handleSortChange(e) {
    AppState.sortBy = e.target.value;
    saveDataToStorage();
    renderTransactions();
}

// Handle highlight toggle
function handleHighlightToggle(e) {
    AppState.highlightEnabled = e.target.checked;
    saveDataToStorage();
    renderTransactions();
}

// Render transactions list
function renderTransactions() {
    // Sort transactions based on current sort option
    const sortedTransactions = sortTransactions(AppState.transactions);
    
    // Clear current list
    DOM.transactionsList.innerHTML = '';
    
    // Show empty state if no transactions
    if (sortedTransactions.length === 0) {
        DOM.transactionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet. Add your first expense!</p>
            </div>
        `;
        return;
    }
    
    // Create transaction items
    sortedTransactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        DOM.transactionsList.appendChild(transactionElement);
    });
}

// Sort transactions based on current sort option
function sortTransactions(transactions) {
    const sorted = [...transactions];
    
    switch (AppState.sortBy) {
        case 'highest':
            return sorted.sort((a, b) => b.amount - a.amount);
        case 'lowest':
            return sorted.sort((a, b) => a.amount - b.amount);
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        case 'newest':
        default:
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// Create transaction element
function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    // Add high-spending class if amount > 100,000 and highlighting is enabled
    if (AppState.highlightEnabled && transaction.amount > 100000) {
        div.classList.add('high-spending');
    }
    
    // Format date
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format amount with Indonesian Rupiah format
    const formattedAmount = formatCurrency(transaction.amount);
    
    div.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-name">${transaction.name}</div>
            <div class="transaction-details">
                <span class="transaction-category category-${transaction.category}">
                    <i class="fas fa-${getCategoryIcon(transaction.category)}"></i>
                    ${AppState.categoryNames[transaction.category]}
                </span>
                <span class="transaction-date">
                    <i class="far fa-clock"></i>
                    ${formattedDate}
                </span>
            </div>
        </div>
        <div class="transaction-amount">${formattedAmount}</div>
        <div class="transaction-actions">
            <button class="delete-btn" data-id="${transaction.id}">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        </div>
    `;
    
    // Add delete event listener
    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));
    
    return div;
}

// Get icon for category
function getCategoryIcon(category) {
    const icons = {
        food: 'utensils',
        transportation: 'car',
        fun: 'gamepad'
    };
    return icons[category] || 'tag';
}

// Delete transaction
function deleteTransaction(id) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }
    
    // Remove from transactions array
    AppState.transactions = AppState.transactions.filter(t => t.id !== id);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Update UI
    renderTransactions();
    updateTotalAmount();
    updateChart();
    
    // Show feedback
    showSuccessMessage('Transaction deleted successfully!');
}

// Update total amount display
function updateTotalAmount() {
    const total = AppState.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    DOM.totalAmount.textContent = formatCurrency(total);
}

// Format currency as Indonesian Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Initialize Chart.js doughnut chart (lebih realistis)
function initializeChart() {
    const ctx = DOM.spendingChart.getContext('2d');

    // Get initial data
    const { labels, data, backgroundColors, categoryKeys } = getChartData();
    const total = data.reduce((a, b) => a + b, 0);

    // Plugin: center text
    const centerTextPlugin = {
        id: 'centerTextPlugin',
        afterDraw(chart) {
            const { ctx, chartArea } = chart;
            if (!chartArea) return;

            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();

            // Ambil warna text dari CSS variable (fallback)
            const styles = getComputedStyle(document.documentElement);
            const textColor = styles.getPropertyValue('--text').trim() || '#15171b';
            const secondaryColor = styles.getPropertyValue('--text-light').trim() || '#1f2227';

            // Total amount
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '700 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
            ctx.fillText(formatCurrency(total), cx, cy - 6);

            // Subtitle
            ctx.fillStyle = secondaryColor;
            ctx.font = '600 10px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
            ctx.fillText('Total Spending', cx, cy + 12);

            ctx.restore();
        }
    };

    AppState.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(255,255,255,0.9)',
                borderWidth: 2,
                hoverOffset: 10,
                spacing: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            rotation: -90,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const dataset = context.dataset;
                            const totalLocal = (dataset?.data || []).reduce((a, b) => a + b, 0);
                            const percentage = totalLocal > 0 ? Math.round((value / totalLocal) * 100) : 0;
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                duration: 700,
                easing: 'easeOutQuart'
            }
        },
        plugins: [centerTextPlugin]
    });

    // Legend + interaksi
    updateChartLegend(labels, backgroundColors, categoryKeys);
}

// Set active category untuk interaksi legend
// Catatan: tidak ada efek "dim/transparent" pada slice non-active.
function setChartCategoryActive(categoryKeyOrNull) {
    if (!AppState.chart) return;

    // Jangan ubah opacity/colors slice.
    // Fokus hanya pada styling legend yang menandai slice aktif.
    // (Chart tetap tampil penuh untuk semua segment.)
    AppState.chart.update();
}





// Get chart data from transactions
function getChartData() {
    // Initialize category totals
    const categoryTotals = {
        food: 0,
        transportation: 0,
        fun: 0
    };

    // Calculate totals
    AppState.transactions.forEach(transaction => {
        categoryTotals[transaction.category] += transaction.amount;
    });

    // Prepare data for chart
    const labels = [];
    const data = [];
    const backgroundColors = [];
    const categoryKeys = [];

    Object.keys(categoryTotals).forEach(category => {
        if (categoryTotals[category] > 0) {
            labels.push(AppState.categoryNames[category]);
            data.push(categoryTotals[category]);
            backgroundColors.push(AppState.categoryColors[category]);
            categoryKeys.push(category);
        }
    });

    return { labels, data, backgroundColors, categoryKeys };
}


// Update chart with current data
function updateChart() {
    const { labels, data, backgroundColors } = getChartData();
    
    // Update chart data
    AppState.chart.data.labels = labels;
    AppState.chart.data.datasets[0].data = data;
    AppState.chart.data.datasets[0].backgroundColor = backgroundColors;
    
    // Update chart
    AppState.chart.update();
    
    // Update legend
    updateChartLegend(labels, backgroundColors);
}

// Update chart legend
function updateChartLegend(labels, colors, categoryKeys) {
    DOM.chartLegend.innerHTML = '';

    if (labels.length === 0) {
        DOM.chartLegend.innerHTML = `
            <div class="empty-state">
                <p>No data to display. Add some transactions!</p>
            </div>
        `;
        return;
    }

    labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.tabIndex = 0;
        legendItem.dataset.categoryKey = categoryKeys?.[index] || '';
        legendItem.setAttribute('role', 'button');

        const colorBox = document.createElement('div');
        // Pastikan class legend sesuai dengan CSS (food/transportation/fun), bukan label (Food/Transportation/Fun)
        const normalizedKey = label.toLowerCase();
        const legendKey =
            normalizedKey === 'transportation' ? 'transportation' :
            normalizedKey === 'food' ? 'food' :
            normalizedKey === 'fun' ? 'fun' : normalizedKey;
        colorBox.className = `legend-color legend-${legendKey}`;
        colorBox.style.backgroundColor = colors[index];

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(labelSpan);

        const categoryKey = legendItem.dataset.categoryKey;

        legendItem.addEventListener('mouseenter', () => {
            setChartCategoryActive(categoryKey);
            DOM.chartLegend.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
            legendItem.classList.add('active');
        });

        legendItem.addEventListener('mouseleave', () => {
            setChartCategoryActive(null);
            legendItem.classList.remove('active');
        });

        legendItem.addEventListener('click', () => {
            const isActive = legendItem.classList.contains('active');
            if (isActive) {
                setChartCategoryActive(null);
                DOM.chartLegend.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
            } else {
                setChartCategoryActive(categoryKey);
                DOM.chartLegend.querySelectorAll('.legend-item').forEach(el => el.classList.remove('active'));
                legendItem.classList.add('active');
            }
        });

        DOM.chartLegend.appendChild(legendItem);
    });
}


// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

