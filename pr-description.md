# ENG-645: Integrate `research` into `functions.do` and `research.do`

This PR implements the bidirectional integration between the strongly-typed AI functions SDK (functions.do) and the deep research SDK (research.do).

## Changes

1. Modified `research.do` to use `functions.do` internally instead of direct API calls
2. Enhanced `functions.do` with standardized research functions:
   - Generic `research` function
   - `researchCompany` for company insights
   - `researchPersonalBackground` for personal background research
   - `researchSocialActivity` for social media presence analysis
3. Created consistent interfaces across both SDKs
4. Ensured backward compatibility

## Implementation Decisions

1. **Bidirectional Integration Approach**:

   - Modified research.do to use functions.do while maintaining its original interface
   - Enhanced functions.do with research capabilities that mirror research.do's functionality

2. **Research Function Standardization**:

   - Added four primary research functions:
     - `research`: Generic research function
     - `researchCompany`: Company-specific research
     - `researchPersonalBackground`: Individual background research
     - `researchSocialActivity`: Social media activity analysis

3. **Parameter Standardization**:

   - Maintained consistent parameter names between SDKs
   - Preserved the existing options structure for backward compatibility

4. **Model Configuration**:

   - Kept 'perplexity/sonar-deep-research' as the default model for research functions
   - Allowed customization through options passed to the client

5. **Asynchronous Operation**:
   - Maintained the current asynchronous pattern with taskId/jobId response
   - Preserved the existing response structure for backward compatibility

Link to Devin run: https://app.devin.ai/sessions/890d27ca166140e8baee3d7d52cebe2c
Requested by: Nathan Clevenger (nateclev@gmail.com)
