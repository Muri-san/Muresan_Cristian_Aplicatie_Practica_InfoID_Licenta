document.addEventListener('DOMContentLoaded', async () => {
    let loginForm, registerForm, addPlantButton, deletePlantButton, submitAddPlantButton, plantList, gardenList, historyList, addPlantForm, plantForm, calendarElement, calendarToggle, calendarPrev, calendarNext, calendarMonth;
    let manualMode = false;

    const initializeElements = () => {
        loginForm = document.getElementById('login-form');
        registerForm = document.getElementById('register-form');
        addPlantButton = document.getElementById('add-plant');
        deletePlantButton = document.getElementById('delete-plant');
        submitAddPlantButton = document.getElementById('submit-add-plant');
        plantList = document.getElementById('plant-list');
        gardenList = document.getElementById('garden-list');
        historyList = document.getElementById('history-list');
        addPlantForm = document.getElementById('add-plant-form');
        plantForm = document.getElementById('plant-form');
        calendarElement = document.getElementById('calendar');
        calendarToggle = document.getElementById('calendar-toggle');
        calendarPrev = document.getElementById('calendar-prev');
        calendarNext = document.getElementById('calendar-next');
        calendarMonth = document.getElementById('calendar-month');
        console.log('Elements initialized');
    };

    initializeElements();

    const setupPlantButtons = () => {
        if (addPlantButton) {
            addPlantButton.addEventListener('click', () => {
                console.log('Displaying add plant form...');
                addPlantForm.style.display = 'block';
            });
        }

        if (deletePlantButton) {
            deletePlantButton.addEventListener('click', async () => {
                if (deletePlantButton.textContent === 'Șterge Plante') {
                    console.log('Toggling delete checkboxes...');
                    const checkboxes = document.querySelectorAll('.delete-checkbox');
                    checkboxes.forEach(checkbox => {
                        checkbox.style.display = 'inline';
                    });
                    deletePlantButton.textContent = 'Șterge plante selectate';
                } else {
                    const checkboxes = document.querySelectorAll('.delete-checkbox:checked');
                    const idsToDelete = Array.from(checkboxes).map(checkbox => checkbox.getAttribute('data-id'));
    
                    if (idsToDelete.length > 0) {
                        console.log(`Deleting plants with IDs: ${idsToDelete.join(', ')}`);
                        await fetch('/api/plants/delete', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ ids: idsToDelete })
                        });
                        loadPlants();
                    }
    
                    document.querySelectorAll('.delete-checkbox').forEach(checkbox => {
                        checkbox.style.display = 'none';
                    });
                    deletePlantButton.textContent = 'Șterge Plante';
                }
            });
        }

        if (plantForm) {
            plantForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(plantForm);
                const name = formData.get('name');
                const type = formData.get('type');
                const category = formData.get('category');
                const plantPeriod = Array.from(formData.getAll('plant_period')).join(',');
                const prunePeriod = Array.from(formData.getAll('prune_period')).join(',');
                const fertilizePeriod = Array.from(formData.getAll('fertilize_period')).join(',');
                const harvestPeriod = Array.from(formData.getAll('harvest_period')).join(',');

                console.log(`Name: ${name}, Type: ${type}, Category: ${category}, Plant Period: ${plantPeriod}, Prune Period: ${prunePeriod}, Fertilize Period: ${fertilizePeriod}, Harvest Period: ${harvestPeriod}`);

                const response = await fetch('/api/plants/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        type,
                        category,
                        plant_period: plantPeriod,
                        prune_period: prunePeriod,
                        fertilize_period: fertilizePeriod,
                        harvest_period: harvestPeriod
                    })
                });

                const data = await response.text();
                alert(data);
                addPlantForm.style.display = 'none';
                loadPlants();
            });
        }
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Submitting login form...');
            console.log(`Username: ${username}, Password: ${password}`);

            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            console.log('Login response status:', response.status);

            if (response.status === 200) {
                console.log('Login successful, redirecting to home page...');
                window.location.href = 'home.html';
            } else {
                const data = await response.json();
                console.error('Login error:', data.message || 'Eroare la logare');
                alert(data.message || 'Eroare la logare');
            }
        });
    } else {
        console.log('Login form not found');
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            console.log('Submitting register form...');
            console.log(`Username: ${username}, Password: ${password}`);

            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.status === 200) {
                console.log('Registration successful, redirecting to login page...');
                window.location.href = 'login.html';
            } else {
                const data = await response.json();
                console.error('Registration error:', data.message || 'Eroare la inregistrare');
                alert(data.message || 'Eroare la inregistrare');
            }
        });
    } else {
        console.log('Register form not found');
    }

    const fetchSelectedDate = async () => {
        const response = await fetch('/api/getDate');
        const data = await response.json();
        return new Date(data.selectedDate);
    };

    const saveSelectedDate = async (date) => {
        await fetch('/api/setDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedDate: date.toISOString().split('T')[0] })
        });
    };

    let currentDate = await fetchSelectedDate();

    const renderCalendar = (year, month) => {
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    calendarMonth.textContent = `${monthNames[month]} ${year}`;

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let calendarHTML = '';

    daysOfWeek.forEach(day => {
        calendarHTML += `<div class="header">${day}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = (year === today.getFullYear() && month === today.getMonth() && day === today.getDate());
        const isSelected = manualMode && (year === currentDate.getFullYear() && month === currentDate.getMonth() && day === currentDate.getDate());
        calendarHTML += `<div class="day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" data-day="${day}">${day}</div>`;
    }

    calendarElement.innerHTML = calendarHTML;

    const days = document.querySelectorAll('.day');
    days.forEach(day => {
        day.addEventListener('click', async () => {
            if (manualMode && !day.classList.contains('empty')) {
                const selectedDay = day.getAttribute('data-day');
                currentDate = new Date(year, month, selectedDay);
                await saveSelectedDate(currentDate);
                updateAllWithSelectedDate();
                renderCalendar(year, month);
            }
        });
    });
};

const toggleCalendarMode = async () => {
    manualMode = !manualMode;
    calendarToggle.textContent = manualMode ? 'Manual' : 'Auto';
    if (!manualMode) {
        currentDate = new Date();
        await saveSelectedDate(currentDate);
        updateAllWithSelectedDate();
    }
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
};

const updateAllWithSelectedDate = () => {
    console.log('Selected date:', currentDate);
};

const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    currentDate = new Date(newDate);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
};

if (calendarToggle) {
    calendarToggle.addEventListener('click', toggleCalendarMode);
}

if (calendarPrev) {
    calendarPrev.addEventListener('click', () => changeMonth(-1));
}

if (calendarNext) {
    calendarNext.addEventListener('click', () => changeMonth(1));
}

if (calendarElement) {
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

    const loadContent = async (page) => {
        const mainContent = document.getElementById('main-content');
        try {
            const response = await fetch(page);
            const content = await response.text();
            console.log(`Loaded content for ${page}:`, content);
            mainContent.innerHTML = content;
            initializeElements();
            initializePage(page);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    };

    const initializePage = (page) => {
        switch (page) {
            case 'plantoteca.html':
                loadPlants();
                setupPlantButtons();
                break;
            case 'gradina_mea.html':
                loadGarden();
                break;
            case 'istoric.html':
                loadHistory();
                break;
            default:
                break;
        }
    };

    const plantotecaNav = document.getElementById('plantoteca-nav');
    const gradinaNav = document.getElementById('gradina-nav');
    const istoricNav = document.getElementById('istoric-nav');

    if (plantotecaNav) {
        plantotecaNav.addEventListener('click', () => loadContent('plantoteca.html'));
    }

    if (gradinaNav) {
        gradinaNav.addEventListener('click', () => loadContent('gradina_mea.html'));
    }

    if (istoricNav) {
        istoricNav.addEventListener('click', () => loadContent('istoric.html'));
    }

    if (document.getElementById('main-content')) {
        loadContent('plantoteca.html');
    }

    const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

const convertMonths = (months) => {
    if (!months) return '';
    return months.split(',').map(month => monthNames[parseInt(month) - 1]).join(', ');
};

const loadPlants = async () => {
    console.log('Loading plants...');
    try {
        const response = await fetch('/api/plants');
        const plants = await response.json();

        if (plantList) {
            plantList.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Tip</th>
                            <th>Categorie</th>
                            <th>Perioadă Plantare</th>
                            <th>Perioadă Tundere</th>
                            <th>Perioadă Fertilizare</th>
                            <th>Perioada Recoltare</th>
                            <th>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${plants.map(plant => `
                            <tr>
                                <td>${plant.name}</td>
                                <td>${plant.type}</td>
                                <td>${plant.category}</td>
                                <td>${convertMonths(plant.plant_period)}</td>
                                <td>${convertMonths(plant.prune_period)}</td>
                                <td>${convertMonths(plant.fertilize_period)}</td>
                                <td>${convertMonths(plant.harvest_period)}</td>
                                <td>
                                    <button onclick="plant(${plant.id})">Plantează</button>
                                    <input type="checkbox" class="delete-checkbox" data-id="${plant.id}" style="display:none;">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading plants:', error);
    }
};

const loadGarden = async () => {
    console.log('Loading garden...');
    try {
        const response = await fetch('/api/garden');
        console.log('Garden response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Eroare necunoscută');
        }
        const garden = await response.json();
        const plantsResponse = await fetch('/api/plants');
        const plants = await plantsResponse.json();

        if (gardenList) {
            gardenList.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Tip</th>
                            <th>Categorie</th>
                            <th>Perioada Plantare</th>
                            <th>Perioada Tundere</th>
                            <th>Perioada Fertilizare</th>
                            <th>Perioada Recoltare</th>
                            <th>Data Plantare</th>
                            <th>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${garden.map(gardenPlant => {
                            const plant = plants.find(p => p.id === gardenPlant.plant_id);
                            return `
                                <tr>
                                    <td>${plant.name}</td>
                                    <td>${plant.type}</td>
                                    <td>${plant.category}</td>
                                    <td>${convertMonths(plant.plant_period)}</td>
                                    <td>${convertMonths(plant.prune_period)}</td>
                                    <td>${convertMonths(plant.fertilize_period)}</td>
                                    <td>${convertMonths(plant.harvest_period)}</td>
                                    <td>${new Date(gardenPlant.date_planted).toLocaleDateString()}</td>
                                    <td>
                                        <button onclick="harvest(${gardenPlant.id})">Recoltează</button>
                                        <button onclick="evolve(${gardenPlant.id})">Evoluție</button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading garden:', error);
    }
};


    const loadHistory = async () => {
        console.log('Loading history...');
        try {
            const response = await fetch('/api/garden/history');
            console.log('History response status:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Eroare necunoscută');
            }
            const history = await response.json();
            if (historyList) {
                historyList.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Nume</th>
                                <th>Data Plantare</th>
                                <th>Data Recoltare</th>
                                <th>Observatii</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${history.map(plant => `
                                <tr>
                                    <td>${plant.name}</td>
                                    <td>${new Date(plant.date_planted).toLocaleDateString()}</td>
                                    <td>${new Date(plant.date_harvest).toLocaleDateString()}</td>
                                    <td>
                                        <div class="observations">
                                            ${plant.evolutions.map(e => `
                                                <p>${new Date(e.date).toLocaleDateString()}: ${e.observation}</p>
                                            `).join('')}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const loadPlantDetails = async () => {
        const gardenId = new URLSearchParams(window.location.search).get('gardenId');
        if (!gardenId) {
            console.error('gardenId is null');
            return;
        }

        const plantNameElement = document.getElementById('plant-name');
        const evolutionList = document.getElementById('evolution-list');
        const observationInput = document.getElementById('observation');
        const addEvolutionButton = document.getElementById('add-evolution');

        try {
            const response = await fetch(`/api/garden/${gardenId}`);
            if (response.ok) {
                const plant = await response.json();
                plantNameElement.textContent = `${plant.name} - ${plant.type}`;
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error('Error loading plant details:', error);
        }

        const loadEvolution = async () => {
            try {
                const response = await fetch(`/api/evolution/${gardenId}`);
                if (response.ok) {
                    const evolution = await response.json();
                    evolutionList.innerHTML = evolution.map(e => `
                        <div class="evolution-entry">
                            <p>${new Date(e.date).toLocaleDateString()}: ${e.observation}</p>
                        </div>
                    `).join('');
                } else {
                    const errorData = await response.json();
                    console.error(errorData.error);
                }
            } catch (error) {
                console.error('Error loading evolution:', error);
            }
        };

        if (addEvolutionButton) {
            addEvolutionButton.addEventListener('click', async () => {
                const observation = observationInput.value;
                const date = new Date().toISOString().split('T')[0];
                try {
                    const response = await fetch('/api/evolution/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            gardenId,
                            date,
                            observation
                        })
                    });

                    if (response.ok) {
                        observationInput.value = '';
                        loadEvolution();
                    } else {
                        const errorData = await response.json();
                        console.error(errorData.error);
                    }
                } catch (error) {
                    console.error('Error adding evolution:', error);
                }
            });
        }

        loadEvolution();
    };

    const notificationIcon = document.getElementById('notification-icon');
    const notificationContainer = document.getElementById('notification-container');
    const notificationList = document.getElementById('notification-list');
    const updateNotificationsButton = document.getElementById('update-notifications');

    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            notificationContainer.style.display = notificationContainer.style.display === 'none' ? 'block' : 'none';
        });
    }

    if (updateNotificationsButton) {
        updateNotificationsButton.addEventListener('click', async () => {
            try {
                // Apelăm ruta pentru a crea notificările înainte de a le obține
                console.log('Creating notifications...');
                const createResponse = await fetch('/api/createNotifications');
                if (!createResponse.ok) {
                    console.error('Failed to create notifications');
                    throw new Error('Failed to create notifications');
                }

                console.log('Fetching notifications...');
                const response = await fetch('/api/notifications');
                if (!response.ok) {
                    console.error('Failed to fetch notifications');
                    throw new Error('Failed to fetch notifications');
                }
                const notifications = await response.json();
                let notificationHTML = '<ul>';
                notifications.reverse().forEach(notification => {
                    notificationHTML += `<li>${notification.message} - ${new Date(notification.date_sent).toLocaleDateString()}</li>`;
                });
                notificationHTML += '</ul>';
                notificationList.innerHTML = notificationHTML;
            } catch (error) {
                console.error('Error loading notifications:', error);
            }
        });
    }
        
    window.plant = async (id) => {
        console.log(`Plantează plantă cu ID: ${id}`);
        try {
            const datePlanted = currentDate.toISOString().split('T')[0];
            const response = await fetch('/api/garden/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantId: id,
                    datePlanted: datePlanted
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                loadGarden();
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error('Error planting the plant:', error);
        }
    };

    window.harvest = async (id) => {
        console.log(`Recoltează plantă cu ID: ${id}`);
        try {
            const dateHarvest = currentDate.toISOString().split('T')[0];
            const response = await fetch('/api/garden/harvest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                loadGarden();
                loadHistory();
            } else {
                const errorData = await response.json();
                console.error(errorData.error);
            }
        } catch (error) {
            console.error('Error harvesting the plant:', error);
        }
    };

    window.evolve = (id) => {
        window.location.href = `evolution.html?gardenId=${id}`;
    };

    initializeElements();
    setupPlantButtons();

    if (plantList) loadPlants();
    if (gardenList) loadGarden();
    if (historyList) loadHistory();
    if (document.getElementById('plant-name')) loadPlantDetails();
});
