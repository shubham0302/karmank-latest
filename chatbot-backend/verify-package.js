/**
 * Verify Lambda Package Structure
 *
 * This script verifies that the Lambda deployment package is correctly structured
 * and ready for deployment to AWS Lambda.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const zipFile = path.join(__dirname, 'karmank-backend-lambda.zip');

console.log('🔍 Verifying Lambda Package Structure...\n');

// Check 1: ZIP file exists
if (!fs.existsSync(zipFile)) {
  console.error('❌ ZIP file not found:', zipFile);
  console.error('   Run: npm run build:lambda');
  process.exit(1);
}

const stats = fs.statSync(zipFile);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`✅ ZIP file found: ${sizeMB} MB`);

// Check 2: List ZIP contents
console.log('\n📦 Checking package contents...');
try {
  const contents = execSync(`unzip -l "${zipFile}"`, { encoding: 'utf-8' });

  // Critical files to check
  const criticalFiles = [
    'dist/lambda.js',
    'dist/services/numerology-calculator.js',
    'dist/services/data-service.js',
    'dist/data/proprietary-data.js',
    'package.json',
    'node_modules/@google/generative-ai'
  ];

  let allFound = true;
  criticalFiles.forEach(file => {
    if (contents.includes(file.replace(/\\/g, '/'))) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.error(`❌ Missing: ${file}`);
      allFound = false;
    }
  });

  // Check 3: Verify forward slashes (not backslashes)
  console.log('\n🔍 Checking path format...');
  const lines = contents.split('\n');
  let hasBackslashes = false;

  for (const line of lines) {
    if (line.includes('dist\\') || line.includes('node_modules\\')) {
      console.error(`❌ Found backslash in path: ${line.trim()}`);
      hasBackslashes = true;
      break;
    }
  }

  if (!hasBackslashes) {
    console.log('✅ All paths use forward slashes (Linux-compatible)');
  } else {
    console.error('❌ Package has Windows-style paths (backslashes)');
    console.error('   This will cause 502 errors on Lambda!');
    console.error('   Fix: Ensure archiver package is installed and rebuild:');
    console.error('   npm install --save-dev archiver');
    console.error('   npm run build:lambda');
    allFound = false;
  }

  // Check 4: Verify package.json has "type": "module"
  console.log('\n🔍 Checking package.json...');
  const packageJsonContent = execSync(`unzip -p "${zipFile}" package.json`, { encoding: 'utf-8' });
  const packageJson = JSON.parse(packageJsonContent);

  if (packageJson.type === 'module') {
    console.log('✅ package.json has "type": "module"');
  } else {
    console.error('❌ package.json missing "type": "module"');
    allFound = false;
  }

  // Check 5: Verify handler exists
  console.log('\n🔍 Verifying Lambda handler...');
  const lambdaJs = execSync(`unzip -p "${zipFile}" dist/lambda.js`, { encoding: 'utf-8' });

  if (lambdaJs.includes('export const handler')) {
    console.log('✅ Handler exported correctly: "export const handler"');
  } else {
    console.error('❌ Handler export not found or incorrect');
    allFound = false;
  }

  if (lambdaJs.includes('Access-Control-Allow-Origin')) {
    console.log('✅ CORS headers present in handler');
  } else {
    console.error('❌ CORS headers missing from handler');
    allFound = false;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allFound && !hasBackslashes) {
    console.log('✅ Package verification PASSED');
    console.log('\n📋 Ready to deploy!');
    console.log('1. Go to: https://console.aws.amazon.com/lambda/');
    console.log('2. Open function: karmank-backend');
    console.log('3. Upload from → .zip file');
    console.log(`4. Select: ${path.basename(zipFile)}`);
    console.log('5. Set Handler to: dist/lambda.handler');
    console.log('6. Runtime: Node.js 20.x');
  } else {
    console.error('❌ Package verification FAILED');
    console.error('\nFix the errors above and rebuild:');
    console.error('npm run build:lambda');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Error reading ZIP file:', error.message);
  process.exit(1);
}
