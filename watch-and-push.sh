#!/bin/bash

echo "Starting auto-push watch script at $(date '+%Y-%m-%d %H:%M:%S')"
echo "Press Ctrl+C to stop"

while true; do
  ./auto-push.sh
  sleep 10
done
