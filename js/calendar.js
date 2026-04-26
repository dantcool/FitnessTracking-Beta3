let currentDate = new Date();

function renderCalendar() {
    const monthYearElement = document.getElementById('monthYear');
    const calendarDaysElement = document.getElementById('calendarDays');
    
    // Clear previous days
    calendarDaysElement.innerHTML = '';
    
    // Get the current month and year
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month/year display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;
    
    // Get the first day of the month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    let dayCount = 1;
    
    // Add previous month's days (grayed out)
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day other-month';
        dayDiv.textContent = daysInPrevMonth - i;
        calendarDaysElement.appendChild(dayDiv);
    }
    
    // Add current month's days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = i;
        
        // Highlight today
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.addEventListener('click', () => {
            console.log(`Selected: ${monthNames[month]} ${i}, ${year}`);
        });
        
        calendarDaysElement.appendChild(dayDiv);
    }
    
    // Add next month's days (grayed out)
    const totalCells = calendarDaysElement.children.length;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day other-month';
        dayDiv.textContent = i;
        calendarDaysElement.appendChild(dayDiv);
    }
}

// Navigation buttons
document.querySelector('.prev-btn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next-btn').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Action buttons
const actionBtns = document.querySelectorAll('.action-btn');
actionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log(`Clicked: ${btn.textContent}`);
    });
});

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Initial render
renderCalendar();
