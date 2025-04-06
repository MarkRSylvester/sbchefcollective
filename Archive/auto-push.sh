#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check and push changes
check_and_push() {
    # Check if there are any changes
    if git status --porcelain | grep .; then
        echo -e "${YELLOW}Changes detected, pushing...${NC}"
        
        # Add all changes
        git add .
        
        # Get current timestamp
        timestamp=$(date "+%Y-%m-%d %H:%M:%S")
        
        # Commit with timestamp
        git commit -m "Auto-update: $timestamp"
        
        # Push to main branch
        git push origin main
        
        echo -e "${GREEN}Changes pushed successfully!${NC}"
        echo "-----------------------------------"
    fi
}

# Main script
echo -e "${GREEN}=== SBCC Auto-Push Script ===${NC}"
echo -e "${YELLOW}Watching for changes... Press Ctrl+C to stop${NC}"
echo "-----------------------------------"

# Continuous loop
while true; do
    check_and_push
    sleep 5  # Wait 5 seconds before checking again
done
