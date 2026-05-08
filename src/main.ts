// src/main.ts

// Define the available categories as a literal type
type Category = 'tommy-joe' | 'random' | 'animals' | 'pokemon';

/**
 * Initializes the navigation by attaching click listeners to the category cards.
 * This approach keeps the HTML clean and handles logic in TypeScript.
 */
function initializeNavigation(): void {
    const categories: Category[] = ['tommy-joe', 'random', 'animals', 'pokemon'];

    categories.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', () => {
                handleCategorySelect(id);
            });
        }
    });
}

/**
 * Handles the selection of a category.
 * Redirects the user to the game page with the selected category in the URL.
 * 
 * @param category - The ID of the category selected by the user.
 */
function handleCategorySelect(category: Category): void {
    console.log(`User selected: ${category}`);
    
    // Use window.location.href to navigate to the game page.
    // We pass the category as a query parameter (e.g., game.html?category=pokemon).
    window.location.href = `./game.html?category=${category}`;
}

// Start the navigation setup once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', initializeNavigation);