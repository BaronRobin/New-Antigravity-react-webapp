const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Endpoint to receive analytics logs
app.post('/api/analytics', (req, res) => {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs)) {
        return res.status(400).json({ error: 'Invalid logs format' });
    }

    // Format logs as text
    const logText = logs.map(log => {
        return `[${log.timestamp}] ${log.user} - ${log.type}: ${log.detail}`;
    }).join('\n');

    // Append to daily log file
    const today = new Date().toISOString().split('T')[0];
    const dailyLogFile = path.join(logsDir, `daily_${today}.txt`);

    fs.appendFile(dailyLogFile, logText + '\n\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
            return res.status(500).json({ error: 'Failed to save logs' });
        }

        console.log(`Saved ${logs.length} log entries to ${dailyLogFile}`);
        res.json({ success: true, message: `Saved ${logs.length} logs`, file: dailyLogFile });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ Analytics server running on port ${PORT}`);
    console.log(`📁 Logs will be saved to: ${logsDir}`);
});
