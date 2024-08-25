#!/bin/bash

ISSUE_TEMPLATE_CREATED_FILE=".github/ISSUE_TEMPLATE/issue_template_configured.txt"

# Check if the repository name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <repository-name>"
  exit 1
fi

# Check if the script has already run
if [ -f "$FLAG_FILE" ]; then
  echo "Config has already been generated."
  exit 0
fi

REPO=$1
TEMPLATE_FILE=".github/ISSUE_TEMPLATE/config.template.yml"
OUTPUT_FILE=".github/ISSUE_TEMPLATE/config.yml"

# Replace placeholder with actual repository name
sed "s/{REPO}/$REPO/g" $TEMPLATE_FILE > $OUTPUT_FILE

# Create a file with a timestamp to indicate the script has run
echo "Config generated for repository: $REPO on $(date '+%Y-%m-%d %H:%M:%S')" > "$ISSUE_TEMPLATE_CREATED_FILE"

echo "Generated config.yml for repository: $REPO"
