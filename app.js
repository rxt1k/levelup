document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const nameInput = document.getElementById('nameInput');
    const dobInput = document.getElementById('dobInput');
    
    submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const dob = dobInput.value;
        if (name && dob) {
            localStorage.setItem('playerName', name);
            let playerData = JSON.parse(localStorage.getItem('playerData')) || {};
            playerData.dob = dob;
            localStorage.setItem('playerData', JSON.stringify(playerData));
            window.location.href = 'dashboard.html';
        }
    });
    
    // Enter key support
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});