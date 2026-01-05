/**
 * Deploy Lambda Function to AWS
 *
 * This script helps deploy the Lambda package to AWS Lambda
 * You need AWS credentials configured first
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration - UPDATE THESE VALUES
const CONFIG = {
  functionName: 'karmank-backend',  // Your Lambda function name
  region: 'ap-southeast-2',          // Your AWS region (Sydney)
  zipFile: path.join(__dirname, '..', 'karmank-backend-lambda.zip')
};

console.log('🚀 KarmAnk Lambda Deployment Script\n');

// Check if ZIP file exists
if (!fs.existsSync(CONFIG.zipFile)) {
  console.error('❌ Error: Lambda package not found!');
  console.error(`Expected: ${CONFIG.zipFile}`);
  console.error('\nRun: npm run build:lambda');
  process.exit(1);
}

// Get file size
const stats = fs.statSync(CONFIG.zipFile);
const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`📦 Package: ${path.basename(CONFIG.zipFile)}`);
console.log(`📏 Size: ${fileSizeMB} MB\n`);

// Check if AWS CLI is installed
try {
  execSync('aws --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ AWS CLI is not installed!');
  console.error('\nPlease install AWS CLI:');
  console.error('Windows: https://awscli.amazonaws.com/AWSCLIV2.msi');
  console.error('Mac: brew install awscli');
  console.error('Linux: sudo apt install awscli');
  process.exit(1);
}

// Check if AWS credentials are configured
try {
  execSync('aws sts get-caller-identity', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ AWS credentials not configured!');
  console.error('\nRun: aws configure');
  console.error('You will need:');
  console.error('- AWS Access Key ID');
  console.error('- AWS Secret Access Key');
  console.error('- Default region name (e.g., us-east-1)');
  process.exit(1);
}

console.log('✅ AWS CLI configured\n');
console.log(`🎯 Deploying to Lambda function: ${CONFIG.functionName}`);
console.log(`🌍 Region: ${CONFIG.region}\n`);

// Deploy to Lambda
try {
  console.log('📤 Uploading package to AWS Lambda...\n');

  const command = `aws lambda update-function-code --function-name ${CONFIG.functionName} --zip-file fileb://${CONFIG.zipFile} --region ${CONFIG.region}`;

  const result = execSync(command, { encoding: 'utf8' });
  const response = JSON.parse(result);

  console.log('✅ Deployment successful!\n');
  console.log('📋 Function Details:');
  console.log(`   Function Name: ${response.FunctionName}`);
  console.log(`   Runtime: ${response.Runtime}`);
  console.log(`   Handler: ${response.Handler}`);
  console.log(`   Code Size: ${(response.CodeSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`   Last Modified: ${response.LastModified}`);
  console.log(`   Version: ${response.Version}\n`);

  console.log('🎉 Deployment complete!');
  console.log('⏳ Wait 10-20 seconds for Lambda to fully deploy');
  console.log('🔄 Then hard refresh your app (Ctrl+Shift+R)\n');

} catch (error) {
  console.error('❌ Deployment failed!\n');

  if (error.message.includes('ResourceNotFoundException')) {
    console.error(`Function "${CONFIG.functionName}" not found in region ${CONFIG.region}`);
    console.error('\nPlease update CONFIG.functionName and CONFIG.region in this script');
    console.error('Or create the Lambda function first in AWS Console\n');
  } else if (error.message.includes('AccessDenied')) {
    console.error('Access denied. Your AWS credentials need lambda:UpdateFunctionCode permission\n');
  } else {
    console.error(error.message);
  }

  process.exit(1);
}
