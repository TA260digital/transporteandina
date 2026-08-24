/* ==========================================================================
   TRANSPORTE ANDINA - PORTAL ADMIN LOGIC
   Tab navigation, simulated login, and modal registrations
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Tab Navigation
    const menuItems = document.querySelectorAll(".menu-item");
    const tabContents = document.querySelectorAll(".tab-content");
    const activeTabTitle = document.getElementById("activeTabTitle");
    const activeTabDesc = document.getElementById("activeTabDesc");

    const tabMeta = {
        viajes: {
            title: "Monitoreo y Ruteo de Viajes",
            desc: "Gestión y despacho de flota activa en tiempo real."
        },
        hojas: {
            title: "Hojas de Ruta",
            desc: "Documentos legales del conductor y carga asignada."
        },
        seguimiento: {
            title: "Control de Entregas",
            desc: "Historial de remitos, descargas y conformados de clientes."
        },
        unidades: {
            title: "Control Documental de Flota",
            desc: "Monitoreo de habilitaciones, seguros, Moyano y VTV vencidas."
        },
        tarifario: {
            title: "Tarifario de Rutas y Enlaces",
            desc: "Costos de fletes por kilómetro para clientes corporativos."
        }
    };

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");

            // Update active sidebar item
            menuItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // Update visible content tab
            tabContents.forEach(content => content.classList.remove("active"));
            const targetContent = document.getElementById(`tab-${tabId}`);
            if (targetContent) {
                targetContent.classList.add("active");
            }

            // Update header title and desc
            if (tabMeta[tabId]) {
                activeTabTitle.textContent = tabMeta[tabId].title;
                activeTabDesc.textContent = tabMeta[tabId].desc;
            }
        });
    });

    // Simulated Access Login Form handler
    const loginForm = document.getElementById("loginForm");
    const loginOverlay = document.getElementById("loginOverlay");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Smoothly fade out login page to reveal admin workspace
            loginOverlay.style.opacity = "0";
            setTimeout(() => {
                loginOverlay.style.display = "none";
            }, 500);
        });
    }

    // Logout action to reveal login page again
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            loginOverlay.style.display = "flex";
            setTimeout(() => {
                loginOverlay.style.opacity = "1";
            }, 50);
            if (loginForm) loginForm.reset();
        });
    }

    // Modal Control for Dispatching/Adding New Trips
    const btnAddNew = document.getElementById("btnAddNew");
    const adminModal = document.getElementById("adminModal");
    const closeModal = document.querySelector(".close-modal");
    const newTripForm = document.getElementById("newTripForm");
    const tripsTableBody = document.querySelector("#tab-viajes tbody");

    if (btnAddNew && adminModal && closeModal) {
        btnAddNew.addEventListener("click", () => {
            adminModal.style.display = "flex";
        });

        closeModal.addEventListener("click", () => {
            adminModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === adminModal) {
                adminModal.style.display = "none";
            }
        });
    }

    // Add New Trip flow (simulated local append)
    if (newTripForm) {
        newTripForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const unit = document.getElementById("tripUnit").value;
            const driver = document.getElementById("tripDriver").value;
            const origin = document.getElementById("tripOrigin").value;
            const dest = document.getElementById("tripDest").value;
            const load = document.getElementById("tripLoad").value;
            
            const newId = `#VJ-${Math.floor(1000 + Math.random() * 9000)}`;

            // Create new row
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${newId}</td>
                <td>${unit}</td>
                <td>${driver}</td>
                <td>${origin}</td>
                <td>${dest}</td>
                <td>${load}</td>
                <td><span class="status-pill status-moving">En viaje</span></td>
                <td>
                    <button class="btn-tbl btn-tbl-view"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-tbl btn-tbl-edit"><i class="fa-solid fa-pen-to-square"></i></button>
                </td>
            `;

            // Append to table
            if (tripsTableBody) {
                tripsTableBody.insertBefore(newRow, tripsTableBody.firstChild);
            }

            // Reset and close
            newTripForm.reset();
            adminModal.style.display = "none";
            
            alert(`¡Exitoso! Unidad ${unit} despachada hacia ${dest} bajo control de ${driver}.`);
        });
    }

    // Admin clock update
    const clockSpan = document.getElementById("clock");
    if (clockSpan) {
        setInterval(() => {
            const now = new Date();
            const timeString = now.toTimeString().split(' ')[0];
            clockSpan.textContent = timeString;
        }, 1000);
    }

    // 3D Smooth Mouse Tracking Tilt for Login Card
    const loginCard = document.querySelector(".login-card");
    if (loginCard) {
        loginCard.addEventListener("mousemove", (e) => {
            const rect = loginCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (centerY - y) / centerY * 8;
            const tiltY = (x - centerX) / centerX * 8;

            loginCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        loginCard.addEventListener("mouseleave", () => {
            loginCard.style.transform = "rotateX(0deg) rotateY(0deg)";
        });
    }

    // Modal Control for Rates update
    const btnUpdateRates = document.getElementById("btnUpdateRates");
    const ratesModal = document.getElementById("ratesModal");
    const closeModalRates = document.querySelector(".close-modal-rates");
    const ratesForm = document.getElementById("ratesForm");
    const rateRouteSelect = document.getElementById("rateRouteSelect");

    // Dynamic Route Select populating
    const populateRoutesDropdown = () => {
        if (!rateRouteSelect) return;
        // Keep "Todas las rutas" option
        rateRouteSelect.innerHTML = '<option value="all">Todas las rutas</option>';
        // Grab current routes from the table
        const rows = document.querySelectorAll('#tab-tarifario tbody tr');
        rows.forEach(row => {
            if (row.cells.length > 0) {
                const routeName = row.cells[0].textContent.trim();
                const opt = document.createElement("option");
                opt.value = routeName;
                opt.textContent = routeName;
                rateRouteSelect.appendChild(opt);
            }
        });
    };

    if (btnUpdateRates && ratesModal && closeModalRates) {
        btnUpdateRates.addEventListener("click", () => {
            populateRoutesDropdown();
            ratesModal.style.display = "flex";
        });

        closeModalRates.addEventListener("click", () => {
            ratesModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === ratesModal) {
                ratesModal.style.display = "none";
            }
        });
    }

    // Modal Control for Creating New Rates
    const btnCreateRate = document.getElementById("btnCreateRate");
    const createRateModal = document.getElementById("createRateModal");
    const closeModalCreateRate = document.querySelector(".close-modal-create-rate");
    const createRateForm = document.getElementById("createRateForm");
    const tarifarioTableBody = document.querySelector("#tab-tarifario tbody");

    if (btnCreateRate && createRateModal && closeModalCreateRate) {
        btnCreateRate.addEventListener("click", () => {
            createRateModal.style.display = "flex";
        });

        closeModalCreateRate.addEventListener("click", () => {
            createRateModal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === createRateModal) {
                createRateModal.style.display = "none";
            }
        });
    }

    // Helper functions for parsing and formatting currencies
    const parseValue = (str) => {
        const clean = str.replace(/[$\+ARS\s\.]/g, '');
        return parseFloat(clean) || 0;
    };
    
    const formatValue = (num, hasPlus = false) => {
        const formatted = Math.round(num).toLocaleString('es-AR');
        return `${hasPlus ? '+' : ''}$${formatted} ARS`;
    };

    // Calculate new value based on method
    const calculateNewValue = (currentVal, adjustVal, method) => {
        if (method === 'percent') {
            return currentVal * (1 + (adjustVal / 100));
        } else {
            return Math.max(0, currentVal + adjustVal); // Flat amount adjustment, preventing negative rates
        }
    };

    // Submit handler for Rates Form (Updates existing rows)
    if (ratesForm) {
        ratesForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const selectedRoute = document.getElementById("rateRouteSelect").value;
            const selectedField = document.getElementById("rateFieldSelect").value;
            const selectedMethod = document.getElementById("rateMethodSelect").value;
            const adjustmentVal = parseFloat(document.getElementById("rateAdjustmentValue").value) || 0;

            const rows = document.querySelectorAll('#tab-tarifario tbody tr');
            
            // Format today's date
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const todayStr = `${dd}/${mm}/${yyyy}`;

            let updatedCount = 0;

            rows.forEach(row => {
                if (row.cells.length >= 6) {
                    const routeName = row.cells[0].textContent.trim();
                    
                    // Match route filter
                    if (selectedRoute === 'all' || selectedRoute === routeName) {
                        updatedCount++;

                        // Modify FTL (Carga Completa)
                        if (selectedField === 'all' || selectedField === 'ftl') {
                            const val = parseValue(row.cells[1].textContent);
                            row.cells[1].textContent = formatValue(calculateNewValue(val, adjustmentVal, selectedMethod));
                        }

                        // Modify LTL (Medio Flete)
                        if (selectedField === 'all' || selectedField === 'ltl') {
                            const val = parseValue(row.cells[2].textContent);
                            row.cells[2].textContent = formatValue(calculateNewValue(val, adjustmentVal, selectedMethod));
                        }

                        // Modify Refrigerado
                        if (selectedField === 'all' || selectedField === 'refrig') {
                            const val = parseValue(row.cells[3].textContent);
                            row.cells[3].textContent = formatValue(calculateNewValue(val, adjustmentVal, selectedMethod), true);
                        }

                        // Modify Peajes
                        if (selectedField === 'all' || selectedField === 'peaje') {
                            const val = parseValue(row.cells[4].textContent);
                            row.cells[4].textContent = formatValue(calculateNewValue(val, adjustmentVal, selectedMethod));
                        }

                        // Update date cell
                        row.cells[5].textContent = todayStr;
                    }
                }
            });

            // Reset and close
            ratesForm.reset();
            ratesModal.style.display = "none";

            alert(`¡Tarifas actualizadas! Se aplicó el ajuste a ${updatedCount} ruta(s) con éxito.`);
        });
    }

    // Submit handler for Create Rate Form (Appends new route)
    if (createRateForm) {
        createRateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const route = document.getElementById("newRateRoute").value;
            const ftl = parseFloat(document.getElementById("newRateFtl").value) || 0;
            const ltl = parseFloat(document.getElementById("newRateLtl").value) || 0;
            const refrig = parseFloat(document.getElementById("newRateRefrig").value) || 0;
            const peaje = parseFloat(document.getElementById("newRatePeaje").value) || 0;

            // Date format
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const todayStr = `${dd}/${mm}/${yyyy}`;

            // Create new row
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${route}</td>
                <td>${formatValue(ftl)}</td>
                <td>${formatValue(ltl)}</td>
                <td>${formatValue(refrig, true)}</td>
                <td>${formatValue(peaje)}</td>
                <td>${todayStr}</td>
            `;

            // Append
            if (tarifarioTableBody) {
                tarifarioTableBody.appendChild(newRow);
            }

            // Reset and close
            createRateForm.reset();
            createRateModal.style.display = "none";

            alert(`¡Exitoso! Se ha incorporado la ruta "${route}" al tarifario general.`);
        });
    }

});
