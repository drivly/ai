import { AI } from 'workflows.do';

export default AI({
  onUserSignup: async (event, { ai, api, db }) => {
    const { name, email, company } = event;

    const enrichedContact = await api.apollo.search({ name, email, company });
    
    const { url } = await db.users.create({ 
      name, 
      email, 
      company,
      enrichedContact
    });
    
    return {
      success: true,
      url,
      message: `User ${name} has been successfully signed up`
    };
  }
});
