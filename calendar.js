// ============ Constants ============
const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
];

let CURRENT_YEAR = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Event type configuration with OKLCH colors
const EVENT_TYPES = {
    holiday:  { label: 'Holiday', color: 'var(--event-holiday)' },
    personal: { label: 'Personal', color: 'var(--event-personal)' },
    work:     { label: 'Work', color: 'var(--event-work)' },
    special:  { label: 'Special', color: 'var(--event-special)' },
    fun:      { label: 'Fun', color: 'var(--event-fun)' }
};

// ============ State ============
let userEvents = {};
let maxEventsPerDay = 2;
let selectedDay = null;
let currentTheme = 'light';

// ============ Error Handling ============
function logError(error, context = '') {
    console.error(`[Calendar] ${context || ''}`, error);
}

// ============ localStorage Persistence ============
function saveEvents() {
    try {
        localStorage.setItem(`calendar_events_${CURRENT_YEAR}`, JSON.stringify(userEvents));
        localStorage.setItem(`calendar_settings_${CURRENT_YEAR}`, JSON.stringify({ maxEventsPerDay }));
        localStorage.setItem('calendar_theme', currentTheme);
    } catch (error) {
        logError(error, 'saveEvents');
    }
}

function loadEvents() {
    try {
        const events = localStorage.getItem(`calendar_events_${CURRENT_YEAR}`);
        const settings = localStorage.getItem(`calendar_settings_${CURRENT_YEAR}`);
        const theme = localStorage.getItem('calendar_theme');
        
        if (events) userEvents = JSON.parse(events);
        if (settings) {
            const parsed = JSON.parse(settings);
            if (parsed.maxEventsPerDay) maxEventsPerDay = parsed.maxEventsPerDay;
        }
        if (theme) {
            currentTheme = theme;
            applyTheme(theme);
        }
    } catch (error) {
        logError(error, 'loadEvents');
    }
}

// ============ Theme Management ============
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    saveEvents();
}

// ============ Utilities ============
function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function truncate(text, maxLen) {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen - 3) + '...';
}

// ============ Render ============
function renderCalendar() {
    try {
        // Update navigation displays
        const periodDisplay = document.querySelector('.current-period');
        if (periodDisplay) {
            periodDisplay.textContent = `${MONTHS[currentMonth]} ${CURRENT_YEAR}`;
        }

        const yearBadge = document.querySelector('.year-badge');
        if (yearBadge) {
            yearBadge.textContent = CURRENT_YEAR.toString();
        }

        // Get day grid
        const dayGrid = document.getElementById('day-grid');
        if (!dayGrid) return;

        // Clear and rebuild grid
        dayGrid.innerHTML = '';

        const firstDayOfWeek = new Date(CURRENT_YEAR, currentMonth, 1).getDay();
        const daysInMonth = new Date(CURRENT_YEAR, currentMonth + 1, 0).getDate();
        const today = new Date();

        // Empty cells before month starts
        for (let i = 0; i < firstDayOfWeek; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            dayGrid.appendChild(empty);
        }

        // Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = today.getFullYear() === CURRENT_YEAR &&
                           today.getMonth() === currentMonth &&
                           today.getDate() === day;
            
            const dayOfWeek = new Date(CURRENT_YEAR, currentMonth, day).getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            const cell = document.createElement('div');
            cell.className = `calendar-day${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}`;
            cell.dataset.day = day;

            // Date number
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date';
            dateEl.textContent = day;
            cell.appendChild(dateEl);

            // Today indicator
            if (isToday) {
                const indicator = document.createElement('div');
                indicator.className = 'today-indicator';
                cell.appendChild(indicator);
            }

            // Events container
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-container';
            
            const key = formatDateKey(CURRENT_YEAR, currentMonth, day);
            const events = userEvents[key] || [];

            // Render visible events
            events.slice(0, maxEventsPerDay).forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = `calendar-event type-${event.type}`;
                eventEl.textContent = truncate(event.title, 20);
                eventEl.title = event.title;
                eventsContainer.appendChild(eventEl);
            });

            // Overflow indicator
            if (events.length > maxEventsPerDay) {
                const overflowBadge = document.createElement('div');
                overflowBadge.className = 'event-count-badge';
                overflowBadge.textContent = `+${events.length - maxEventsPerDay}`;
                cell.appendChild(overflowBadge);
            }

            if (eventsContainer.children.length > 0 || events.length > maxEventsPerDay) {
                cell.appendChild(eventsContainer);
            }

            // Click handler
            cell.addEventListener('click', () => openModal(day));

            dayGrid.appendChild(cell);
        }

        // Empty cells after month ends
        const totalCells = firstDayOfWeek + daysInMonth;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let i = 0; i < remaining; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            dayGrid.appendChild(empty);
        }

        // Staggered animation
        requestAnimationFrame(() => {
            document.querySelectorAll('.calendar-day:not(.empty)').forEach((cell, i) => {
                cell.style.animationDelay = `${i * 0.02}s`;
            });
        });
    } catch (error) {
        logError(error, 'renderCalendar');
    }
}

// ============ Modal ============
function openModal(day) {
    selectedDay = day;
    
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    // Set modal title
    document.getElementById('modal-date-title').textContent = 
        `${MONTHS[currentMonth]} ${day}, ${CURRENT_YEAR}`;

    // Reset form
    document.getElementById('event-title-input').value = '';
    document.getElementById('event-type-select').value = 'personal';
    document.getElementById('events-per-day').value = maxEventsPerDay;

    // Render existing events
    renderExistingEvents();

    // Show modal
    overlay.classList.add('open');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        selectedDay = null;
    }
}

function saveEvent() {
    const input = document.getElementById('event-title-input');
    const title = input.value.trim();
    
    if (!title) {
        input.focus();
        return;
    }

    const type = document.getElementById('event-type-select').value;
    const key = formatDateKey(CURRENT_YEAR, currentMonth, selectedDay);

    if (!userEvents[key]) userEvents[key] = [];
    userEvents[key].push({ title: truncate(title, 50), type });

    saveEvents();
    renderExistingEvents();
    renderCalendar();
    
    input.value = '';
    input.focus();
}

function deleteEvent(index) {
    const key = formatDateKey(CURRENT_YEAR, currentMonth, selectedDay);
    
    if (userEvents[key]) {
        userEvents[key].splice(index, 1);
        if (userEvents[key].length === 0) {
            delete userEvents[key];
        }
    }

    saveEvents();
    renderExistingEvents();
    renderCalendar();
}

function renderExistingEvents() {
    const container = document.getElementById('existing-events-container');
    if (!container) return;

    const key = formatDateKey(CURRENT_YEAR, currentMonth, selectedDay);
    const events = userEvents[key] || [];

    if (events.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="existing-events">
            <h4>Existing Events</h4>
            ${events.map((event, i) => `
                <div class="event-item">
                    <div class="event-item-info">
                        <span class="event-type-badge type-${event.type}">${EVENT_TYPES[event.type].label}</span>
                        <span>${truncate(event.title, 35)}</span>
                    </div>
                    <button class="btn-delete" aria-label="Delete event">&times;</button>
                </div>
            `).join('')}
        </div>
    `;

    // Attach delete handlers
    container.querySelectorAll('.btn-delete').forEach((btn, i) => {
        btn.addEventListener('click', () => deleteEvent(i));
    });
}

function updateEventsPerDay(value) {
    maxEventsPerDay = parseInt(value);
    saveEvents();
    
    if (selectedDay) {
        renderExistingEvents();
    }
    renderCalendar();
}

// ============ Event Listeners ============
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    loadEvents();

    // Theme toggle
    const themeCheckbox = document.getElementById('theme-checkbox');
    if (themeCheckbox) {
        themeCheckbox.checked = currentTheme === 'dark';
        themeCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
            saveEvents();
        });
    }

    // Navigation buttons
   const prevMonthBtn = document.getElementById('btn-prev-month');
    const nextMonthBtn = document.getElementById('btn-next-month');

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            if (currentMonth === 0) {
                currentMonth = 11;
                CURRENT_YEAR--;
            } else {
                currentMonth--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            if (currentMonth === 11) {
                currentMonth = 0;
                CURRENT_YEAR++;
            } else {
                currentMonth++;
            }
            renderCalendar();
        });
    }

    // Year select
    const yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        const startYear = CURRENT_YEAR - 10;
        for (let y = startYear; y <= CURRENT_YEAR + 10; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            if (y === CURRENT_YEAR) option.selected = true;
            yearSelect.appendChild(option);
        }
        yearSelect.addEventListener('change', (e) => {
            CURRENT_YEAR = parseInt(e.target.value);
            loadEvents();
            renderCalendar();
        });
    }

    // Modal controls
    const modalClose = document.getElementById('modal-close');
    const btnCancel = document.getElementById('btn-cancel-modal');
    const btnSave = document.getElementById('btn-save-event');
    const modalOverlay = document.getElementById('modal-overlay');
    const eventInput = document.getElementById('event-title-input');

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    if (btnSave) btnSave.addEventListener('click', saveEvent);
    if (eventInput) {
        eventInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveEvent();
            if (e.key === 'Escape') closeModal();
        });
    }

    // Events per day setting
    const eventsPerDaySelect = document.getElementById('events-per-day');
    if (eventsPerDaySelect) {
        eventsPerDaySelect.addEventListener('change', (e) => {
            updateEventsPerDay(e.target.value);
        });
    }

    // Onboarding modal
    const onboardingModal = document.getElementById('onboarding-modal-overlay');
    const onboardingDismiss = document.getElementById('onboarding-dismiss');
    const onboardingGotIt = document.getElementById('onboarding-got-it');

    const hasSeenOnboarding = localStorage.getItem('calendar_onboarding');
    
    if (onboardingModal && !hasSeenOnboarding) {
        onboardingModal.style.display = 'flex';
        requestAnimationFrame(() => {
            onboardingModal.classList.add('open');
        });
    }

    const hideOnboarding = () => {
        if (onboardingModal) {
            onboardingModal.classList.remove('open');
            setTimeout(() => {
                onboardingModal.style.display = 'none';
            }, 250);
            localStorage.setItem('calendar_onboarding', 'true');
        }
    };

    if (onboardingDismiss) onboardingDismiss.addEventListener('click', hideOnboarding);
    if (onboardingGotIt) onboardingGotIt.addEventListener('click', hideOnboarding);

    // Initial render
    renderCalendar();
});
