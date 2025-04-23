#!/bin/bash
aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-1:580880756845:secret:1851-Admin-BE-API-Prod-hilfCK --profile prod| \
jq -r '.SecretString' | \
jq -r 'to_entries|map("\(.key) = \(.value|tostring)")|.[]' > .env.production.local
