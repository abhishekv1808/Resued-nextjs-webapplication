document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Hero Carousel Logic
    // ==========================================
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        let interval;

        function showSlide(index) {
            items.forEach(item => {
                item.classList.remove('opacity-100', 'z-10');
                item.classList.add('opacity-0', 'z-0');
            });
            indicators.forEach(ind => {
                ind.classList.remove('bg-white', 'w-8');
                ind.classList.add('bg-white/40');
            });

            if(items[index]) {
                items[index].classList.remove('opacity-0', 'z-0');
                items[index].classList.add('opacity-100', 'z-10');
            }
            if(indicators[index]) {
                indicators[index].classList.remove('bg-white/40');
                indicators[index].classList.add('bg-white', 'w-8');
            }
            
            currentIndex = index;
        }

        function nextSlide() {
            let nextIndex = (currentIndex + 1) % items.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(prevIndex);
        }

        function startAutoPlay() {
            interval = setInterval(nextSlide, 5000); // 5 seconds
        }

        function stopAutoPlay() {
            clearInterval(interval);
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            });
        }

        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            });
        }

        indicators.forEach(ind => {
            ind.addEventListener('click', (e) => {
                stopAutoPlay();
                const index = parseInt(e.target.dataset.index);
                showSlide(index);
                startAutoPlay();
            });
        });

        // Start
        startAutoPlay();
    }

    // ==========================================
    // 2. Daily Best Deals Countdown
    // ==========================================
    const countdownContainer = document.getElementById('countdown-container');
    if(countdownContainer) {
        function updateDailyCountdown() {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            
            const timeRemaining = endOfDay - now;
            
            if (timeRemaining <= 0) {
                return; 
            }
            
            const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
            const seconds = Math.floor((timeRemaining / 1000) % 60);
            
            const hEl = document.getElementById('countdown-hours');
            const mEl = document.getElementById('countdown-minutes');
            const sEl = document.getElementById('countdown-seconds');

            if(hEl) hEl.textContent = hours.toString().padStart(2, '0');
            if(mEl) mEl.textContent = minutes.toString().padStart(2, '0');
            if(sEl) sEl.textContent = seconds.toString().padStart(2, '0');
        }
        
        setInterval(updateDailyCountdown, 1000);
        updateDailyCountdown(); // Initial call
    }

    // ==========================================
    // 3. Horizontal Scroll Sections (Brands)
    // ==========================================
    document.querySelectorAll('.scroll-section').forEach(section => {
        const container = section.querySelector('.scroll-container');
        const leftBtn = section.querySelector('.scroll-left-btn');
        const rightBtn = section.querySelector('.scroll-right-btn');
        
        if(container && leftBtn && rightBtn) {
             leftBtn.addEventListener('click', () => container.scrollBy({ left: -300, behavior: 'smooth' }));
             rightBtn.addEventListener('click', () => container.scrollBy({ left: 300, behavior: 'smooth' }));
        }
    });

    // ==========================================
    // 4. General Countdown (if any .countdown-timer exists)
    // ==========================================
    const generalTimers = document.querySelectorAll('.countdown-timer');
    if(generalTimers.length > 0) {
        function updateGeneralCountdown() {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0); // Next midnight
            const distance = midnight.getTime() - now.getTime();

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            generalTimers.forEach(timer => {
                const hourEl = timer.querySelector('.hours');
                const minEl = timer.querySelector('.minutes');
                const secEl = timer.querySelector('.seconds');

                if(hourEl) hourEl.innerText = hours.toString().padStart(2, '0');
                if(minEl) minEl.innerText = minutes.toString().padStart(2, '0');
                if(secEl) secEl.innerText = seconds.toString().padStart(2, '0');
            });
        }
        setInterval(updateGeneralCountdown, 1000);
        updateGeneralCountdown();
    }

    // ==========================================
    // 5. Fix for unwanted cart icon in Monitor Banner
    // ==========================================
    const monitorBanners = document.querySelectorAll('.bg-\\[\\#eefcfc\\]');
    monitorBanners.forEach(banner => {
         const unwantedIcons = banner.querySelectorAll('.ri-shopping-cart-2-line, .ri-shopping-cart-line');
         unwantedIcons.forEach(icon => {
             const container = icon.closest('button') || icon.closest('a');
             if (container && !container.textContent.includes('Order Now')) {
                 container.style.display = 'none';
             } else if (!container) {
                 icon.style.display = 'none';
             }
         });
    });
});
