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
else {
  print('Admin user already exists');
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
else {
  print('Application user already exists');
}

// Create application collections



print('MongoDB initialization completed');