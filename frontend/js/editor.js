const runCodeBtn = document.getElementById('runCodeBtn');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const fileUpload = document.getElementById('fileUpload');
const zipUpload = document.getElementById('zipUpload');
const codeEditor = document.getElementById('codeEditor');
const projectNameInput = document.getElementById('projectName');
const languageSelect = document.getElementById('languageSelect');

// Handle file upload
fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            codeEditor.value = event.target.result;
            projectNameInput.value = file.name.split('.')[0];
            showToast(`File loaded: ${file.name}`, 'success');
        };
        reader.readAsText(file);
    }
});

// Handle ZIP upload
zipUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        showLoading(true);
        api.uploadZip(file)
            .then(response => {
                projectNameInput.value = response.projectId;
                showToast(`ZIP extracted: ${response.filesCount} files`, 'success');
            })
            .catch(error => {
                showToast(error.message, 'error');
            })
            .finally(() => showLoading(false));
    }
});

// Handle run code
runCodeBtn.addEventListener('click', () => {
    const code = codeEditor.value.trim();
    const language = languageSelect.value;

    if (!code) {
        showToast('Please enter some code', 'error');
        return;
    }

    if (!language) {
        showToast('Please select a language', 'error');
        return;
    }

    executeCode(code, language);
});

// Handle save project
saveProjectBtn.addEventListener('click', () => {
    const name = projectNameInput.value.trim();
    const language = languageSelect.value;

    if (!name || !language) {
        showToast('Please enter project name and select language', 'error');
        return;
    }

    showLoading(true);
    api.createProject(name, '', language)
        .then(response => {
            showToast('Project saved successfully!', 'success');
            updateStats();
        })
        .catch(error => {
            showToast(error.message, 'error');
        })
        .finally(() => showLoading(false));
});

function executeCode(code, language) {
    showLoading(true);
    const terminalPanel = document.getElementById('terminalPanel');
    const terminalContent = document.getElementById('terminalContent');
    const stopBtn = document.getElementById('stopExecutionBtn');

    terminalPanel.classList.remove('hidden');
    terminalContent.innerHTML = '<div class="terminal-message info">Starting execution...</div>';

    api.runCode(null, language, code)
        .then(response => {
            const executionId = response.executionId;
            stopBtn.classList.remove('hidden');
            stopBtn.onclick = () => {
                api.stopExecution(executionId);
                stopBtn.classList.add('hidden');
            };

            // Subscribe to real-time logs
            socket.emit('subscribe_logs', executionId);

            // Listen for logs
            socket.on('log', (logData) => {
                addTerminalMessage(logData.message, logData.type);
            });

            // Listen for execution completion
            socket.on('execution_update', (execution) => {
                if (execution.id === executionId) {
                    if (execution.status === 'completed') {
                        addTerminalMessage('Execution completed successfully', 'success');
                    } else if (execution.status === 'error') {
                        addTerminalMessage('Execution failed with errors', 'error');
                    }
                    stopBtn.classList.add('hidden');
                }
            });
        })
        .catch(error => {
            addTerminalMessage(`Error: ${error.message}`, 'error');
            showToast(error.message, 'error');
        })
        .finally(() => showLoading(false));
}

function addTerminalMessage(message, type = 'log') {
    const terminalContent = document.getElementById('terminalContent');
    const messageEl = document.createElement('div');
    messageEl.className = `terminal-message ${type}`;
    messageEl.textContent = message;
    terminalContent.appendChild(messageEl);
    terminalContent.scrollTop = terminalContent.scrollHeight;
}
