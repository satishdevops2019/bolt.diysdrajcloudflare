document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '&#9776;'; // Hamburger icon

    const headerContainer = document.querySelector('header .container');
    const nav = document.querySelector('header nav');

    if (headerContainer && nav) {
        headerContainer.insertBefore(menuToggle, nav); // Insert toggle button before nav

        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            // Optionally, also toggle the display of .header-right if it's part of the mobile menu
            const headerRight = document.querySelector('header .header-right');
            if (headerRight) {
                // This logic depends on how you want to display .header-right on mobile.
                // For this example, let's assume it's shown below the nav links when menu is active.
                // The CSS needs to support this (e.g., by making .header-right display: flex; flex-direction: column; when nav.active + .header-right)
                 if (nav.classList.contains('active')) {
                    headerRight.style.display = 'flex'; // Or 'block' depending on your CSS
                 } else {
                    // Check window width to avoid hiding it on desktop if it was initially visible
                    if (window.innerWidth <= 768) {
                        headerRight.style.display = 'none';
                    }
                 }
            }
        });
    }

    // Smooth scrolling for anchor links (optional, if you have internal page links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Ensure it's a valid selector and not just "#"
            if (hrefAttribute && hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) {
                e.preventDefault();
                document.querySelector(hrefAttribute).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Basic form validation example (can be expanded)
    const searchForm = document.querySelector('.search-bar');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const locationInput = document.getElementById('location');
            if (locationInput && locationInput.value.trim() === '') {
                e.preventDefault(); // Prevent form submission
                alert('Please enter a location.');
                locationInput.focus();
            }
            // Add more validation for other fields as needed
        });
    }

    // Placeholder for image paths - in a real scenario, these would be actual paths
    const placeholderImages = {
        'placeholder_logo.png': 'https://via.placeholder.com/150x50/FF5A5F/FFFFFF?Text=AirClone',
        'placeholder_user_icon.png': 'https://via.placeholder.com/40/cccccc/FFFFFF?Text=U',
        'placeholder_hero_bg.jpg': 'https://via.placeholder.com/1600x900/cccccc/FFFFFF?Text=Beautiful+Scene',
        'placeholder_destination1.jpg': 'https://via.placeholder.com/400x300/FF5A5F/FFFFFF?Text=Paris',
        'placeholder_destination2.jpg': 'https://via.placeholder.com/400x300/FF5A5F/FFFFFF?Text=Tokyo',
        'placeholder_destination3.jpg': 'https://via.placeholder.com/400x300/FF5A5F/FFFFFF?Text=Rome',
        'placeholder_destination4.jpg': 'https://via.placeholder.com/400x300/FF5A5F/FFFFFF?Text=Bali',
        'placeholder_experience1.jpg': 'https://via.placeholder.com/400x300/717171/FFFFFF?Text=Cooking+Class',
        'placeholder_experience2.jpg': 'https://via.placeholder.com/400x300/717171/FFFFFF?Text=City+Tour',
        'placeholder_experience3.jpg': 'https://via.placeholder.com/400x300/717171/FFFFFF?Text=Hiking+Adventure',
        'placeholder_icon_search.png': 'https://via.placeholder.com/80/FF5A5F/FFFFFF?Text=S',
        'placeholder_icon_book.png': 'https://via.placeholder.com/80/FF5A5F/FFFFFF?Text=B',
        'placeholder_icon_enjoy.png': 'https://via.placeholder.com/80/FF5A5F/FFFFFF?Text=E',
        'placeholder_icon_facebook.png': 'https://via.placeholder.com/24/3b5998/FFFFFF?Text=f',
        'placeholder_icon_twitter.png': 'https://via.placeholder.com/24/1DA1F2/FFFFFF?Text=t',
        'placeholder_icon_instagram.png': 'https://via.placeholder.com/24/E4405F/FFFFFF?Text=ig',
    };

    document.querySelectorAll('img').forEach(img => {
        const srcName = img.getAttribute('src');
        if (placeholderImages[srcName]) {
            img.setAttribute('src', placeholderImages[srcName]);
        }
    });

    // Adjust .header-right display based on initial window size for mobile
    // This ensures it's hidden correctly if the page loads on a small screen
    const headerRightElement = document.querySelector('header .header-right');
    if (window.innerWidth <= 768 && headerRightElement) {
        if (!nav || !nav.classList.contains('active')) { // Hide only if menu is not active
             headerRightElement.style.display = 'none';
        }
    }

    window.addEventListener('resize', () => {
        const currentHeaderRight = document.querySelector('header .header-right');
        const currentNav = document.querySelector('header nav');
        if (window.innerWidth > 768) {
            if (currentNav) currentNav.classList.remove('active'); // Close mobile menu
            if (currentHeaderRight) currentHeaderRight.style.display = 'flex'; // Reset display for desktop
        } else {
            // If shrinking to mobile view, hide .header-right unless menu is active
            if (currentHeaderRight && (!currentNav || !currentNav.classList.contains('active'))) {
                currentHeaderRight.style.display = 'none';
            }
        }
    });

});
