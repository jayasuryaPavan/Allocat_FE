#!/bin/sh

# Default to empty string if not set
VITE_API_BASE_URL=${VITE_API_BASE_URL:-""}

# Create env-config.js file
cat <<EOF > /usr/share/nginx/html/env-config.js
window.env = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
};
EOF
