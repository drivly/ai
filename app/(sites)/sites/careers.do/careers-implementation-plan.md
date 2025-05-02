# Careers.do Implementation Plan

## Slack Integration Details

- **Short Description:** "Careers channel for `.do` applicants"
- **Long Description:** "This Slack integration automatically notifies the careers team about new job applicants who apply through the careers.do website using GitHub authentication. It delivers comprehensive applicant profiles including GitHub details, position applied for, and contact information to streamline the hiring process."

## Implementation Steps

### 1. GitHub Authentication

- Implement NextAuth.js with GitHub provider
- Configure necessary scopes (profile, email)
- Create sign-in/sign-out API routes
- Handle authentication callbacks

### 2. Application Flow

- Create server action to handle application submission
- Modify "Apply with GitHub" buttons to trigger auth
- After auth, collect GitHub profile data (name, email, profile URL, bio)
- Include job position info in application submission

### 3. Slack Integration

- Create Slack app with webhook URL
- Build formatted message template with applicant details
- Send webhook request from API endpoint

### 4. Email Confirmation

- Set up email service (Resend/SendGrid/etc.)
- Design email template with branding
- Send confirmation email after successful application

### 5. Success Experience

- Create modal dialog component
- Show success state with confirmation details
- Include "what happens next" information

## Progress Tracking

- [x] GitHub Authentication
- [x] Application Flow
- [x] Slack Integration
- [x] Email Confirmation
- [x] Success Experience

## Implementation Notes

### Completed Components

1. **Slack Integration** - Created enhanced Slack notifications with application details including:

   - Position applied for
   - Applicant name and email
   - GitHub profile link and avatar
   - GitHub bio and stats when available

2. **Email System** - Implemented application confirmation emails with:

   - Personalized confirmation for applicant
   - Job position details
   - Next steps information
   - Links to explore Drivly GitHub

3. **Success Experience** - Built a success modal that:
   - Confirms application was received
   - Shows personalized details
   - Sets expectations for next steps
   - Provides a clean user experience

### Integration Flow

The complete flow is now:

1. User clicks "Apply with GitHub"
2. GitHub OAuth authentication occurs
3. User details collected from GitHub profile
4. Application details sent to Slack careers channel
5. Confirmation email sent to applicant
6. Success dialog shown to applicant
