# 3D Grillz Analytics Backend - Raspberry Pi Setup

## Quick Setup Instructions

### 1. Transfer Files to Pi
From your Mac, while connected to the same network as your Pi:

```bash
# Copy the pi-backend folder to your Pi
scp -r pi-backend pi@192.168.1.61:~/3d-grillz-analytics
```

### 2. On Your Raspberry Pi
SSH into your Pi and run:

```bash
cd ~/3d-grillz-analytics
npm install
node server.js
```

The server will start on port 3001 and create a `logs` folder where all analytics will be saved as `.txt` files.

### 3. Make it Run on Startup (Optional)
To make the server start automatically when the Pi boots:

```bash
# Install PM2 (process manager)
sudo npm install -g pm2

# Start the server with PM2
pm2 start server.js --name "3d-grillz-analytics"

# Save the PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 4. Update React App
The React app needs to know your Pi's IP address. Update `src/context/AnalyticsContext.jsx` with:

```javascript
const PI_SERVER_URL = 'http://192.168.1.61:3001';
```

## Log File Format
Logs are saved daily as: `daily_2025-12-17.txt`

Example content:
```
[2025-12-17T15:20:30.000Z] user@grillz.com - NAVIGATION: Visited /dashboard
[2025-12-17T15:20:35.000Z] user@grillz.com - INTERACTION: Clicked Try in AR
[2025-12-17T15:20:40.000Z] admin@grillz.com - NAVIGATION: Visited /admin
```

## Testing
Test the server is running:
```bash
curl http://192.168.1.61:3001/api/health
```

Expected response: `{"status":"running","timestamp":"2025-12-17T..."}
`

## Accessing Logs
All log files are saved in: `~/3d-grillz-analytics/logs/`

View today's logs:
```bash
cat ~/3d-grillz-analytics/logs/daily_$(date +%Y-%m-%d).txt
```
