# Implementation Notes

## JavaScript Architecture

### State Management
```javascript
const AppState = {
    transactions: [],    // Array of transaction objects
    theme: 'light',      // Current theme
    sortBy: 'newest',    // Current sort method
    highlightEnabled: true, // Whether to highlight high spending
    chart: null          // Chart.js instance
};
```

### Transaction Object Structure
```javascript
{
    id: 'unique-timestamp', // Unique identifier
    name: 'Item name',      // Transaction description
    amount: 50000,          // Amount in Rupiah
    category: 'food',       // Category slug
    date: '2026-06-11T...' // ISO date string
}
```

### Key Functions
1. `init()` - Initialize application
2. `loadDataFromStorage()` - Load from localStorage
3. `saveDataToStorage()` - Save to localStorage
4. `handleFormSubmit()` - Process new transactions
5. `renderTransactions()` - Update transaction list
6. `updateChart()` - Refresh pie chart
7. `toggleTheme()` - Switch between light/dark themes

## CSS Architecture

### CSS Variables
The application uses CSS custom properties for theming. Variables are defined in `:root` for light theme and overridden with `[data-theme="dark"]` for dark theme.

### Component Classes
- `.card` - Base card component
- `.transaction-item` - Individual transaction
- `.form-group` - Form input group
- `.summary-card` - Total spending card
- `.chart-container` - Chart wrapper

### Utility Classes
- `.category-food`, `.category-transportation`, `.category-fun` - Category badges
- `.high-spending` - Highlight for transactions > Rp 100,000
- `.empty-state` - Empty content placeholder

## Form Validation

### Required Fields
1. Item Name - Must not be empty
2. Amount - Must be positive number
3. Category - Must be selected from dropdown

### Error Handling
- Real-time validation feedback
- Clear error messages below each field
- Error state clears on input

## Chart.js Integration

### Data Preparation
```javascript
// Calculate category totals
const categoryTotals = {
    food: 0,
    transportation: 0,
    fun: 0
};
```

### Chart Configuration
- Type: Pie chart
- Responsive: Yes
- Custom tooltips with percentage calculation
- Custom legend (not using Chart.js built-in)

## Local Storage Keys
- `expenseTransactions` - Transaction data
- `expenseTheme` - Theme preference
- `expenseSort` - Sort preference
- `expenseHighlight` - Highlight toggle state

## Event Handling

### Form Events
- `submit` - Add new transaction
- `input` - Clear validation errors
- `change` - Update category selection

### Control Events
- `click` - Theme toggle button
- `change` - Sort dropdown
- `change` - Highlight checkbox
- `click` - Delete buttons (with event delegation)

### Transaction Deletion
- Confirm dialog before deletion
- Remove from array and localStorage
- Update all dependent UI elements

## Responsive Design Implementation

### Breakpoints
1. **Mobile (< 480px)**
   - Single column layout
   - Smaller padding
   - Stacked transaction items

2. **Tablet (480px - 1023px)**
   - Maintain single column
   - Larger tap targets
   - Adjusted chart height

3. **Desktop (≥ 1024px)**
   - Two-column grid layout
   - Form/transactions on left
   - Chart on right
   - Hover effects

### Flexible Units
- Use `rem` for typography
- Use `%` for widths where appropriate
- Use `min/max-width` for containers
- Use `flex/grid` for layouts

## Performance Considerations

### DOM Updates
- Batch DOM updates when possible
- Use `innerHTML` for transaction list (simple use case)
- Cache DOM references

### Chart Performance
- Destroy old chart before creating new one
- Limit chart updates to when data actually changes
- Use responsive configuration

### Local Storage
- JSON.stringify only when needed
- Handle localStorage errors gracefully
- Provide fallback for corrupted data

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy
- ARIA labels where needed
- Form field labels

### Keyboard Navigation
- All interactive elements are focusable
- Logical tab order
- Enter/space key support for buttons

### Screen Reader Support
- Descriptive text for icons
- ARIA live regions for dynamic updates
- Proper contrast ratios in both themes

## Browser Compatibility

### Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Polyfills
- Uses native JavaScript features (ES6+)
- Relies on browser support for:
  - Local Storage
  - CSS Variables
  - Flexbox/Grid
  - Chart.js (requires Canvas support)

### Fallbacks
- Graceful degradation if localStorage not available
- Basic functionality without Chart.js (would need alternative visualization)