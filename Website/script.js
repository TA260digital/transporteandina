/* ==========================================================================
   TRANSPORTE ANDINA - SCRIPT LOGIC
   Loader, Parallax Video, 3D Tilt Hover effect, Floating Bar, Reveal on scroll & Leaflet Map Area
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Loader Dismissal
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 600);
    }

    // Mobile Navbar Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const icon = menuToggle.querySelector("i");
            if (navMenu.classList.contains("open")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    }

    // Scroll Reveal Entry Animations
    const revealElements = document.querySelectorAll(".reveal");
    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", checkReveal);
    // Initial load check
    setTimeout(checkReveal, 800);

    // Parallax global background video on subpages, autoplay + fade to floating canvas elements on homepage
    const globalVideo = document.getElementById("globalVideo");
    const canvas = document.getElementById("floatingParticlesCanvas");
    if (globalVideo || canvas) {
        const isHomepage = window.location.pathname.endsWith("index.html") || 
                           window.location.pathname.endsWith("animada.html") || 
                           window.location.pathname === "/" || 
                           window.location.pathname.endsWith("/") ||
                           window.location.pathname === "";
        
        const setupParticleSystem = (canvasElement, videoElement, runImmediately) => {
            if (!canvasElement) return;
            const ctx = canvasElement.getContext("2d");
            let particles = [];
            const maxParticles = 65;

            const resizeCanvas = () => {
                canvasElement.width = window.innerWidth;
                canvasElement.height = window.innerHeight;
            };
            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();

            class Particle {
                constructor() {
                    this.x = Math.random() * canvasElement.width;
                    this.y = Math.random() * canvasElement.height;
                    this.vx = (Math.random() - 0.5) * 0.8;
                    this.vy = (Math.random() - 0.5) * 0.8;
                    this.size = Math.random() * 3.5 + 3;
                    this.type = Math.random() > 0.7 ? 'arrow' : 'dot';
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0) this.x = canvasElement.width;
                    if (this.x > canvasElement.width) this.x = 0;
                    if (this.y < 0) this.y = canvasElement.height;
                    if (this.y > canvasElement.height) this.y = 0;
                }
                draw() {
                    if (this.type === 'dot') {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(228, 192, 80, 0.65)';
                        ctx.fill();
                    } else {
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        const angle = Math.atan2(this.vy, this.vx);
                        ctx.rotate(angle);
                        ctx.beginPath();
                        ctx.moveTo(-10, -7);
                        ctx.lineTo(0, 0);
                        ctx.lineTo(-10, 7);
                        ctx.strokeStyle = '#E4C050';
                        ctx.lineWidth = 2.4;
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            const getBezierPoint = (t, p0, p1, p2, p3) => {
                const cx = 3 * (p1.x - p0.x);
                const bx = 3 * (p2.x - p1.x) - cx;
                const ax = p3.x - p0.x - cx - bx;
                const cy = 3 * (p1.y - p0.y);
                const by = 3 * (p2.y - p1.y) - cy;
                const ay = p3.y - p0.y - cy - by;
                const x = ((ax * t + bx) * t + cx) * t + p0.x;
                const y = ((ay * t + by) * t + cy) * t + p0.y;
                return { x, y };
            };

            const getBezierTangent = (t, p0, p1, p2, p3) => {
                const cx = 3 * (p1.x - p0.x);
                const bx = 3 * (p2.x - p1.x) - cx;
                const ax = p3.x - p0.x - cx - bx;
                const cy = 3 * (p1.y - p0.y);
                const by = 3 * (p2.y - p1.y) - cy;
                const ay = p3.y - p0.y - cy - by;
                const dx = (3 * ax * t + 2 * bx) * t + cx;
                const dy = (3 * ay * t + 2 * by) * t + cy;
                return { x: dx, y: dy };
            };

            const drawTruckOnRoute = (x, y, angle) => {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(-12, -8);
                ctx.lineTo(0, 0);
                ctx.lineTo(-12, 8);
                ctx.strokeStyle = '#E4C050';
                ctx.lineWidth = 3.0;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#E4C050';
                ctx.stroke();
                ctx.restore();
            };

            const drawLogisticHighways = (timestamp) => {
                ctx.save();
                ctx.setLineDash([8, 8]);
                ctx.lineWidth = 1.8;
                ctx.strokeStyle = 'rgba(228, 192, 80, 0.22)';

                const pA_start = { x: canvasElement.width * 0.05, y: canvasElement.height * 0.2 };
                const pA_cp1 = { x: canvasElement.width * 0.4, y: canvasElement.height * 0.25 };
                const pA_cp2 = { x: canvasElement.width * 0.6, y: canvasElement.height * 0.75 };
                const pA_end = { x: canvasElement.width * 0.95, y: canvasElement.height * 0.8 };

                ctx.beginPath();
                ctx.moveTo(pA_start.x, pA_start.y);
                ctx.bezierCurveTo(pA_cp1.x, pA_cp1.y, pA_cp2.x, pA_cp2.y, pA_end.x, pA_end.y);
                ctx.stroke();

                const pB_start = { x: canvasElement.width * 0.05, y: canvasElement.height * 0.85 };
                const pB_cp1 = { x: canvasElement.width * 0.35, y: canvasElement.height * 0.5 };
                const pB_cp2 = { x: canvasElement.width * 0.65, y: canvasElement.height * 0.65 };
                const pB_end = { x: canvasElement.width * 0.95, y: canvasElement.height * 0.35 };

                ctx.beginPath();
                ctx.moveTo(pB_start.x, pB_start.y);
                ctx.bezierCurveTo(pB_cp1.x, pB_cp1.y, pB_cp2.x, pB_cp2.y, pB_end.x, pB_end.y);
                ctx.stroke();

                const tA = (timestamp * 0.00015) % 1;
                const posA = getBezierPoint(tA, pA_start, pA_cp1, pA_cp2, pA_end);
                const tangentA = getBezierTangent(tA, pA_start, pA_cp1, pA_cp2, pA_end);
                drawTruckOnRoute(posA.x, posA.y, Math.atan2(tangentA.y, tangentA.x));

                const tB = ((timestamp + 3500) * 0.00012) % 1;
                const posB = getBezierPoint(tB, pB_start, pB_cp1, pB_cp2, pB_end);
                const tangentB = getBezierTangent(tB, pB_start, pB_cp1, pB_cp2, pB_end);
                drawTruckOnRoute(posB.x, posB.y, Math.atan2(tangentB.y, tangentB.x));

                ctx.restore();
            };

            const initParticles = () => {
                particles = [];
                for (let i = 0; i < maxParticles; i++) {
                    particles.push(new Particle());
                }
            };

            const animateParticles = (timestamp) => {
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                drawLogisticHighways(timestamp || 0);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });

                ctx.save();
                ctx.setLineDash([4, 4]);
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const p1 = particles[i];
                        const p2 = particles[j];
                        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        if (dist < 140) {
                            const alpha = (1 - dist / 140) * 0.28;
                            ctx.strokeStyle = `rgba(228, 192, 80, ${alpha})`;
                            ctx.lineWidth = 1.0;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.restore();
                requestAnimationFrame(animateParticles);
            };

            if (runImmediately) {
                initParticles();
                animateParticles();
            } else {
                let videoFaded = false;
                const triggerFade = () => {
                    if (videoFaded) return;
                    videoFaded = true;
                    videoElement.style.opacity = '0';
                    canvasElement.style.opacity = '1';
                    
                    const homeHero = document.getElementById("homeHeroContent");
                    if (homeHero) {
                        homeHero.style.opacity = '1';
                        homeHero.classList.add("start-animations");
                    }
                    
                    initParticles();
                    animateParticles();
                };
                videoElement.addEventListener("ended", triggerFade);
                videoElement.addEventListener("timeupdate", () => {
                    if (videoElement.duration && videoElement.currentTime >= videoElement.duration - 1.5) {
                        triggerFade();
                    }
                });
                window.addEventListener("scroll", () => {
                    if (window.pageYOffset > 15) {
                        triggerFade();
                    }
                });
            }
        };

        if (isHomepage) {
            globalVideo.autoplay = true;
            globalVideo.loop = false;
            globalVideo.muted = true;
            globalVideo.play().catch(() => {
                globalVideo.muted = true;
                globalVideo.play();
            });
            setupParticleSystem(canvas, globalVideo, false);
        } else {
            // Default subpage video looping & parallax scroll
            if (globalVideo) {
                globalVideo.playbackRate = 0.55;
                window.addEventListener("scroll", () => {
                    const scrollPos = window.pageYOffset;
                    globalVideo.style.transform = `translateY(${scrollPos * 0.35}px)`;
                });
            }
            // Subpages run the floating particles immediately on top of the looping video
            setupParticleSystem(canvas, globalVideo, true);
        }
    }

    // 3D Smooth Mouse Tracking Tilt Effect
    const elements3D = document.querySelectorAll(".tracking-3d");

    elements3D.forEach(element => {
        element.addEventListener("mousemove", (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside the element
            const y = e.clientY - rect.top;  // y position inside the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angle (max 10 degrees)
            const tiltX = (centerY - y) / centerY * 8;
            const tiltY = (x - centerX) / centerX * 8;

            element.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
            
            // Highlight glow inside card if it has one
            const glow = element.querySelector(".card-glow");
            if (glow) {
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                glow.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(228, 192, 80, 0.25) 0%, transparent 80%)`;
            }
        });

        element.addEventListener("mouseleave", () => {
            element.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
            const glow = element.querySelector(".card-glow");
            if (glow) {
                glow.style.background = "radial-gradient(circle at 100% 100%, rgba(228, 192, 80, 0.15) 0%, transparent 80%)";
            }
        });
    });

    // Floating Quick Bar Visibility Control
    const floatingBar = document.querySelector(".floating-quick-bar");
    if (floatingBar) {
        window.addEventListener("scroll", () => {
            if (window.pageYOffset > 300) {
                floatingBar.classList.add("visible");
            } else {
                floatingBar.classList.remove("visible");
            }
        });
    }

    // Cotización Form Submission handler
    const cotizacionForm = document.querySelector(".cotizacion-form");
    if (cotizacionForm) {
        cotizacionForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;

            alert(`¡Muchas gracias por tu mensaje, ${name}! Un asesor logístico de Transporte Andina se comunicará contigo al correo ${email} a la brevedad.`);
            cotizacionForm.reset();
        });
    }

    // Leaflet OSM Coverage Map Initialization
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
        // Center view on central Argentina path between San Luis and Buenos Aires
        const map = L.map('map', { attributionControl: false }).setView([-34.2000, -61.5000], 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Coordinates
        const centralSanLuis = [-33.3022, -66.3368];
        const villaMercedes = [-33.6842, -65.4619];
        const buenosAires = [-34.6037, -58.3816];

        // Custom marker styles
        const mainIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#E4C050; width:15px; height:15px; border-radius:50%; border:2px solid #1A2D64;'></div>",
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
        });

        // Markers
        L.marker(centralSanLuis, {icon: mainIcon}).addTo(map).bindPopup("<b>Depósito Central San Luis</b><br>Av. Santos Ortiz y Sto. Cabral 320 Sur");
        L.marker(villaMercedes, {icon: mainIcon}).addTo(map).bindPopup("<b>Depósito Villa Mercedes</b><br>Av. 25 de Mayo 2470");
        L.marker(buenosAires, {icon: mainIcon}).addTo(map).bindPopup("<b>Depósito Buenos Aires</b><br>Ferré 2520, Villa Soldati, CABA");

        // Custom secondary marker icon (Vibrant Green) for optional routing destinations
        const secondaryIcon = L.divIcon({
            className: 'custom-div-icon-secondary',
            html: "<div style='background-color:#22C55E; width:12px; height:12px; border-radius:50%; border:2px solid #1A2D64;'></div>",
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        // Extra loose markers indicating long-distance transport destinations
        const mendoza = [-32.8894, -68.8458];
        const cordoba = [-31.4135, -64.1810];
        const santaFe = [-31.6107, -60.6973];
        const santaRosa = [-36.6167, -64.2833];
        const sanJuan = [-31.5375, -68.5364];
        const sanRafael = [-34.6177, -68.3301];
        const rioCuarto = [-33.1248, -64.3491];
        const junin = [-34.5878, -60.9472];
        const venadoTuerto = [-33.7458, -61.9688];

        L.marker(mendoza, {icon: secondaryIcon}).addTo(map).bindPopup("<b>Mendoza</b><br>Traslados y distribución a demanda");
        L.marker(cordoba, {icon: secondaryIcon}).addTo(map).bindPopup("<b>Córdoba</b><br>Traslados y distribución a demanda");
        L.marker(santaFe, {icon: secondaryIcon}).addTo(map).bindPopup("<b>Rosario / Santa Fe</b><br>Traslados y distribución a demanda");
        L.marker(santaRosa, {icon: secondaryIcon}).addTo(map).bindPopup("<b>La Pampa</b><br>Traslados y distribución a demanda");
        L.marker(sanJuan, {icon: secondaryIcon}).addTo(map).bindPopup("<b>San Juan</b><br>Traslados y distribución a demanda");
        L.marker(sanRafael, {icon: secondaryIcon}).addTo(map).bindPopup("<b>San Rafael (Mendoza)</b><br>Traslados y distribución a demanda");
        L.marker(rioCuarto, {icon: secondaryIcon}).addTo(map).bindPopup("<b>Río Cuarto (Córdoba)</b><br>Traslados y distribución a demanda");
        L.marker(junin, {icon: secondaryIcon}).addTo(map).bindPopup("<b>Junín (Buenos Aires)</b><br>Enlace en ruta");
        L.marker(venadoTuerto, {icon: secondaryIcon}).addTo(map).bindPopup("<b>Venado Tuerto (Santa Fe)</b><br>Traslados y distribución a demanda");

        // Coverage route polygon (the corridor band between CABA and San Luis)
        const polyCoords = [
            [-34.8000, -58.3000], // South-East of BA
            [-34.3000, -58.3000], // North-East of BA
            [-33.0000, -66.2000], // North-East of SL
            [-33.6000, -66.5000], // South-West of SL
        ];

        const coverageZone = L.polygon(polyCoords, {
            color: '#005FCC',
            fillColor: '#FFECB1',
            fillOpacity: 0.45,
            weight: 3,
            dashArray: '5, 8'
        }).addTo(map);

        coverageZone.bindPopup("<b>Zona de Cobertura de Enlaces Diarios</b><br>Logística integral de fletes Buenos Aires ↔ San Luis");
    }

    // Hero Tracking search input submit logic
    const heroTrackingForm = document.getElementById("heroTrackingForm");
    if (heroTrackingForm) {
        heroTrackingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const trackingCode = document.getElementById("heroTrackingInput").value.trim();
            if (trackingCode) {
                // Simulating a real tracking system redirection or mock alert
                alert(`Buscando envío con código: ${trackingCode}\n\nEstado actual: En tránsito hacia la delegación de destino.`);
                heroTrackingForm.reset();
            }
        });
    }

});
