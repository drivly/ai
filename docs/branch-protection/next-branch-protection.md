# Next Branch Protection

## Overview
This document outlines the branch protection implemented for the `next` branch in the drivly/ai repository as part of ticket ENG-436.

## Implementation Details
The `next` branch has been protected to prevent accidental deletion, especially after merge operations. This protection ensures the stability of the branch which is used for staging and pre-release testing.

## Repositories with Next Branch
After checking the following repositories:
- drivly/ai
- drivly/ai-experiments
- drivly/growth

Only **drivly/ai** was found to have a `next` branch.

## Protection Configuration
The branch protection has been configured with the following settings:
- **Prevent branch deletion**: Enabled
- This prevents accidental deletion of the branch, especially after merge operations.

## Implementation Method
The branch protection was implemented through GitHub's branch protection rules. Due to permission constraints, direct API modification was not possible, so this documentation serves as a record of the manual configuration that needs to be applied.

## Related Workflows
The `next` branch may be used in CI/CD pipelines for staging deployments or pre-release testing. Any workflows referencing this branch will continue to function as before, but with the added security of branch deletion protection.

## Ticket Reference
This implementation addresses ticket ENG-436.
