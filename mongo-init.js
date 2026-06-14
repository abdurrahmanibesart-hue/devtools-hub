db = db.getSiblingDB('devtools');

if (db.admins.countDocuments() === 0) {
  // bcrypt('Admin123!')
  db.admins.insertOne({
    email: 'admin@devtools.local',
    passwordHash: '$2b$10$AlOsfbLWv7ANeSg0La1Gp.r98LivVKf3OomArNtBC/rg35BmJEC66',
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
