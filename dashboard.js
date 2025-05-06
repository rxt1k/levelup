document.addEventListener('DOMContentLoaded', () => {
    // Player Data
    let playerData = JSON.parse(localStorage.getItem('playerData')) || {
        level: 1,
        exp: 0,
        stats: {
            str: 5,
            agi: 5,
            int: 5,
            cha: 5,
            end: 5
        },
        lastQuestDate: null
    };
    
    // DOM Elements
    const greetingElement = document.getElementById('greeting');
    const levelElement = document.getElementById('level');
    const expElement = document.getElementById('exp');
    const completeQuestBtn = document.getElementById('completeQuestBtn');
    const ageElement = document.getElementById('age');
    const birthdayCountdownElement = document.getElementById('birthdayCountdown');
    
    // Initialize
    updateGreeting();
    updateStats();
    renderRadarChart();
    
    // Quest Completion
    completeQuestBtn.addEventListener('click', completeQuest);
    
    // Functions
    function updateGreeting() {
        const playerName = localStorage.getItem('playerName') || 'Grinder';
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) greeting = `GOOD MORNING, ${playerName.toUpperCase()}.`;
        else if (hour < 18) greeting = `GOOD AFTERNOON, ${playerName.toUpperCase()}.`;
        else greeting = `GOOD EVENING, ${playerName.toUpperCase()}.`;
        
        greetingElement.textContent = `${greeting} READY TO LEVEL UP?`;
    }
    
    function updateStats() {
        levelElement.textContent = playerData.level;
        expElement.textContent = `${playerData.exp}/${playerData.level * 100}`;
    }
    
    function renderRadarChart() {
        const ctx = document.getElementById('statsChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['STR', 'AGI', 'INT', 'CHA', 'END'],
                datasets: [{
                    label: 'STATS',
                    data: [
                        playerData.stats.str,
                        playerData.stats.agi,
                        playerData.stats.int,
                        playerData.stats.cha,
                        playerData.stats.end
                    ],
                    backgroundColor: 'rgba(0, 200, 255, 0.2)',
                    borderColor: '#00c8ff',
                    borderWidth: 1.5,
                    pointBackgroundColor: '#8e44ec',
                    pointBorderColor: '#fff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: '#5d3fd3' },
                        grid: { color: '#5d3fd3' },
                        suggestedMin: 0,
                        suggestedMax: 10,
                        ticks: {
                            stepSize: 2,
                            backdropColor: 'rgba(0,0,0,0)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#00ffe7',
                            font: {
                                family: 'JetBrains Mono',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
    
    function completeQuest() {
        const today = new Date().toDateString();
        
        // Check if already completed today
        if (playerData.lastQuestDate === today) {
            alert('SYSTEM: Quest already completed today!');
            return;
        }
        
        // Update player data
        playerData.exp += 50;
        playerData.stats.str += 1;
        playerData.stats.end += 1;
        playerData.lastQuestDate = today;
        
        // Check for level up
        const expNeeded = playerData.level * 100;
        if (playerData.exp >= expNeeded) {
            playerData.level += 1;
            playerData.exp = 0;
            alert(`SYSTEM: LEVEL UP! You are now Level ${playerData.level}!`);
        }
        
        // Save and update UI
        localStorage.setItem('playerData', JSON.stringify(playerData));
        updateStats();
        renderRadarChart();
        updateTrackerAndCalendar();
        
        alert('SYSTEM: Quest Complete!\n+1 STR\n+1 END\n+50 EXP');
    }
    
    updateAgeAndCountdown();
    setInterval(updateAgeAndCountdown, 1000);

    function updateAgeAndCountdown() {
        const dob = playerData.dob;
        if (!dob) {
            ageElement.textContent = '-';
            birthdayCountdownElement.textContent = '-';
            return;
        }
        const dobDate = new Date(dob);
        const now = new Date();
        // Calculate age
        let age = now.getFullYear() - dobDate.getFullYear();
        const hasHadBirthday = (now.getMonth() > dobDate.getMonth()) || (now.getMonth() === dobDate.getMonth() && now.getDate() >= dobDate.getDate());
        if (!hasHadBirthday) age--;
        ageElement.textContent = age;
        // Next birthday
        let nextBirthday = new Date(now.getFullYear(), dobDate.getMonth(), dobDate.getDate());
        if (now >= nextBirthday) {
            nextBirthday.setFullYear(now.getFullYear() + 1);
        }
        const diffMs = nextBirthday - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        birthdayCountdownElement.textContent = `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
});
    // Add to playerData if missing
    if (!playerData.questHistory) playerData.questHistory = [];

    // Tracker data for each day
    const weekPlan = [
        {day: 'Sunday', plan: 'Rest Day'},
        {day: 'Monday', plan: 'Pushups: 20 | Squats: 15 | Plank: 30s'},
        {day: 'Tuesday', plan: 'Pushups: 25 | Squats: 20 | Plank: 35s'},
        {day: 'Wednesday', plan: 'Pushups: 30 | Squats: 25 | Plank: 40s'},
        {day: 'Thursday', plan: 'Pushups: 20 | Squats: 15 | Plank: 30s'},
        {day: 'Friday', plan: 'Pushups: 35 | Squats: 30 | Plank: 45s'},
        {day: 'Saturday', plan: 'Pushups: 40 | Squats: 35 | Plank: 50s'}
    ];
    const trackerElement = document.getElementById('trainingTracker');
    const calendarElement = document.getElementById('calendar');

    updateTrackerAndCalendar();

    function updateTrackerAndCalendar() {
        // Tracker
        const today = new Date();
        const dayName = weekPlan[today.getDay()].day;
        const plan = weekPlan[today.getDay()].plan;
        trackerElement.innerHTML = `<span class="tracker-day">${dayName}:</span> <span class="tracker-plan">${plan}</span>`;
        // Calendar
        renderCalendar(today.getFullYear(), today.getMonth());
    }

    function renderCalendar(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        let html = `<div class='calendar-header'>${year} - ${month + 1}</div><div class='calendar-grid'>`;
        for (let i = 0; i < firstDay; i++) html += `<div class='calendar-cell empty'></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = new Date(year, month, d).toDateString();
            const completed = playerData.questHistory.includes(dateStr);
            html += `<div class='calendar-cell${completed ? ' completed' : ''}'>${d}</div>`;
        }
        html += `</div>`;
        calendarElement.innerHTML = html;
    }

    // Update quest completion to store in questHistory
    function completeQuest() {
        const today = new Date().toDateString();
        if (playerData.lastQuestDate === today) {
            alert('SYSTEM: Quest already completed today!');
            return;
        }
        playerData.exp += 50;
        playerData.stats.str += 1;
        playerData.stats.end += 1;
        playerData.lastQuestDate = today;
        if (!playerData.questHistory.includes(today)) playerData.questHistory.push(today);
        
        // Check for level up
        const expNeeded = playerData.level * 100;
        if (playerData.exp >= expNeeded) {
            playerData.level += 1;
            playerData.exp = 0;
            alert(`SYSTEM: LEVEL UP! You are now Level ${playerData.level}!`);
        }
        
        // Save and update UI
        localStorage.setItem('playerData', JSON.stringify(playerData));
        updateStats();
        renderRadarChart();
        updateTrackerAndCalendar();
        alert('SYSTEM: Quest Complete!\n+1 STR\n+1 END\n+50 EXP');
    }