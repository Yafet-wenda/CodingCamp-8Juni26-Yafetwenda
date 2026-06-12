# Expense & Budget Visualizer - Project Guidelines

## Project Overview
This is a responsive web application for tracking expenses and visualizing spending patterns using HTML, CSS, and Vanilla JavaScript.

## Technology Stack
- HTML5 for structure
- CSS3 for styling (with CSS Variables for theming)
- Vanilla JavaScript (no frameworks)
- Chart.js for data visualization
- Local Storage for data persistence
- Font Awesome for icons

## File Structure
- `index.html` - Main HTML document
- `css/style.css` - All styles
- `js/script.js` - All JavaScript logic

## Core Features
1. **Total Balance Display** - Shows sum of all transactions
2. **Transaction Form** - Add new expenses with validation
3. **Transaction History** - List of all expenses with delete functionality
4. **Pie Chart Visualization** - Spending distribution by category
5. **Dark/Light Mode** - Theme toggle
6. **Sorting Options** - Sort transactions by amount, category, or date
7. **High Spending Highlight** - Visual indicator for transactions > Rp 100,000

## Code Standards
- Use semantic HTML elements
- Follow BEM-like naming for CSS classes
- Use camelCase for JavaScript variables and functions
- Add comments for complex logic
- Keep functions small and focused (single responsibility)
- Use event delegation where appropriate
- Handle edge cases and errors gracefully

## Color Palette
### Light Theme
- Primary: #4f46e5 (Indigo)
- Secondary: #10b981 (Emerald)
- Background: #f9fafb (Gray-50)
- Card Background: #ffffff (White)

### Dark Theme  
- Primary: #6366f1 (Indigo-400)
- Secondary: #10b981 (Emerald-500)
- Background: #111827 (Gray-900)
- Card Background: #1f2937 (Gray-800)

## Responsive Design Requirements
- Mobile-first approach
- Breakpoints:
  - Mobile: < 480px
  - Tablet: 480px - 1023px  
  - Desktop: ≥ 1024px
- Flexible grid layouts
- Touch-friendly interaction targets
- Readable typography on all screens

## Data Storage
- Use Local Storage for persistence
- Store:
  - Transaction list (as JSON)
  - Theme preference
  - Sort preference
  - Highlight toggle state

## Testing Considerations
- Form validation should be user-friendly
- Chart should handle empty data gracefully
- All features should work without JavaScript console errors
- Application should recover from corrupted localStorage data