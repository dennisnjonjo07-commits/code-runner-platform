// Execution handler
class ExecutionManager {
    constructor() {
        this.currentExecution = null;
        this.setupSocketListeners();
    }

    setupSocketListeners() {
        socket.on('connect', () => {
            console.log('Connected to execution server');
        });

        socket.on('log', (data) => {
            this.handleLog(data);
        });

        socket.on('execution_update', (execution) => {
            this.handleExecutionUpdate(execution);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    handleLog(logData) {
        const terminalContent = document.getElementById('terminalContent');
        const messageEl = document.createElement('div');
        messageEl.className = `terminal-message ${logData.type}`;
        messageEl.textContent = logData.message;
        terminalContent.appendChild(messageEl);
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    handleExecutionUpdate(execution) {
        if (execution.status === 'completed') {
            this.onExecutionComplete(execution);
        } else if (execution.status === 'error') {
            this.onExecutionError(execution);
        } else if (execution.status === 'timeout') {
            this.onExecutionTimeout(execution);
        }
    }

    onExecutionComplete(execution) {
        const terminalContent = document.getElementById('terminalContent');
        const messageEl = document.createElement('div');
        messageEl.className = 'terminal-message success';
        messageEl.innerHTML = `<strong>✓ Execution Completed</strong><br>Exit Code: ${execution.exitCode}<br>Duration: ${this.calculateDuration(execution.startTime, execution.endTime)}`;
        terminalContent.appendChild(messageEl);
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    onExecutionError(execution) {
        const terminalContent = document.getElementById('terminalContent');
        if (execution.errors.length > 0) {
            execution.errors.forEach(error => {
                const messageEl = document.createElement('div');
                messageEl.className = 'terminal-message error';
                messageEl.textContent = error;
                terminalContent.appendChild(messageEl);
            });
        }
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    onExecutionTimeout(execution) {
        const terminalContent = document.getElementById('terminalContent');
        const messageEl = document.createElement('div');
        messageEl.className = 'terminal-message error';
        messageEl.textContent = '✗ Execution Timeout: exceeded 60 seconds';
        terminalContent.appendChild(messageEl);
    }

    calculateDuration(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const duration = (end - start) / 1000;
        return `${duration.toFixed(2)}s`;
    }
}

const executionManager = new ExecutionManager();
