document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem("token"); 
    if (!token) {
        window.location.href = "login.html";
    }

    // 1. DARK MODE TOGGLE
    // Handles click event to switch between 'dark-mode' and 'light-mode' themes and updates label.
    const switchButton = document.querySelector('.switch');
    const modeLabel = document.getElementById('mode-label'); 
    
    // Set initial mode text
    if (document.body.classList.contains('dark-mode')) {
        modeLabel.textContent = 'dark mode:on';
    } else {
        modeLabel.textContent = 'dark mode:off';
    }

    if (switchButton) {
        switchButton.addEventListener('click', function () {
            this.classList.toggle('is-active');
            document.body.classList.toggle('dark-mode');
            
            // Update label text
            if (document.body.classList.contains('dark-mode')) {
                modeLabel.textContent = 'dark mode:on';
            } else {
                modeLabel.textContent = 'dark mode:off';
            }
        });
    }

    // 2. NAVIGATION FUNCTION
    // Redirects user to the project setup page.
    function startManaging() {
     window.location.href = "core-functions/project-setup/landing-page.html";
    }
    window.startManaging = startManaging; 

    // 3. TEAM CARDS INTERACTION
    // Toggles visibility of social media links on click and hides others.
    const profileCards = document.querySelectorAll('.profile-card');

    profileCards.forEach(card => {
        card.addEventListener('click', () => {
            const socialLinks = card.querySelector('.social-links');
            
            socialLinks.classList.toggle('visible');

            // Hide links for all other cards
            profileCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.querySelector('.social-links').classList.remove('visible');
                }
            });
        });
    });
});