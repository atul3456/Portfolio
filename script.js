/* ===========================
   ATUL VISHWAKARMA PORTFOLIO
   Three.js 3D + Interactions
   =========================== */

// ========================
// LOADING SCREEN
// ========================
(function initLoader() {
    const fill = document.getElementById('loader-fill');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
            }, 500);
        }
        fill.style.width = progress + '%';
    }, 200);
})();

// ========================
// THREE.JS 3D SCENE
// ========================
(function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    camera.position.z = 30;

    // === Floating Particles ===
    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = [];

    const palette = [
        new THREE.Color(0x06b6d4), // cyan
        new THREE.Color(0x0891b2), // dark cyan
        new THREE.Color(0x22d3ee), // light cyan
        new THREE.Color(0x10b981), // emerald
        new THREE.Color(0x34d399), // light emerald
    ];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 80;
        positions[i3 + 2] = (Math.random() - 0.5) * 60;

        const col = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;

        sizes[i] = Math.random() * 2 + 0.5;

        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.005,
        });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // === Floating Geometric Shapes ===
    const shapes = [];

    // Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(-15, 8, -10);
    scene.add(ico);
    shapes.push({ mesh: ico, rotSpeed: { x: 0.003, y: 0.005, z: 0.002 }, float: { amp: 0.5, speed: 0.5, offset: 0 } });

    // Wireframe Octahedron
    const octGeo = new THREE.OctahedronGeometry(2.5, 0);
    const octMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
    });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(18, -5, -8);
    scene.add(oct);
    shapes.push({ mesh: oct, rotSpeed: { x: 0.004, y: 0.003, z: 0.006 }, float: { amp: 0.7, speed: 0.4, offset: 1 } });

    // Wireframe Torus
    const torGeo = new THREE.TorusGeometry(2, 0.5, 8, 20);
    const torMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    const tor = new THREE.Mesh(torGeo, torMat);
    tor.position.set(12, 12, -15);
    scene.add(tor);
    shapes.push({ mesh: tor, rotSpeed: { x: 0.005, y: 0.002, z: 0.004 }, float: { amp: 0.4, speed: 0.6, offset: 2 } });

    // Wireframe Tetrahedron
    const tetGeo = new THREE.TetrahedronGeometry(2, 0);
    const tetMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: 0.13,
    });
    const tet = new THREE.Mesh(tetGeo, tetMat);
    tet.position.set(-18, -10, -12);
    scene.add(tet);
    shapes.push({ mesh: tet, rotSpeed: { x: 0.006, y: 0.004, z: 0.003 }, float: { amp: 0.6, speed: 0.35, offset: 3 } });

    // === Connection Lines ===
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(300 * 6); // max 300 lines
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // === Mouse Interaction ===
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // === Scroll-based camera movement ===
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });

    // === Animation loop ===
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Smooth mouse follow
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Rotate particle field
        particles.rotation.y = elapsed * 0.03 + mouse.x * 0.3;
        particles.rotation.x = mouse.y * 0.15;

        // Animate individual particles
        const posArr = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            posArr[i3] += velocities[i].x;
            posArr[i3 + 1] += velocities[i].y;
            posArr[i3 + 2] += velocities[i].z;

            // Boundary wrap
            if (posArr[i3] > 40) posArr[i3] = -40;
            if (posArr[i3] < -40) posArr[i3] = 40;
            if (posArr[i3 + 1] > 40) posArr[i3 + 1] = -40;
            if (posArr[i3 + 1] < -40) posArr[i3 + 1] = 40;
        }
        particleGeometry.attributes.position.needsUpdate = true;

        // Update connection lines (connect nearby particles)
        const linePosArr = lineGeometry.attributes.position.array;
        let lineIdx = 0;
        const maxDist = 6;
        const step = 10; // Check every Nth particle for performance
        for (let i = 0; i < particleCount && lineIdx < 300; i += step) {
            for (let j = i + step; j < particleCount && lineIdx < 300; j += step) {
                const i3 = i * 3;
                const j3 = j * 3;
                const dx = posArr[i3] - posArr[j3];
                const dy = posArr[i3 + 1] - posArr[j3 + 1];
                const dz = posArr[i3 + 2] - posArr[j3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDist) {
                    const li = lineIdx * 6;
                    linePosArr[li] = posArr[i3];
                    linePosArr[li + 1] = posArr[i3 + 1];
                    linePosArr[li + 2] = posArr[i3 + 2];
                    linePosArr[li + 3] = posArr[j3];
                    linePosArr[li + 4] = posArr[j3 + 1];
                    linePosArr[li + 5] = posArr[j3 + 2];
                    lineIdx++;
                }
            }
        }
        // Clear remaining lines
        for (let i = lineIdx; i < 300; i++) {
            const li = i * 6;
            linePosArr[li] = 0; linePosArr[li + 1] = 0; linePosArr[li + 2] = 0;
            linePosArr[li + 3] = 0; linePosArr[li + 4] = 0; linePosArr[li + 5] = 0;
        }
        lineGeometry.attributes.position.needsUpdate = true;

        // Animate shapes
        shapes.forEach(s => {
            s.mesh.rotation.x += s.rotSpeed.x;
            s.mesh.rotation.y += s.rotSpeed.y;
            s.mesh.rotation.z += s.rotSpeed.z;
            s.mesh.position.y += Math.sin(elapsed * s.float.speed + s.float.offset) * 0.005;
        });

        // Camera parallax from scroll
        camera.position.y = -scrollY * 0.005;
        camera.position.x = mouse.x * 2;
        camera.lookAt(0, -scrollY * 0.005, 0);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ========================
// CUSTOM CURSOR
// ========================
(function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (!cursor || !follower) return;

    let cx = 0, cy = 0;
    let fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
        cx = e.clientX;
        cy = e.clientY;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
    });

    function updateFollower() {
        fx += (cx - fx) * 0.12;
        fy += (cy - fy) * 0.12;
        follower.style.left = fx + 'px';
        follower.style.top = fy + 'px';
        requestAnimationFrame(updateFollower);
    }
    updateFollower();

    // Hover expand effect
    const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .social-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '12px';
            cursor.style.height = '12px';
            cursor.style.background = '#34d399';
            follower.style.width = '50px';
            follower.style.height = '50px';
            follower.style.borderColor = '#22d3ee';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursor.style.background = '#06b6d4';
            follower.style.width = '36px';
            follower.style.height = '36px';
            follower.style.borderColor = '#22d3ee';
        });
    });
})();

// ========================
// NAVIGATION + SCROLL PROGRESS + LOGO EFFECTS
// ========================
(function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const logo = document.getElementById('nav-logo');
    const logoName = logo ? logo.querySelector('.logo-name') : null;
    const scrollProgress = document.getElementById('scroll-progress');

    // Scroll effect + progress bar
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (currentScroll / maxScroll) * 100;

        // Scroll progress bar
        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }

        // Nav background
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Logo scroll-reactive — glows when scrolled
        if (logo) {
            if (currentScroll > 100) {
                logo.classList.add('scroll-active');
            } else {
                logo.classList.remove('scroll-active');
            }
        }
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Logo Text Scramble on Hover ----
    if (logoName) {
        const originalText = logoName.textContent;
        const chars = '!<>-_\\/[]{}—=+*^?#_@$%01';
        let scrambleInterval = null;

        logoName.addEventListener('mouseenter', () => {
            let iteration = 0;
            clearInterval(scrambleInterval);

            scrambleInterval = setInterval(() => {
                logoName.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iteration >= originalText.length) {
                    clearInterval(scrambleInterval);
                }
                iteration += 1 / 2;
            }, 40);
        });

        logoName.addEventListener('mouseleave', () => {
            clearInterval(scrambleInterval);
            logoName.textContent = originalText;
        });
    }
})();

// ========================
// TYPEWRITER EFFECT
// ========================
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const texts = [
        'Frontend Developer',
        'Python Enthusiast',
        'B.Sc. CS Student',
        'Open Source Contributor',
        'UI/UX Explorer',
    ];

    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 100;

    function type() {
        const current = texts[textIdx];

        if (isDeleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            speed = 50;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            speed = 100;
        }

        if (!isDeleting && charIdx === current.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            textIdx = (textIdx + 1) % texts.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    // Start after loading
    setTimeout(type, 2800);
})();

// ========================
// SCROLL ANIMATIONS
// ========================
(function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate skill bars
                    if (entry.target.classList.contains('skills-grid') || entry.target.closest('.skills-grid')) {
                        animateSkillBars();
                    }
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animation]').forEach(el => {
        observer.observe(el);
    });

    // Also observe project cards individually
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // Also observe section headers for line expand + title glow
    document.querySelectorAll('.section-header').forEach(header => {
        observer.observe(header);
    });

    // Also observe contact content for social card stagger
    document.querySelectorAll('.contact-content').forEach(el => {
        observer.observe(el);
    });
})();

// ========================
// SKILL BARS ANIMATION
// ========================
function animateSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
        const level = bar.dataset.level;
        setTimeout(() => {
            bar.style.width = level + '%';
        }, 300);
    });
}

// ========================
// COUNTER ANIMATION
// ========================
(function initCounters() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = parseInt(counter.dataset.count);
                        let current = 0;
                        const increment = target / 40;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target;
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current);
                            }
                        }, 50);
                    });
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
})();

// ========================
// SMOOTH SCROLL
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================
// SCROLL INDICATOR FADE
// ========================
(function initScrollFade() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '1';
        }
    });
})();

// ========================
// TILT EFFECT ON CARDS
// ========================
(function initTilt() {
    const cards = document.querySelectorAll('.project-card, .skill-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();

// ========================
// MAGNETIC BUTTONS
// ========================
(function initMagnetic() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
})();

// ========================
// ACTIVE NAV LINK HIGHLIGHT
// ========================
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.style.color = '';
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.style.color = 'var(--accent-3)';
                        }
                    });
                }
            });
        },
        { threshold: 0.3 }
    );

    sections.forEach(section => observer.observe(section));
})();

console.log('%c🚀 Portfolio by Atul Vishwakarma', 'color: #06b6d4; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with Three.js & ❤️', 'color: #10b981; font-size: 12px;');
