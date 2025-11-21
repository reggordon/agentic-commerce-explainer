#!/bin/bash
# Start backend and open frontend in browser
node backend/server.js &
sleep 2
if [[ "$OSTYPE" == "darwin"* ]]; then
  open http://localhost:4000/
elif command -v xdg-open > /dev/null; then
  xdg-open http://localhost:4000/
else
  echo "Please open http://localhost:4000/ in your browser."
fi
