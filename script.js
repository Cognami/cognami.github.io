
/**
 * COGNAMI CORE SCRIPTS
 * Handles: Node Graph Animation, Mobile Navigation, Form Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
    initNodeGraph();
    initMobileMenu();
    initCoreDirectivesNav();
});

/* -------------------------------------------------------------------------- */
/*                                Node Graph Animation                        */
/* -------------------------------------------------------------------------- */
function initNodeGraph() {
    const canvas = document.getElementById('node-graph-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let nodes = [];
    let mouse = { x: null, y: null };

    // Config
    const NODE_COUNT_FACTOR = 15000;
    const MAX_LINK_DISTANCE = 150;
    const MOUSE_INTERACTION_RADIUS = 200;
    const NODE_COLORS = ['#FF4500', '#FFD700', '#888888'];

    class Node {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        nodes = [];
        const nodeCount = Math.floor((width * height) / NODE_COUNT_FACTOR);

        for (let i = 0; i < nodeCount; i++) {
            let radius = Math.random() * 1.5 + 0.5;
            let x = Math.random() * width;
            let y = Math.random() * height;
            let color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
            nodes.push(new Node(x, y, radius, color));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, width, height);

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MAX_LINK_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(136, 136, 136, ${1 - distance / MAX_LINK_DISTANCE})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse Interaction
            if (mouse.x && mouse.y) {
                const dx = nodes[i].x - mouse.x;
                const dy = nodes[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < MOUSE_INTERACTION_RADIUS) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 69, 0, ${0.5 - distance / MOUSE_INTERACTION_RADIUS})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resize();
    animate();
}

/* -------------------------------------------------------------------------- */
/*                                Mobile Menu                                 */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
    });
}

/* -------------------------------------------------------------------------- */
/*                            Core Directives Nav                             */
/* -------------------------------------------------------------------------- */
function initCoreDirectivesNav() {
    const navLinks = document.querySelectorAll('aside nav a');
    const sections = document.querySelectorAll('main article');

    if (!navLinks.length || !sections.length) return;

    // Configuration for states
    const activeClasses = ['bg-primary/20', 'border-primary'];
    const inactiveClasses = ['hover:bg-white/5', 'border-transparent', 'hover:border-white/20'];

    const textActiveClasses = ['text-secondary'];
    const textInactiveClasses = ['text-white/80', 'group-hover:text-white'];

    // Section Highlight Classes
    const sectionActiveClasses = ['border-primary/50', 'bg-primary/5', 'shadow-[0_0_30px_-10px_rgba(255,69,0,0.3)]'];
    const sectionInactiveClasses = ['border-white/10', 'bg-white/[.02]', 'hover:bg-white/5'];

    function setActive(link) {
        // Reset all links
        navLinks.forEach(l => {
            l.classList.remove(...activeClasses);
            l.classList.add(...inactiveClasses);

            const p = l.querySelector('p');
            if (p) {
                p.classList.remove(...textActiveClasses);
                p.classList.add(...textInactiveClasses);
            }
        });

        // Set active link
        link.classList.remove(...inactiveClasses);
        link.classList.add(...activeClasses);

        const p = link.querySelector('p');
        if (p) {
            p.classList.remove(...textInactiveClasses);
            p.classList.add(...textActiveClasses);
        }

        // Handle Section Highlighting
        const targetId = link.getAttribute('href').substring(1);
        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove(...sectionInactiveClasses);
                section.classList.add(...sectionActiveClasses);
            } else {
                section.classList.remove(...sectionActiveClasses);
                section.classList.add(...sectionInactiveClasses);
            }
        });
    }

    // Click Handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Allow default behavior (scrolling)
            setActive(link);
        });
    });

    // Scroll Spy using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80% 0px', // Trigger when section is near top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`aside nav a[href="#${id}"]`);
                if (activeLink) {
                    setActive(activeLink);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}
