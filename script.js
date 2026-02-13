
// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
        }
    });
});

// ==================
// NAVIGATION
// ==================

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Active navigation on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

if (sections.length && navItems.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// ==================
// DONOR REGISTRATION FORM
// ==================

const donorForm = document.getElementById('donorRegistrationForm');

if (donorForm) {
    let currentStep = 1;
    const totalSteps = 3;
    
    // Update step indicators
    function updateStepIndicators() {
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Show specific step
    function showStep(step) {
        const formSteps = document.querySelectorAll('.form-step');
        formSteps.forEach(s => s.classList.remove('active'));
        const targetStep = document.querySelector(`[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Next button handlers
    const nextButtons = donorForm.querySelectorAll('.btn-next');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--primary-red)';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (isValid && currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
                updateStepIndicators();
            } else if (!isValid) {
                alert('Please fill in all required fields');
            }
        });
    });
    
    // Previous button handlers
    const prevButtons = donorForm.querySelectorAll('.btn-prev');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                updateStepIndicators();
            }
        });
    });
    
    // Conditional fields
    const chronicDiseases = document.getElementById('chronicDiseases');
    const diseaseDetailsGroup = document.getElementById('diseaseDetailsGroup');
    
    if (chronicDiseases && diseaseDetailsGroup) {
        chronicDiseases.addEventListener('change', function() {
            diseaseDetailsGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    const currentMedication = document.getElementById('currentMedication');
    const medicationDetailsGroup = document.getElementById('medicationDetailsGroup');
    
    if (currentMedication && medicationDetailsGroup) {
        currentMedication.addEventListener('change', function() {
            medicationDetailsGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    // Form submission
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(donorForm);
        const data = Object.fromEntries(formData);
        
        console.log('Donor Registration Data:', data);
        
        // Show success message
        alert('Thank you for registering as a blood donor! Your application will be reviewed by our admin team. You will receive a confirmation email within 24 hours.');
        
        // In production, send data to server
        // fetch('/api/donor-register', { method: 'POST', body: JSON.stringify(data) })
        
        // Redirect or reset form
        window.location.href = 'index.html';
    });
}

// ==================
// BLOOD REQUEST FORM
// ==================

const bloodRequestForm = document.getElementById('bloodRequestForm');

if (bloodRequestForm) {
    // Set minimum date to today
    const requiredDate = document.getElementById('requiredDate');
    if (requiredDate) {
        const today = new Date().toISOString().split('T')[0];
        requiredDate.setAttribute('min', today);
    }
    
    // Form submission
    bloodRequestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(bloodRequestForm);
        const data = Object.fromEntries(formData);
        
        console.log('Blood Request Data:', data);
        
        // Show success message
        alert(`Blood request submitted successfully!\n\nRequest Details:\nPatient: ${data.patientName}\nBlood Group: ${data.requiredBloodGroup}\nUnits: ${data.unitsRequired}\nHospital: ${data.hospitalName}\n\nOur team will contact you shortly with available donors.`);
        
        // In production, send data to server
        // fetch('/api/blood-request', { method: 'POST', body: JSON.stringify(data) })
        
        // Redirect or reset
        window.location.href = 'index.html';
    });
}

// ==================
// CONTACT FORM
// ==================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
                alert('Thank you for your message! We will get back to you soon.');
            }, 2000);
        }, 1500);
    });
}

// ==================
// ADMIN LOGIN
// ==================

const adminLoginForm = document.getElementById('adminLoginForm');

if (adminLoginForm) {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('adminPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }
    
    // Login form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        // Demo login credentials - Multiple valid credentials
        const validCredentials = [
            { user: 'admin', pass: 'admin123' },
            { user: 'admin', pass: 'admin' },
            { user: 'administrator', pass: 'admin123' }
        ];
        
        const isValid = validCredentials.some(cred => 
            username.toLowerCase() === cred.user && password === cred.pass
        );
        
        if (isValid) {
            // Store login session
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username);
            sessionStorage.setItem('adminLoginTime', new Date().toISOString());
            
            // Show loading
            const submitBtn = this.querySelector('.btn-login');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Logging in...</span>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 800);
        } else {
            alert('Invalid credentials!\n\nTry:\nUsername: admin\nPassword: admin123\n\nOR\n\nUsername: admin\nPassword: admin');
        }
    });
}

// ==================
// ADMIN DASHBOARD
// ==================

// Function to check admin authentication
function checkAdminAuth() {
    const isDashboard = document.querySelector('.dashboard-page');
    if (!isDashboard) return;
    
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    
    // For demo purposes, allow access or redirect after showing message
    if (!isLoggedIn) {
        const allowDemo = confirm('Admin authentication required.\n\nClick OK to continue in DEMO mode or Cancel to login.');
        if (allowDemo) {
            // Set demo session
            sessionStorage.setItem('adminLoggedIn', 'demo');
            sessionStorage.setItem('adminUsername', 'Demo Admin');
            console.log('Running in DEMO mode');
        } else {
            window.location.href = 'admin-login.html';
            return;
        }
    }
    
    // Initialize dashboard
    initializeDashboard();
}

// Initialize dashboard after auth check
function initializeDashboard() {
    console.log('Dashboard initialized successfully');
    
    // Set admin username display
    const adminUsername = sessionStorage.getItem('adminUsername') || 'Admin User';
    const isDirect = sessionStorage.getItem('directAccess');
    
    const userNameEl = document.getElementById('adminUserName');
    const userRoleEl = document.getElementById('adminUserRole');
    
    if (userNameEl) {
        userNameEl.textContent = adminUsername;
    }
    
    if (userRoleEl && isDirect) {
        userRoleEl.textContent = 'Demo Mode';
        userRoleEl.style.color = '#F59E0B';
    }
    
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const dashboardSidebar = document.getElementById('dashboardSidebar');
    
    if (sidebarToggle && dashboardSidebar) {
        sidebarToggle.addEventListener('click', () => {
            dashboardSidebar.classList.toggle('active');
        });
    }
    
    // Navigation between sections
    const dashboardNavItems = document.querySelectorAll('.nav-item[data-section]');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    
    if (dashboardNavItems.length) {
        dashboardNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetSection = this.getAttribute('data-section');
                
                // Update active nav item
                dashboardNavItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Show target section
                dashboardSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetSection) {
                        section.classList.add('active');
                    }
                });
                
                // Close sidebar on mobile
                if (dashboardSidebar) {
                    dashboardSidebar.classList.remove('active');
                }
            });
        });
    }
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminUsername');
                window.location.href = 'admin-login.html';
            }
        });
    }
    
    // Table action buttons
    const approveButtons = document.querySelectorAll('.btn-icon-action.approve');
    approveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Approve this blood request?')) {
                const row = this.closest('tr');
                const statusBadge = row.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.className = 'status-badge approved';
                    statusBadge.textContent = 'Approved';
                }
                alert('Blood request approved! Donors will be notified.');
            }
        });
    });
    
    const editButtons = document.querySelectorAll('.btn-icon-action.edit');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Edit functionality would open a modal/form to edit this record.');
        });
    });
    
    const deleteButtons = document.querySelectorAll('.btn-icon-action.delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
                const row = this.closest('tr');
                row.style.opacity = '0';
                setTimeout(() => row.remove(), 300);
                alert('Record deleted successfully.');
            }
        });
    });
    
    // Select all checkbox
    const selectAll = document.querySelector('.select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }
    
    // Refresh button
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('svg');
            icon.style.animation = 'spin 0.5s ease';
            setTimeout(() => {
                icon.style.animation = '';
                alert('Data refreshed!');
            }, 500);
        });
    }
}
// ==================
// BLOOD CARD CLICKS
// ==================

const bloodCards = document.querySelectorAll('.blood-card');

bloodCards.forEach(card => {
    card.addEventListener('click', function() {
        const bloodGroup = this.getAttribute('data-group');
        
        if (bloodGroup) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, transparent 70%);
                border-radius: inherit;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // In production, this would navigate to search results
            alert(`Searching for ${bloodGroup} blood donors...\n\nThis would take you to a page showing all available ${bloodGroup} donors in your area.`);
        }
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ==================
// PHONE NUMBER FORMATTING
// ==================

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('880')) {
            value = value.substring(3);
        }
        
        if (value.length > 0) {
            if (value.length <= 4) {
                e.target.value = '+880 ' + value;
            } else if (value.length <= 11) {
                e.target.value = '+880 ' + value.slice(0, 4) + '-' + value.slice(4);
            } else {
                e.target.value = '+880 ' + value.slice(0, 4) + '-' + value.slice(4, 10);
            }
        }
    });
});

// ==================
// FORM VALIDATION
// ==================

// Add real-time validation feedback
const allInputs = document.querySelectorAll('input[required], select[required], textarea[required]');

allInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = 'var(--primary-red)';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '';
        }
    });
});

// Email validation
const emailInputs = document.querySelectorAll('input[type="email"]');

emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = 'var(--primary-red)';
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.style.borderColor = '';
            this.setCustomValidity('');
        }
    });
});

// ==================
// SCROLL TO TOP
// ==================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else if (navbar) {
        navbar.style.boxShadow = '';
    }
});

// ==================
// BUTTON ANIMATIONS
// ==================

const allButtons = document.querySelectorAll('button:not(.toggle-password):not(.sidebar-toggle)');

allButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.disabled) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }
    });
});

// ==================
// PAGE LOAD EVENTS
// ==================

window.addEventListener('load', function() {
    console.log('%c Blood Bank Bangladesh ', 'background: #DC143C; color: white; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Professional Blood Donation Management System ', 'color: #DC143C; font-size: 14px; font-weight: bold;');
    console.log('%c Developed by Team Spy ', 'color: #666; font-size: 12px; font-style: italic;');
    console.log(' ');
    console.log('All pages loaded successfully!');
    console.log('- Home Page');
    console.log('- Donor Registration');
    console.log('- Blood Request');
    console.log('- Admin Login');
    console.log('- Admin Dashboard');
});

// ==================
// OFFLINE DETECTION
// ==================

window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    alert('You are currently offline. Some features may not be available.');
});

// ==================
// PREVENT FORM RESUBMISSION
// ==================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ==================
// ACCESSIBILITY
// ==================

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes modals/menus
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links.active');
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        
        const sidebar = document.querySelector('.dashboard-sidebar.active');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
});

// Focus management for forms
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        const firstInvalidField = this.querySelector('input:invalid, select:invalid, textarea:invalid');
        if (firstInvalidField) {
            e.preventDefault();
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

console.log('✅ All interactive features loaded successfully!');
