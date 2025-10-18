import { storage } from './storage';

export async function addTestCelebrityUser() {
  try {
    console.log('Adding test celebrity user abc@gmail.com...');
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail('abc@gmail.com');
    if (existingUser) {
      console.log('User abc@gmail.com already exists with ID:', existingUser.id);
      
      // Check if they already have celebrity role
      const userRoles = await storage.getUserRoles(existingUser.id);
      const roles = await storage.getRoles();
      const celebrityRole = roles.find(role => role.name === 'celebrity');
      
      if (celebrityRole) {
        const hasCelebrityRole = userRoles.some(ur => ur.roleId === celebrityRole.id);
        if (!hasCelebrityRole) {
          await storage.assignRoleToUser(existingUser.id, celebrityRole.id);
          console.log('Assigned celebrity role to existing user');
        } else {
          console.log('User already has celebrity role');
        }
      }
      return existingUser;
    }
    
    // Create new user
    const newUser = await storage.createUser({
      username: 'abc_celebrity',
      password: '123456789',
      email: 'abc@gmail.com',
      displayName: 'ABC Celebrity',
      profilePicture: '',
      firstName: 'ABC',
      lastName: 'Celebrity',
      phone: '+1234567890',
      accountStatus: 'Active',
      source: 'local'
    });
    
    console.log('Created user:', newUser);
    
    // Find or create celebrity role
    let celebrityRole = (await storage.getRoles()).find(role => role.name === 'celebrity');
    if (!celebrityRole) {
      celebrityRole = await storage.createRole({
        name: 'celebrity',
        description: 'Celebrity user with special privileges'
      });
      console.log('Created celebrity role:', celebrityRole);
    }
    
    // Assign celebrity role to user
    await storage.assignRoleToUser(newUser.id, celebrityRole.id);
    console.log('Assigned celebrity role to user');
    
    // Update user with celebrity-specific information
    await storage.updateUser(newUser.id, {
      profession: 'Actor & Model',
      description: 'Award-winning actor and fashion model with over 10 years of experience in the entertainment industry.',
      category: 'Acting',
      instagram: 'https://instagram.com/abc_celebrity',
      twitter: 'https://twitter.com/abc_celebrity',
      youtube: 'https://youtube.com/@abc_celebrity',
      tiktok: 'https://tiktok.com/@abc_celebrity'
    });
    
    console.log('Updated user with celebrity details');
    console.log('Test celebrity user abc@gmail.com created successfully!');
    
    return newUser;
    
  } catch (error) {
    console.error('Error adding test celebrity user:', error);
    throw error;
  }
}