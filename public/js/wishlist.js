/**
 * Shows the success modal with a custom message
 * @param {string} message - Message to display
 * @param {string} title - Title of the modal
 */
function showSuccessModal(message, title = 'Success!') {
    const modal = document.getElementById('successModal');
    const msgEl = document.getElementById('modalMessage');
    const titleEl = document.getElementById('modalTitle');

    if (modal && msgEl && titleEl) {
        msgEl.textContent = message;
        titleEl.textContent = title;

        // Show modal
        modal.classList.remove('hidden');
        // Small delay to allow display change to happen before opacity transition
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('div.transform').classList.remove('scale-90');
            modal.querySelector('div.transform').classList.add('scale-100');
            modal.classList.add('flex');
        });

        // Hide after 2 seconds
        setTimeout(() => {
            hideSuccessModal();
        }, 2000);
    }
}

/**
 * Hides the success modal
 */
function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.querySelector('div.transform').classList.remove('scale-100');
        modal.querySelector('div.transform').classList.add('scale-90');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300); // Wait for transition
    }
}

async function toggleWishlist(productId, btnElement) {
    if (!productId) {
        console.error('No product ID provided');
        return;
    }

    try {
        const icon = btnElement.querySelector('i');
        // Defensive check if icon exists, though structural guarantee is expected
        if (!icon) return;

        const isFilled = icon.classList.contains('ri-heart-fill');
        const endpoint = isFilled ? '/wishlist/remove' : '/wishlist/add';
        const method = 'POST';

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        if (response.status === 401) {
            // User not logged in - check for login modal or redirect
            if (typeof showLoginModal === 'function') {
                showLoginModal();
            } else {
                window.location.href = '/login';
            }
            return;
        }

        const data = await response.json();

        if (response.ok) {
            // Toggle UI state immediately
            if (isFilled) {
                // Was filled, now removing
                icon.classList.remove('ri-heart-fill', 'text-red-500');
                icon.classList.add('ri-heart-line', 'text-gray-400', 'group-hover/wishlist:text-red-500');

                // If we are on the wishlist page, we might want to remove the card item DOM or reload
                if (window.location.pathname === '/wishlist') {
                    // Optional: Animate removal or reload
                    window.location.reload();
                } else {
                    showSuccessModal('Product removed from wishlist', 'Removed');
                }
            } else {
                // Was empty, now adding
                icon.classList.remove('ri-heart-line', 'text-gray-400', 'group-hover/wishlist:text-red-500');
                icon.classList.add('ri-heart-fill', 'text-red-500');

                showSuccessModal('Product added to wishlist successfully!');
            }
        } else {
            console.error('Failed to toggle wishlist:', data.message);
            // Optionally show error toast
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
    }
}
