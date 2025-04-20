# LINEAR_WEBHOOK_SECRET

## Description
This environment variable contains the secret used to verify webhooks from Linear. It is used by the svix library to verify the authenticity of incoming webhook requests.

## Format Requirements
The LINEAR_WEBHOOK_SECRET must be properly Base64 encoded for the svix library to work correctly. The secret can be in one of two formats:

1. With prefix: `whsec_YWJjZGVmMTIzNDU2`
2. Without prefix: `YWJjZGVmMTIzNDU2`

If the secret starts with "whsec_", ensure the part after "whsec_" is valid Base64. If it doesn't start with "whsec_", the entire string should be valid Base64.

## Common Issues
If the LINEAR_WEBHOOK_SECRET contains characters that are invalid for Base64 decoding, the webhook verification will fail with an error like:
```
Linear webhook verification failed: Error: Base64Coder: incorrect characters for decoding
```

## How to Update
1. Retrieve the current webhook secret from the Linear dashboard (Settings > API > Webhooks)
2. Format the secret according to the requirements above
3. Update the LINEAR_WEBHOOK_SECRET environment variable in the deployment platform
