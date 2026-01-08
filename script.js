// Mobile Menu Toggle
(function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuToggle && nav) {
        // Toggle menu
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        
        // Close menu on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenuToggle.focus();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
})();

// Smooth Scroll for Navigation Anchors
(function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Calculate offset for sticky header
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

// Service Filter Chips
(function() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterChips.length === 0 || serviceCards.length === 0) return;
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active state
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter service cards
            serviceCards.forEach(card => {
                const serviceType = card.getAttribute('data-service');
                
                if (filter === 'all' || serviceType === filter) {
                    card.classList.remove('hidden');
                    // Add reveal animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                }
            });
        });
    });
})();

// Form Validation
(function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const nameError = document.getElementById('name-error');
        const phoneError = document.getElementById('phone-error');
        const formSuccess = document.getElementById('form-success');
        
        // Phone format validation regex (supports various formats)
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        
        // Validate phone format
        function validatePhone(phone) {
            // Remove spaces, dashes, parentheses for validation
            const cleaned = phone.replace(/[\s\-\(\)]/g, '');
            // Check if it's a valid phone format (at least 10 digits)
            return cleaned.length >= 10 && phoneRegex.test(phone);
        }
        
        // Validate name
        function validateName(name) {
            return name.trim().length >= 2;
        }
        
        // Show error function
        function showError(input, errorElement, message) {
            input.classList.add('error');
            errorElement.textContent = message;
        }
        
        // Clear error function
        function clearError(input, errorElement) {
            input.classList.remove('error');
            errorElement.textContent = '';
        }
        
        // Real-time validation
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (!validateName(this.value)) {
                    showError(this, nameError, 'Please enter your full name (at least 2 characters)');
                } else {
                    clearError(this, nameError);
                }
            });
            
            nameInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    clearError(this, nameError);
                }
            });
        }
        
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                if (!validatePhone(this.value)) {
                    showError(this, phoneError, 'Please enter a valid phone number');
                } else {
                    clearError(this, phoneError);
                }
            });
            
            phoneInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    clearError(this, phoneError);
                }
            });
        }
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate name
            if (!validateName(nameInput.value)) {
                showError(nameInput, nameError, 'Please enter your full name (at least 2 characters)');
                isValid = false;
            } else {
                clearError(nameInput, nameError);
            }
            
            // Validate phone
            if (!validatePhone(phoneInput.value)) {
                showError(phoneInput, phoneError, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearError(phoneInput, phoneError);
            }
            
            if (isValid) {
                // Show success message
                formSuccess.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
                formSuccess.classList.add('show');
                
                // Reset form
                contactForm.reset();
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide success message after 10 seconds
                setTimeout(function() {
                    formSuccess.classList.remove('show');
                }, 10000);
                
                // In a real application, you would send the form data to a server here
                // Example: fetch('/api/contact', { method: 'POST', body: formData })
            } else {
                // Focus on first error field
                if (nameInput.classList.contains('error')) {
                    nameInput.focus();
                } else if (phoneInput.classList.contains('error')) {
                    phoneInput.focus();
                }
            }
        });
    }
})();

// Sticky Mobile Call Bar
(function() {
    const mobileCallBar = document.getElementById('mobile-call-bar');
    
    if (mobileCallBar) {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateCallBar() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // Show call bar when scrolled down past hero section and hide when at top
            // Only show on mobile devices (screen width < 968px)
            if (window.innerWidth < 968) {
                if (scrollY > windowHeight * 0.5 && scrollY < documentHeight - windowHeight - 100) {
                    mobileCallBar.classList.add('show');
                } else {
                    mobileCallBar.classList.remove('show');
                }
            } else {
                mobileCallBar.classList.remove('show');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateCallBar);
                ticking = true;
            }
        }
        
        // Listen to scroll events
        window.addEventListener('scroll', requestTick);
        
        // Listen to resize events to handle orientation changes
        window.addEventListener('resize', function() {
            updateCallBar();
        });
        
        // Initial check
        updateCallBar();
    }
})();

// Scroll Reveal Animation (IntersectionObserver)
(function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        return; // Skip animation if user prefers reduced motion
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with reveal class
    const revealElements = document.querySelectorAll('.service-card, .timeline-step, .trust-signal-card, .testimonial-card, .pricing-card, .trust-badge-item, .faq-item');
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
})();

// Auto Copyright Year
(function() {
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
})();

// Keyboard Navigation Enhancement
(function() {
    // Ensure all interactive elements are keyboard accessible
    document.addEventListener('keydown', function(e) {
        // Handle Enter key on summary elements (FAQ)
        if (e.key === 'Enter' && e.target.tagName === 'SUMMARY') {
            e.target.click();
        }
    });
})();

// Prefers Reduced Motion Support
(function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(mediaQuery) {
        if (mediaQuery.matches) {
            // Disable smooth scrolling if user prefers reduced motion
            document.documentElement.style.scrollBehavior = 'auto';
        } else {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }
    
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);
})();

// Quick Estimate Helper
(function() {
    const emergencyToggle = document.getElementById('emergency-toggle');
    const standardCard = document.getElementById('standard-card');
    const emergencyCard = document.getElementById('emergency-card');
    const standardCta = document.querySelector('.standard-cta');
    const emergencyCta = document.querySelector('.emergency-cta');
    const toggleOptions = document.querySelectorAll('.toggle-option');
    
    if (!emergencyToggle) return;
    
    // Initialize: Standard mode (No = active)
    standardCard.classList.add('highlighted', 'featured');
    
    emergencyToggle.addEventListener('click', function() {
        const isEmergency = this.getAttribute('aria-pressed') === 'true';
        const newState = !isEmergency;
        
        this.setAttribute('aria-pressed', newState);
        
        // Update toggle visual state
        toggleOptions.forEach(option => {
            option.classList.remove('active');
            if ((newState && option.dataset.value === 'yes') || 
                (!newState && option.dataset.value === 'no')) {
                option.classList.add('active');
            }
        });
        
        // Update card highlighting and CTAs
        if (newState) {
            // Emergency mode
            emergencyCard.classList.add('highlighted');
            standardCard.classList.remove('highlighted', 'featured');
            if (emergencyCta) {
                emergencyCta.textContent = 'Call for emergency';
                emergencyCta.classList.remove('btn-outline');
                emergencyCta.classList.add('btn-primary');
            }
            if (standardCta) {
                standardCta.textContent = 'Get Quote';
            }
        } else {
            // Standard mode
            standardCard.classList.add('highlighted', 'featured');
            emergencyCard.classList.remove('highlighted');
            if (standardCta) {
                standardCta.textContent = 'Get Quote';
            }
            if (emergencyCta) {
                emergencyCta.textContent = 'Call Now';
                emergencyCta.classList.remove('btn-primary');
                emergencyCta.classList.add('btn-outline');
            }
        }
    });
    
    // Keyboard support
    emergencyToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
})();

// Active Section Highlighting
(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observerOptions = {
        rootMargin: prefersReducedMotion.matches ? '-20% 0px -70% 0px' : '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Handle initial state
    const firstSection = sections[0];
    if (firstSection) {
        const firstId = firstSection.getAttribute('id');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${firstId}`) {
                link.classList.add('active');
            }
        });
    }
})();
