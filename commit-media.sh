#!/bin/bash
# Script to commit media page changes
git add "src/app/admin/(protected)/media/page.tsx"
git commit -m "fix: Add dynamic export to media page to resolve production 404"
git push origin main
