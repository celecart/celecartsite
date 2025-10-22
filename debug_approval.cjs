// Debug script to check user approval and celebrity profile issues
const express = require('express');
const app = express();

// Simple test to check database connection and user status
app.get('/debug/users', async (req, res) => {
  try {
    // This will use the same storage instance as the main app
    const response = await fetch('http://localhost:5000/api/users', {
      credentials: 'include',
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    });
    
    if (response.ok) {
      const users = await response.json();
      
      // Filter users with celebrity role
      const celebrityUsers = users.filter(user => 
        user.roles && user.roles.some(role => 
          role.name.toLowerCase() === 'celebrity'
        )
      );
      
      console.log('Users with celebrity role:', celebrityUsers.length);
      celebrityUsers.forEach(user => {
        console.log(`- ${user.displayName || user.username} (ID: ${user.id})`);
      });
      
      res.json({
        totalUsers: users.length,
        celebrityUsers: celebrityUsers.length,
        celebrityUserDetails: celebrityUsers.map(u => ({
          id: u.id,
          name: u.displayName || u.username,
          email: u.email,
          accountStatus: u.accountStatus,
          roles: u.roles?.map(r => r.name)
        }))
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/debug/celebrities', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5000/api/celebrities');
    
    if (response.ok) {
      const celebrities = await response.json();
      
      console.log('Celebrity profiles found:', celebrities.length);
      celebrities.forEach(celeb => {
        console.log(`- ${celeb.name} (ID: ${celeb.id}, UserID: ${celeb.userId || 'N/A'})`);
      });
      
      res.json({
        totalCelebrities: celebrities.length,
        celebrityDetails: celebrities.map(c => ({
          id: c.id,
          name: c.name,
          userId: c.userId,
          profession: c.profession,
          isActive: c.isActive
        }))
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch celebrities' });
    }
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Debug server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /debug/users - Check users with celebrity roles');
  console.log('- GET /debug/celebrities - Check celebrity profiles');
});