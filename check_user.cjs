// Use the compiled JavaScript version
const { storage } = require('./dist/server/storage.js');

async function checkUser() {
  try {
    console.log('Checking user abc@gmail.com...');
    
    const user = await storage.getUserByEmail('abc@gmail.com');
    console.log('User:', JSON.stringify(user, null, 2));
    
    if (user) {
      const roles = await storage.getUserRoles(user.id);
      console.log('User roles:', JSON.stringify(roles, null, 2));
      
      const allRoles = await storage.getRoles();
      console.log('All roles:', JSON.stringify(allRoles, null, 2));
      
      // Check if user has celebrity role
      const celebrityRole = allRoles.find(role => role.name === 'celebrity');
      if (celebrityRole) {
        const hasCelebrityRole = roles.some(ur => ur.roleId === celebrityRole.id);
        console.log('Has celebrity role:', hasCelebrityRole);
        console.log('Celebrity role ID:', celebrityRole.id);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();