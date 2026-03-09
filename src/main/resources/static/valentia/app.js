document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Content Reveal
    const heroContent = document.getElementById('heroContent');
    setTimeout(() => {
        heroContent.classList.add('active');
    }, 500);

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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 4. Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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
            heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // 6. Form Submission Handlers
    const API_URL = '/api/valentia';

    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        membershipForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('memSubmitBtn');
            const status = document.getElementById('memStatus');
            const name = document.getElementById('memName').value;
            const email = document.getElementById('memEmail').value;
            const phone = document.getElementById('memPhone').value;

            btn.textContent = 'Applying...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/membership`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone })
                });

                if (res.ok) {
                    status.style.color = 'var(--gold)';
                    status.textContent = 'Application submitted successfully! We will contact you soon.';
                    membershipForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                status.style.color = '#ef4444';
                status.textContent = 'Failed to submit application. Please try again later.';
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
            const status = document.getElementById('contactStatus');
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
                    status.style.color = 'var(--gold)';
                    status.textContent = 'Message sent successfully!';
                    contactForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                status.style.color = '#ef4444';
                status.textContent = 'Failed to send message.';
            } finally {
                btn.textContent = 'Send';
                btn.disabled = false;
            }
        });
    }
});
