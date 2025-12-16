/**
 * Package Lambda Deployment
 *
 * Creates a deployment package with:
 * - Compiled TypeScript (dist/)
 * - node_modules/
 * - package.json
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('📦 Creating Lambda deployment package...\n');

// Step 1: Clean previous package
const packageDir = path.join(rootDir, 'lambda-package');
if (fs.existsSync(packageDir)) {
  console.log('🧹 Cleaning previous package...');
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir);

// Step 2: Copy dist folder
console.log('📋 Copying compiled code...');
const distSrc = path.join(rootDir, 'dist');
const distDest = path.join(packageDir, 'dist');
if (fs.existsSync(distSrc)) {
  fs.cpSync(distSrc, distDest, { recursive: true });
} else {
  console.error('❌ Error: dist/ folder not found. Run "npm run build" first.');
  process.exit(1);
}

// Step 3: Copy package.json
console.log('📋 Copying package.json...');
fs.copyFileSync(
  path.join(rootDir, 'package.json'),
  path.join(packageDir, 'package.json')
);

// Step 4: Install production dependencies only
console.log('📦 Installing production dependencies...');
try {
  execSync('npm install --production --omit=dev', {
    cwd: packageDir,
    stdio: 'inherit'
  });
} catch (error) {
  console.error('❌ Error installing dependencies:', error);
  process.exit(1);
}

// Step 5: Create .env file template
console.log('📝 Creating .env template...');
const envTemplate = `# AWS Lambda Environment Variables
# Configure these in AWS Lambda Console -> Configuration -> Environment variables

GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
`;

fs.writeFileSync(path.join(packageDir, '.env.example'), envTemplate);

// Step 6: Create ZIP file
console.log('🗜️  Creating ZIP file...');
const zipFile = path.join(rootDir, 'karmank-backend-lambda.zip');
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  // Use native zip command or PowerShell on Windows
  if (process.platform === 'win32') {
    execSync(`powershell Compress-Archive -Path "${packageDir}\\*" -DestinationPath "${zipFile}"`, {
      stdio: 'inherit'
    });
  } else {
    execSync(`cd "${packageDir}" && zip -r "${zipFile}" .`, {
      stdio: 'inherit'
    });
  }

  const stats = fs.statSync(zipFile);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n✅ Deployment package created successfully!`);
  console.log(`📦 File: ${zipFile}`);
  console.log(`📏 Size: ${fileSizeMB} MB`);
  console.log(`\n📋 Next steps:`);
  console.log(`1. Go to AWS Lambda Console`);
  console.log(`2. Open your "karmank-backend" function`);
  console.log(`3. Click "Upload from" -> ".zip file"`);
  console.log(`4. Upload: ${path.basename(zipFile)}`);
  console.log(`5. Set Handler to: dist/lambda.handler`);
  console.log(`6. Configure environment variables (see .env.example)`);

} catch (error) {
  console.error('❌ Error creating ZIP:', error);
  process.exit(1);
}
