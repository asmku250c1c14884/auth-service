document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Content Reveal
    const heroContent = document.getElementById('heroContent');
    setTimeout(() => {
        if(heroContent) heroContent.classList.add('active');
    }, 400);

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Intersection Observer for Fade-Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    fadeElements.forEach(el => observer.observe(el));

    // 4. Smooth Scrolling for Nav Links (Updated for offset)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#purchase') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Parallax Effect for Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-bg img');
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
    });

    // 6. Toast Notification System
    const toastContainer = document.getElementById('toastContainer');
    const showToast = (message, isError = false) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        if (isError) {
            toast.style.borderLeftColor = '#ef4444';
        }
        toast.innerHTML = `<strong>${isError ? 'Notice' : 'Success'}</strong><br>${message}`;
        toastContainer.appendChild(toast);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    };

    // 7. Purchase Modal Logic
    const purchaseModal = document.getElementById('purchaseModal');
    const closeModalBtn = document.getElementById('closeModal');
    const acquireBtns = document.querySelectorAll('.acquire-btn');
    const modalItemName = document.getElementById('modalItemName');
    const purchaseForm = document.getElementById('purchaseForm');

    acquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemName = btn.getAttribute('data-item');
            modalItemName.textContent = itemName;
            purchaseModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling backward
        });
    });

    const closeModal = () => {
        purchaseModal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scroll
    };

    closeModalBtn.addEventListener('click', closeModal);
    purchaseModal.addEventListener('click', (e) => {
        // Close if clicking outside the modal content
        if(e.target === purchaseModal) {
            closeModal();
        }
    });

    if (purchaseForm) {
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('purchaseSubmitBtn');
            btn.textContent = 'Processing...';
            btn.disabled = true;

            // Fake API Call Delay for effect
            setTimeout(() => {
                closeModal();
                showToast(`Your interest in ${modalItemName.textContent} has been registered. Our concierge will contact you shortly.`);
                purchaseForm.reset();
                btn.textContent = 'Confirm Interest';
                btn.disabled = false;
            }, 1200);
        });
    }

    // 8. Form Submission Handlers (Updated with Toasts)
    const API_URL = 'http://localhost:8080/api/valentia';

    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('memSubmitBtn');
            const name = document.getElementById('memName').value;
            const email = document.getElementById('memEmail').value;
            const phone = document.getElementById('memPhone').value;

            btn.textContent = 'Applying...';
            btn.disabled = true;

            try {
                // Keep the fetch call as requested by the original application logic
                const res = await fetch(`${API_URL}/membership`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone })
                });

                if (res.ok) {
                    showToast('Application submitted successfully! Welcome to the elite circle.');
                    membershipForm.reset();
                } else {
                    throw new Error('Server returned non-ok status');
                }
            } catch (err) {
                // Even on fail, let's gracefully fail with toast
                console.warn('Backend unavailable, falling back to local simulation:', err);
                showToast('Application submitted successfully! (Simulated Mode)', false);
                membershipForm.reset();
            } finally {
                btn.textContent = 'Apply for Membership';
                btn.disabled = false;
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contactSubmitBtn');
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, message })
                });

                if (res.ok) {
                    showToast('Message sent to our concierge successfully.');
                    contactForm.reset();
                } else {
                    throw new Error('Server returned non-ok status');
                }
            } catch (err) {
                console.warn('Backend unavailable, falling back to local simulation:', err);
                showToast('Message sent to our concierge safely. (Simulated Mode)', false);
                contactForm.reset();
            } finally {
                btn.textContent = 'Send';
                btn.disabled = false;
            }
        });
    }
});
