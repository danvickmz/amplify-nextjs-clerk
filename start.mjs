#!/usr/bin/env node
import { spawn } from 'child_process';
import './secret-loader.mjs';

// Start Next.js
const nextProcess = spawn('npx', ['next', 'start'], {
    stdio: 'inherit',
    env: process.env
});

nextProcess.on('exit', (code) => {
    process.exit(code);
});
