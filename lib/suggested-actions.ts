interface SuggestedAction {
  title: string
  label: string
  action: string
}

export const suggestedActions = [
  {
    title: 'Show all collections',
    label: 'I can access',
    action: 'What collections do I have access to?',
  },
  {
    title: 'Show all users',
    label: 'with admin access',
    action: 'Show me all users with admin role',
  },
  {
    title: 'List collections',
    label: 'I can access',
    action: 'What collections do I have access to?',
  },
  {
    title: 'Find user',
    label: 'by email',
    action: 'Find user with email containing driv.ly',
  },
  {
    title: 'Search deals',
    label: 'by customer name',
    action: 'Find deals for customer Jane',
  },
  {
    title: 'Find user',
    label: 'by tenant domain',
    action: 'Find users from cloud-motors.com domain',
  },
] satisfies SuggestedAction[]
