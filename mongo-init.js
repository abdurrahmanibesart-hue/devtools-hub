db = db.getSiblingDB('devtools');

const existing = db.admindocs.countDocuments();
if (existing === 0) {
  db.admindocs.insertOne({
    email: 'admin@devtools.local',
    passwordHash: '$2b$10$AlOsfbLWv7ANeSg0La1Gp.r98LivVKf3OomArNtBC/rg35BmJEC66',
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
