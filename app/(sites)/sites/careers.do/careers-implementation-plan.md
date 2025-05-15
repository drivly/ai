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

---

# TODO: Bryant's Careers Slack Experience

Below is the full interaction flow for your “Careers” channel—from the moment Careers.do posts a new candidate, through the Reject and Book Meeting flows, ending with thread confirmations.

---

## 1) Post New Candidate to `#careers`

**API call**: `chat.postMessage`
**Channel**: `#careers`
**Payload**:

```json
{
  "channel": "#careers",
  "response_type": "in_channel",
  "text": "New DevRel Candidate: Nathan Clevenger",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*New DevRel Candidate:* <https://github.com/nathanclevenger|Nathan Clevenger>"
      }
    },
    { "type": "divider" },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Email*\nNot public" },
        { "type": "mrkdwn", "text": "*Location*\nNot specified" },
        { "type": "mrkdwn", "text": "*Organization*\nDrivly Chatbox" },
        { "type": "mrkdwn", "text": "*Last active*\nApr 26, 2025" }
      ],
      "accessory": {
        "type": "image",
        "image_url": "https://avatars.githubusercontent.com/u/4130910?v=4",
        "alt_text": "Nathan’s avatar"
      }
    },
    { "type": "divider" },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "> Nathan is a coder, serial entrepreneur, and angel investor.\n> Founder & CTO at Drivly Chatbox.\n> Previously CTO @ iFactr, acquired by Zebra."
      }
    },
    { "type": "divider" },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Repos*\n263" },
        { "type": "mrkdwn", "text": "*Followers*\n34" },
        { "type": "mrkdwn", "text": "*Joined*\nApr 2013" },
        { "type": "mrkdwn", "text": "*Public Gists*\n33" },
        { "type": "mrkdwn", "text": "*Following*\n21" },
        { "type": "mrkdwn", "text": "*Hireable*\nNo" }
      ]
    },
    { "type": "divider" },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Blog*\n<https://driv.ly|driv.ly>" },
        { "type": "mrkdwn", "text": "*Twitter*\n<https://twitter.com/nateclev|@nateclev>" },
        { "type": "mrkdwn", "text": "*Gists*\n<https://gist.github.com/nathanclevenger|Gists>" },
        { "type": "mrkdwn", "text": "*Repos*\n<https://github.com/nathanclevenger?tab=repositories|Repositories>" },
        { "type": "mrkdwn", "text": "*Stars*\n<https://github.com/nathanclevenger?tab=stars|Starred>" }
      ]
    },
    { "type": "divider" },
    {
      "type": "actions",
      "block_id": "candidate_actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View GitHub Profile" },
          "url": "https://github.com/nathanclevenger",
          "action_id": "view_profile"
        },
        {
          "type": "static_select",
          "action_id": "rate_candidate",
          "placeholder": { "type": "plain_text", "text": "Rate ★" },
          "options": [
            { "text": { "type": "plain_text", "text": "★☆☆☆☆" }, "value": "1" },
            { "text": { "type": "plain_text", "text": "★★☆☆☆" }, "value": "2" },
            { "text": { "type": "plain_text", "text": "★★★☆☆" }, "value": "3" },
            { "text": { "type": "plain_text", "text": "★★★★☆" }, "value": "4" },
            { "text": { "type": "plain_text", "text": "★★★★★" }, "value": "5" }
          ]
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Reject" },
          "style": "danger",
          "action_id": "open_reject_modal",
          "value": "nathanclevenger"
        },
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "Book Meeting" },
          "style": "primary",
          "action_id": "book_meeting",
          "value": "nathanclevenger"
        }
      ]
    }
  ]
}
```

---

## 2) Reject Flow

### 2a) Open Confirmation Modal

**On** `action_id: "open_reject_modal"` → call `views.open` with:

```json
{
  "type": "modal",
  "callback_id": "reject_candidate_modal",
  "title": { "type": "plain_text", "text": "Confirm Rejection" },
  "close": { "type": "plain_text", "text": "Cancel" },
  "submit": { "type": "plain_text", "text": "Send Rejection Letter" },
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Are you sure you want to reject this candidate?*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Job position:* DevRel\n*Candidate:* Nathan Clevenger"
      },
      "accessory": {
        "type": "image",
        "image_url": "https://avatars.githubusercontent.com/u/4130910?v=4",
        "alt_text": "Nathan’s avatar"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "By hitting “Send Rejection Letter,” we’ll email the candidate a rejection notice and it cannot be undone."
      }
    }
  ]
}
```

### 2b) Post Rejection Confirmation in Thread

**On** modal submission → send email, then:

```json
{
  "channel": "#careers",
  "thread_ts": "original_ts",
  "text": ":envelope_with_arrow: Rejection sent to *Nathan Clevenger* at <t:{{now_ts}}:f>",
  "blocks": [
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": ":envelope_with_arrow: *Rejection sent to Nathan Clevenger* at <t:{{now_ts}}:f>"
        }
      ]
    }
  ]
}
```

---

## 3) Book Meeting Flow

### 3a) (No modal)

**On** `action_id: "book_meeting"` → send meeting invite email/calendar.

### 3b) Post Meeting Confirmation in Thread

```json
{
  "channel": "#careers",
  "thread_ts": "original_ts",
  "text": ":calendar: Meeting request sent to *Nathan Clevenger* at <t:{{now_ts}}:f>",
  "blocks": [
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": ":calendar: *Meeting request sent to Nathan Clevenger* at <t:{{now_ts}}:f>"
        }
      ]
    }
  ]
}
```

---

**Notes on implementation:**

- Replace `original_ts` with the parent message’s `ts`.
- Compute `now_ts = Math.floor(Date.now()/1000)` for the `<t:…:f>` timestamp.
- All calls are made against the `#careers` channel.
  This end‑to‑end sequence keeps your #careers channel tidy and moves all confirmations into the candidate’s thread.

---

## Emails Needed

We need to add two emails to the resend sequence.

1. A candidate rejection email.
2. A request meeting email.

### Rejection email

```bash
Subject: Update on your {job position} application to .Do
Body:
Hey Nathan,
Thanks again for applying and sharing your GitHub profile with us—we genuinely appreciate your interest.
After reviewing your experience and projects, we've decided to move forward with other candidates whose align a bit more closely with our current needs.
We'd love to stay connected for future opportunities, and we'll keep you in mind as we continue to grow.
Best,
Bryant
Co-Founder & CEO
```

### Book Meeting

```bash
Subject: Let’s chat about your application to .do!
Body:
Hey Nathan,
Thanks again for applying and for **.do** — we were really impressed by your profile.
I'd love to set up a quick conversation to discuss the DevRel role and learn more about you.
Feel free to grab a time that works best for you on the link below:
→ (Book a time to chat)[https://calendly.com/bryant-30/candidate]
Looking forward to speaking with you soon!
Best,
Bryant
Co-Founder & CEO
```
