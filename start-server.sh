#!/bin/sh

# Fail immediately if any command fails
set -e

echo "Fetching secrets from SSM..."

# Check if AWS_APP_ID is set
if [ -z "$AWS_APP_ID" ]; then
  echo "Error: AWS_APP_ID environment variable is not set"
  exit 1
fi

echo "Using AWS_APP_ID: $AWS_APP_ID"

# Use the 'get-parameters-by-path' command
params=(
  CLERK_SECRET_KEY
)
for key in "${params[@]}"; do
  # Construct parameter name - ensure it doesn't start with 'ssm'
  param_name="/amplify/shared/${AWS_APP_ID}/${key}"
  echo "Fetching parameter: $param_name"
  
  raw=$(aws ssm get-parameter \
          --name "$param_name" \
          --query "Parameter.Value" \
          --with-decryption \
          --region "eu-west-2" \
          --output text 2>&1)
  
  if [ $? -eq 0 ]; then
    export ${key}=${raw}
    echo "Successfully fetched and exported $key"
  else
    echo "Error fetching parameter $param_name: $raw"
    exit 1
  fi
done

echo "Secrets injected into process.env, starting Next.js server..."

# Debug: Show that the key was exported (without showing the actual value for security)
if [ -n "$CLERK_SECRET_KEY" ]; then
  echo "CLERK_SECRET_KEY is set (length: ${#CLERK_SECRET_KEY})"
else
  echo "Warning: CLERK_SECRET_KEY is not set"
fi

pwd

npm run start-next-server
