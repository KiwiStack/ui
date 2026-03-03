#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Building kiwi-web..."
pnpm --filter kiwi-web build

echo "Deploying to CT 107..."
ssh root@10.10.10.107 'mkdir -p /var/www/kiwi-ui'
rsync -avz --delete apps/kiwi-web/build/ root@10.10.10.107:/var/www/kiwi-ui/
ssh root@10.10.10.107 'systemctl reload nginx'

echo "Deployed to https://demo.kiwistack.io"
