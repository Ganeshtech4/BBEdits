#!/bin/bash
ssh -i ~/.ssh/id_ed25519_bbedits -o StrictHostKeyChecking=no root@88.222.245.226 << 'ENDSSH'
echo "=== Updating role to admin ==="
mongosh --quiet lms --eval "
  const result = db.users.findOneAndUpdate(
    { email: 'satyasaiganeshmani343@gmail.com' },
    { \$set: { role: 'admin' } },
    { returnDocument: 'after' }
  );
  if (!result) {
    print('ERROR: User not found');
  } else {
    print('SUCCESS: ' + result.email + ' | role: ' + result.role);
  }
"
ENDSSH
