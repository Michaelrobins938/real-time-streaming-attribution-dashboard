# Real-Time Streaming Attribution Demo Startup Script
Write-Host "Starting Netflix-Scale Streaming Attribution Demo..." -ForegroundColor Cyan

# Use background jobs for the persistent processes
$apiJob = Start-Job -ScriptBlock {
    cd "x:\attribution_assets\Real-Time Streaming Attribution Dashboard"
    python src/api/websocket_server.py
}
Write-Host "Started WebSocket API Server on port 8000" -ForegroundColor Green

# Wait for API to warm up
Start-Sleep -Seconds 3

$orchJob = Start-Job -ScriptBlock {
    cd "x:\attribution_assets\Real-Time Streaming Attribution Dashboard"
    python src/engine/orchestrator.py
}
Write-Host "Started Streaming Orchestrator (1000 events/sec)" -ForegroundColor Green

Write-Host "Starting Dashboard..." -ForegroundColor Yellow
cd dashboard
npm run dev
