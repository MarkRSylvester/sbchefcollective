#!/bin/bash

# Initialize variables
CHANGE_DETECTED=0
LAST_CHANGE_TIME=0
COOLDOWN_PERIOD=30  # Wait 30 seconds after last change before pushing

while true; do
    # Check if there are any changes
    if git status --porcelain | grep .; then
        CHANGE_DETECTED=1
        LAST_CHANGE_TIME=$(date +%s)
    else
        # If no changes and we previously detected changes
        if [ $CHANGE_DETECTED -eq 1 ]; then
            CURRENT_TIME=$(date +%s)
            ELAPSED_TIME=$((CURRENT_TIME - LAST_CHANGE_TIME))
            
            # If enough time has passed since last change
            if [ $ELAPSED_TIME -ge $COOLDOWN_PERIOD ]; then
                echo "No new changes detected for $COOLDOWN_PERIOD seconds, proceeding with commit and push..."
                git add .
                git commit -m "Auto-update $(date +%Y-%m-%d_%H-%M-%S)"
                git push origin main
                CHANGE_DETECTED=0
            fi
        fi
    fi
    
    sleep 10
done
