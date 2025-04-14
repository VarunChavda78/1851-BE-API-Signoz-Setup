#!/bin/bash
aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-1:025212946569:secret:1851-Admin-BE-API-Dev-RDBZQZ | \
jq -r '.SecretString' | \
jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' > .env.production.local
