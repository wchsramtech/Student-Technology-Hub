/* script.js - interactive behavior for Student Hub
   Notes & open-source references:
   - Calendar patterns inspired by many JS calendar examples (W3Schools, MDN examples)
   - W3Schools HTML & CSS tutorials: https://www.w3schools.com/html/ and https://www.w3schools.com/css/
*/

/* Utility: format date keys */
function ymd(date){
    return date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
}

/* Recurring tutoring events configuration */
const tutoringConfig = {
    live: {
        weekdays: [1,3,4], // Mon, Wed, Thu
        start: "15:30",
        end: "17:00",
        title: "Live Tutoring"
    },
    group: {
        weekdays: [2,4], // Tue, Thu
        start: "15:00",
        end: "18:00",
        title: "Group Tutoring"
    }
};

/* Calendar renderer */
function renderCalendar(containerId, year, month, eventType){
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const monthNames = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];

    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <div class="month">${monthNames[month]} ${year}</div>
        <div>
            <button data-action="prev">◀</button>
            <button data-action="next">▶</button>
        </div>
    `;
    container.appendChild(header);

    // Weekday labels
    const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const labels = document.createElement('div');
    labels.className = 'grid';

    weekdays.forEach(d=>{
        const el = document.createElement('div');
        el.className = 'day';
        el.style.minHeight = '30px';
        el.innerHTML = `<strong style="font-size:12px;color:var(--muted)">${d}</strong>`;
        labels.appendChild(el);
    });

    container.appendChild(labels);

    // Days grid
    const grid = document.createElement('div');
    grid.className = 'grid';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // Leading blanks
    for(let i=0;i<firstDay;i++){
        const blank = document.createElement('div');
        blank.className = 'day';
        grid.appendChild(blank);
    }

    // Actual days
    for(let d=1; d<=daysInMonth; d++){
        const date = new Date(year, month, d);
        const jsDay = date.getDay();

        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.innerHTML = `<div class="date-num">${d}</div>`;

        const cfg = (eventType === 'live') ? tutoringConfig.live : tutoringConfig.group;

        if (cfg.weekdays.includes(jsDay)){
            const ev = document.createElement('div');
            ev.className = 'event';
            ev.textContent = `${cfg.title} (${cfg.start} - ${cfg.end})`;
            dayEl.appendChild(ev);
        }

        grid.appendChild(dayEl);
    }

    container.appendChild(grid);

    // Navigation
    header.querySelectorAll('button').forEach(btn=>{
        btn.addEventListener('click', function(){
            const action = this.getAttribute('data-action');
            let newMonth = month;
            let newYear = year;

            if(action === 'prev'){
                newMonth--;
                if(newMonth < 0){
                    newMonth = 11;
                    newYear--;
                }
            } else {
                newMonth++;
                if(newMonth > 11){
                    newMonth = 0;
                    newYear++;
                }
            }
            renderCalendar(containerId, newYear, newMonth, eventType);
        });
    });
}

/* Init calendars */
function initCalendars(){
    const now = new Date();
    renderCalendar('calendar-live', now.getFullYear(), now.getMonth(), 'live');
    renderCalendar('calendar-group', now.getFullYear(), now.getMonth(), 'group');
}

/* Expandable tutorial cards */
function initTutorialExpanders(){
    document.querySelectorAll('.tutorial-card button').forEach(btn=>{
        btn.addEventListener('click', function(){
            const body = this.closest('.tutorial-card').querySelector('.tutorial-body');
            if(body.style.display === 'block'){
                body.style.display = 'none';
                this.textContent = 'Show';
            } else {
                body.style.display = 'block';
                this.textContent = 'Hide';
            }
        });
    });
}

/* Dark theme toggle */
function initThemeToggle(){
    const tbtn = document.getElementById('theme-toggle');
    if(!tbtn) return;

    tbtn.addEventListener('click', ()=>{
        document.body.classList.toggle('dark');
        if(document.body.classList.contains('dark')){
            localStorage.setItem('theme','dark');
        } else {
            localStorage.removeItem('theme');
        }
    });

    if(localStorage.getItem('theme') === 'dark'){
        document.body.classList.add('dark');
    }
}

/* === PROGRESS TRACKING SYSTEM (Option B) — FIXED === */
function initProgressTracking() {
    const links = document.querySelectorAll(".track-progress");
    const progressBar = document.getElementById("progressBar");

    if (!progressBar) return; // only on dashboard

    const totalItems = links.length;
    let clickedItems = JSON.parse(localStorage.getItem("progressClicks")) || [];

    function updateProgress() {
        const percent = Math.min((clickedItems.length / totalItems) * 100, 100);
        progressBar.style.width = percent + "%";
    }

    // Update when dashboard loads
    updateProgress();

    links.forEach(link => {
        const href = link.getAttribute("href");

        link.addEventListener("click", function (e) {

            // Stop the navigation briefly so progress can save
            e.preventDefault();

            // Save progress if first time clicked
            if (!clickedItems.includes(href)) {
                clickedItems.push(href);
                localStorage.setItem("progressClicks", JSON.stringify(clickedItems));
            }

            // Update progress bar visually
            updateProgress();

            // Navigate AFTER updating (100ms delay)
            setTimeout(() => {
                window.location.href = href;
            }, 100);
        });
    });
}


/* On page load */
document.addEventListener('DOMContentLoaded', ()=>{
    initCalendars();
    initTutorialExpanders();
    initThemeToggle();
    initProgressTracking();   // <-- NEW
});

