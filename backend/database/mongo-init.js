print('Start MongoDB initialization');

// Create admin user if it doesn't exist
db = db.getSiblingDB('admin');
const adminUser = db.getUser('admin');
if (!adminUser) {
  db.createUser({
    user: 'admin',
    pwd: 'admin',
    roles: [{ role: 'root', db: 'admin' }]
  });
  print('Admin user created');
}

// Switch to and set up the application database
db = db.getSiblingDB('pfeDB');

// Create a dedicated user for this database
const appUser = db.getUser('pfeUser');
if (!appUser) {
  db.createUser({
    user: 'pfeUser',
    pwd: 'pfePassword',
    roles: [{ role: 'readWrite', db: 'pfeDB' }]
  });
  print('Application user created');
}

// Create application collections
if (!db.getCollectionNames().includes('users')) {
  db.createCollection('users');
  print('Created users collection');
  
  // Insert some sample users for testing
  db.users.insertMany([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date()
    },
    {
      name: 'Test User',
      email: 'user@example.com', 
      role: 'user',
      createdAt: new Date()
    }
  ]);
  print('Added sample users');
}


print('MongoDB initialization completed');