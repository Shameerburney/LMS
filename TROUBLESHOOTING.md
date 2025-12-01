# Troubleshooting npm Installation Issues

## Problem
npm is configured to use an invalid cache path (`E:\npm-cache`) which doesn't exist.

## Solution Options

### Option 1: Fix npm Configuration (Recommended)

**Open Command Prompt (CMD) as Administrator:**

1. Press `Win + R`
2. Type `cmd` and press `Ctrl + Shift + Enter` (to run as admin)
3. Navigate to the project:
   ```cmd
   cd C:\Users\SB\OneDrive\Desktop\ai-lms
   ```

4. Fix npm cache configuration:
   ```cmd
   npm config set cache "C:\Users\SB\AppData\Local\npm-cache" --global
   npm cache clean --force
   npm install
   ```

### Option 2: Use the Batch Script

Simply double-click `setup-and-run.bat` in the project folder. This will:
- Configure npm cache
- Clean cache
- Install dependencies
- Start the dev server

### Option 3: Manual Installation

If npm continues to fail, you can manually install dependencies:

1. Download and install the latest Node.js from https://nodejs.org/
2. After installation, restart your computer
3. Try the installation again

### Option 4: Use Yarn Instead

If npm continues to have issues, use Yarn:

```cmd
npm install -g yarn
cd C:\Users\SB\OneDrive\Desktop\ai-lms
yarn install
yarn dev
```

## Verification

After successful installation, you should see:
- A `node_modules` folder in the project directory
- The dev server starting at `http://localhost:3000`

## Common Issues

### PowerShell Execution Policy Error
If you see "running scripts is disabled", use **Command Prompt (CMD)** instead of PowerShell.

### Cache Path Error
If you see `ENOENT: no such file or directory, mkdir '\\?'`, run:
```cmd
npm config delete cache
npm config set cache "%USERPROFILE%\AppData\Local\npm-cache"
```

### Network Issues
If downloads fail, try:
```cmd
npm config set registry https://registry.npmjs.org/
npm install
```

## Need Help?

If none of these solutions work, please provide:
1. Your Node.js version: `node --version`
2. Your npm version: `npm --version`
3. The full error message
