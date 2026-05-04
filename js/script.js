/*
NIRANYA DEVELOPERS LLP – Website JavaScript
Handles: Navigation, Animations, Gallery, Counters, etc.
*/

document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => preloader?.classList.add('hidden'), 800);
    });

    setTimeout(() => preloader?.classList.add('hidden'), 3000);


    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero-section');

    function handleScroll() {
        const scrollY = window.scrollY;

        navbar?.classList.toggle('scrolled', scrollY > 50);
        backToTop?.classList.toggle('visible', scrollY > 600);

        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;

            if (scrollY >= top && scrollY < top + height) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu?.contains(e.target) && !navToggle?.contains(e.target)) {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const offset = 70;
            const y = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });


    const animatedElements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

        animatedElements.forEach(el => observer.observe(el));
    }


    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const section = document.querySelector('.hero-stats');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;

            counters.forEach(counter => {
                const target = Number(counter.dataset.count) || 0;
                const duration = 2000;
                const start = performance.now();

                function update(time) {
                    const progress = Math.min((time - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const value = Math.floor(ease * target);

                    counter.textContent = target >= 1000
                        ? value.toLocaleString('en-IN')
                        : value;

                    if (progress < 1) requestAnimationFrame(update);
                }

                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();


    const tabBtns = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });


    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let index = 0;

    if (lightbox && lightboxImg && galleryItems.length > 0) {

        function openLightbox(i) {
            const img = galleryItems[i]?.querySelector('img');
            if (!img) return;

            index = i;
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function next() {
            index = (index + 1) % galleryItems.length;
            openLightbox(index);
        }

        function prev() {
            index = (index - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(index);
        }

        galleryItems.forEach((item, i) =>
            item.addEventListener('click', () => openLightbox(i))
        );

        document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next')?.addEventListener('click', next);
        document.querySelector('.lightbox-prev')?.addEventListener('click', prev);

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });
    }


    const form = document.getElementById('contactForm');

    form?.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showFormMessage('Please fill all fields', 'error');
            return;
        }

        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        setTimeout(() => {
            btn.textContent = 'Message Sent';
            form.reset();
            btn.disabled = false;
        }, 1500);
    });

    function showFormMessage(msg, type) {
        if (!form) return;

        const div = document.createElement('div');
        div.textContent = msg;
        div.className = `form-message ${type}`;
        form.prepend(div);
        setTimeout(() => div.remove(), 4000);
    }


    const container = document.getElementById('heroParticles');

    if (container) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 3 + 1;

            Object.assign(p.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                background: `rgba(200,162,92,${Math.random() * 0.3 + 0.1})`,
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particleFloat ${Math.random() * 8 + 6}s infinite`
            });

            container.appendChild(p);
        }
    }

});
