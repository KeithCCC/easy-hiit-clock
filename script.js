// HIIT Clock Controller
class HIITClock {
    constructor() {
        // Exercise sequence
        this.exercises = [
            { name: 'Warm Up', duration: 30, step: 1 },
            { name: 'High Knees', duration: 45, step: 2 },
            { name: 'Rest', duration: 15, step: 3 },
            { name: 'Burpees', duration: 45, step: 4 },
            { name: 'Rest', duration: 15, step: 5 },
            { name: 'Jump Squats', duration: 45, step: 6 },
            { name: 'Rest', duration: 15, step: 7 },
            { name: 'Mountain Climbers', duration: 45, step: 8 },
            { name: 'Rest', duration: 15, step: 9 },
            { name: 'Cool Down', duration: 30, step: 10 }
        ];

        this.currentExerciseIndex = 0;
        this.timeRemaining = 0;
        this.totalTime = 0;
        this.isRunning = false;
        this.timerInterval = null;

        // DOM Elements
        this.timerDisplay = document.getElementById('timer');
        this.exerciseName = document.getElementById('exerciseName');
        this.exerciseStep = document.getElementById('exerciseStep');
        this.goBtn = document.getElementById('goBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.progressFill = document.getElementById('progressFill');
        this.timerDisplayContainer = document.querySelector('.timer-display');

        // Bind events
        this.goBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Initialize display
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            // If starting fresh or from reset
            if (this.timeRemaining === 0) {
                const currentExercise = this.exercises[this.currentExerciseIndex];
                this.timeRemaining = currentExercise.duration;
                this.totalTime = currentExercise.duration;
            }

            this.isRunning = true;
            this.goBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.timerDisplayContainer.classList.add('timer-active');

            this.timerInterval = setInterval(() => this.tick(), 1000);
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            this.goBtn.disabled = false;
            this.stopBtn.disabled = true;
            this.timerDisplayContainer.classList.remove('timer-active');
        }
    }

    reset() {
        this.stop();
        this.currentExerciseIndex = 0;
        this.timeRemaining = 0;
        this.totalTime = 0;
        this.updateDisplay();
    }

    tick() {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
            this.playBeep();
            this.moveToNextExercise();
        }

        this.updateDisplay();
    }

    moveToNextExercise() {
        this.currentExerciseIndex++;

        if (this.currentExerciseIndex >= this.exercises.length) {
            // Workout complete
            this.stop();
            this.showCompletion();
            return;
        }

        const nextExercise = this.exercises[this.currentExerciseIndex];
        this.timeRemaining = nextExercise.duration;
        this.totalTime = nextExercise.duration;
    }

    showCompletion() {
        this.exerciseName.textContent = 'Workout Complete!';
        this.exerciseStep.textContent = 'Great job! 🎉';
        this.timerDisplay.textContent = '00:00';
        this.progressFill.style.width = '100%';
    }

    updateDisplay() {
        // Update timer display
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Update exercise info
        if (this.currentExerciseIndex < this.exercises.length) {
            const currentExercise = this.exercises[this.currentExerciseIndex];
            this.exerciseName.textContent = currentExercise.name;
            this.exerciseStep.textContent = 
                `Step ${currentExercise.step} of ${this.exercises.length}`;

            // Update progress bar
            if (this.totalTime > 0) {
                const progress = ((this.totalTime - this.timeRemaining) / this.totalTime) * 100;
                this.progressFill.style.width = `${progress}%`;
            } else {
                this.progressFill.style.width = '0%';
            }

            // Change timer color based on exercise type
            if (currentExercise.name === 'Rest') {
                this.timerDisplay.style.color = '#4a90e2';
                this.timerDisplay.style.textShadow = '0 0 20px rgba(74, 144, 226, 0.5)';
            } else if (currentExercise.name === 'Warm Up' || currentExercise.name === 'Cool Down') {
                this.timerDisplay.style.color = '#ffd700';
                this.timerDisplay.style.textShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            } else {
                this.timerDisplay.style.color = '#00ff88';
                this.timerDisplay.style.textShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
            }
        } else {
            this.exerciseName.textContent = 'Ready to Start';
            this.exerciseStep.textContent = 'Press GO to begin';
            this.progressFill.style.width = '0%';
        }
    }

    playBeep() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
}

// Initialize the clock when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const clock = new HIITClock();
});
