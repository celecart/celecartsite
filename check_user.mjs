// Use ES modules to import the compiled code
import { storage } from './dist/index.js';

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
        
        // Check if celebrity profile exists
        const celebrityProfile = await storage.getCelebrityByUserId(user.id);
        console.log('Celebrity profile:', JSON.stringify(celebrityProfile, null, 2));
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUser();