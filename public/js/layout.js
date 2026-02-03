document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Service Worker & Push Notifications
    // ==========================================
    if (typeof publicVapidKey !== 'undefined' && 'serviceWorker' in navigator) {
        checkNotificationPermission();
    }

    function checkNotificationPermission() {
        const permission = Notification.permission;
        const promptDismissedAt = localStorage.getItem('notification_prompt_dismissed');

        if (permission === 'granted') {
            registerServiceWorker().catch(err => console.error(err));
        } else if (permission === 'default') {
            // Check if dismissed recently (e.g., within 3 days)
            let shouldShow = true;
            if (promptDismissedAt) {
                const dismissedTime = new Date(parseInt(promptDismissedAt));
                const now = new Date();
                const diffDays = (now - dismissedTime) / (1000 * 60 * 60 * 24);
                if (diffDays < 3) shouldShow = false;
            }

            if (shouldShow) {
                // Show banner after a slight delay
                setTimeout(() => {
                    const banner = document.getElementById('notification-permission-banner');
                    if (banner) {
                         banner.classList.remove('hidden');
                         // Animate in
                         requestAnimationFrame(() => {
                             banner.style.opacity = '1';
                             banner.style.transform = 'translateY(0)';
                         });
                    }
                }, 1500); // 1.5s delay
            }
        }
    }

    // Global handlers for the soft prompt buttons
    window.dismissNotificationPrompt = function() {
        const banner = document.getElementById('notification-permission-banner');
        if (banner) banner.classList.add('hidden');
        localStorage.setItem('notification_prompt_dismissed', Date.now().toString());
    };

    window.enableNotifications = function() {
        const banner = document.getElementById('notification-permission-banner');
        if (banner) banner.classList.add('hidden');
        
        // Request native permission
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                registerServiceWorker().catch(err => console.error(err));
            }
        });
    };

    async function registerServiceWorker() {
        const register = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function openMenu() {
        if(mobileMenu) mobileMenu.classList.remove('-translate-x-full');
        if(mobileMenuBackdrop) mobileMenuBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    }

    function closeMenu() {
        if(mobileMenu) mobileMenu.classList.add('-translate-x-full');
        if(mobileMenuBackdrop) mobileMenuBackdrop.classList.add('opacity-0', 'pointer-events-none');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', closeMenu);
    }

    // ==========================================
    // 3. Logout Modal Logic
    // ==========================================
    // Expose functions to global scope for onclick attributes
    window.showLogoutModal = function() {
        const logoutModal = document.getElementById('logout-modal');
        if (logoutModal) logoutModal.classList.remove('hidden');
    };

    window.hideLogoutModal = function() {
        const logoutModal = document.getElementById('logout-modal');
        if (logoutModal) logoutModal.classList.add('hidden');
    };

    window.confirmLogout = function() {
        const form = document.getElementById('logout-form');
        if (form) form.submit();
    };

    // ==========================================
    // 4. Category Dropdown Logic
    // ==========================================
    window.toggleDropdown = function() {
        const dropdown = document.getElementById('dropdownMenu');
        const arrow = document.getElementById('dropdownArrow');
        if(!dropdown || !arrow) return;
        
        if (dropdown.classList.contains('invisible')) {
            dropdown.classList.remove('invisible', 'opacity-0', 'scale-95');
            dropdown.classList.add('opacity-100', 'scale-100');
            arrow.classList.add('rotate-180');
        } else {
            dropdown.classList.add('invisible', 'opacity-0', 'scale-95');
            dropdown.classList.remove('opacity-100', 'scale-100');
            arrow.classList.remove('rotate-180');
        }
    };

    window.selectCategory = function(value, label, iconClass) {
        const categoryInput = document.getElementById('categoryInput');
        const selectedCategory = document.getElementById('selectedCategory');
        
        if(categoryInput) categoryInput.value = value;
        if(selectedCategory) selectedCategory.innerHTML = `<i class="${iconClass} text-[#a51c30]"></i> ${label}`;
        window.toggleDropdown();
    };

    // Close Dropdown on Click Outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdownMenu');
        const trigger = document.getElementById('categoryDropdown');
        const arrow = document.getElementById('dropdownArrow');
        
        if (trigger && !trigger.contains(event.target) && dropdown && !dropdown.classList.contains('invisible')) {
            dropdown.classList.add('invisible', 'opacity-0', 'scale-95');
            dropdown.classList.remove('opacity-100', 'scale-100');
            if(arrow) arrow.classList.remove('rotate-180');
        }
    });

    // ==========================================
    // 5. Share Product Logic
    // ==========================================
    window.shareProduct = async function(name, url) {
        const fullUrl = window.location.origin + url;
        if (navigator.share) {
          try {
            await navigator.share({
              title: name,
              text: `Check out this ${name} on Simtech Computers!`,
              url: fullUrl,
            });
          } catch (err) {
            // Sharing cancelled or failed
          }
        } else {
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(fullUrl);
            alert("Link copied to clipboard!");
          } catch (err) {
            console.error("Failed to copy:", err);
          }
        }
    };
    // ==========================================
    // 6. Fast Navigation (Prefetching & Click Feedback)
    // ==========================================
    const siteProgressBar = document.getElementById('site-progress-bar');
    
    function prefetchLink(url) {
        if (!url || url.includes('#') || url.includes('logout')) return;
        if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
        
        const prefetch = document.createElement('link');
        prefetch.rel = 'prefetch';
        prefetch.href = url;
        document.head.appendChild(prefetch);
    }

    document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a');
        if (link && 
            link.href && 
            link.href.startsWith(window.location.origin) && 
            link.hostname === window.location.hostname &&
            !link.hasAttribute('download') &&
            link.target !== '_blank') {
            
            prefetchLink(link.href);
        }
    });

    // Instant Visual Feedback on click
    document.addEventListener('mousedown', (e) => {
        const link = e.target.closest('a');
        if (link && 
            link.href && 
            link.href.startsWith(window.location.origin) && 
            link.hostname === window.location.hostname &&
            !link.href.includes('#') &&
            !link.hasAttribute('download') &&
            link.target !== '_blank') {
            
            if (siteProgressBar) {
                siteProgressBar.style.display = 'block';
                siteProgressBar.style.opacity = '1';
                siteProgressBar.style.width = '30%';
            }
        }
    });
});
