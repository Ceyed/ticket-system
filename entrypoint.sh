#!/bin/sh

# Run database migrations
pnpm run migration:run

# Start the application
pnpm start:prod
