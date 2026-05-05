#!/bin/bash
ssh -i ~/.ssh/id_ed25519_bbedits -o StrictHostKeyChecking=no root@88.222.245.226 << 'ENDSSH'
echo "=== Checking user role in production MongoDB ==="
mongosh --quiet lms --eval "
  const user = db.users.findOne({ email: 'satyasaiganeshmani343@gmail.com' });
  if (!user) {
    print('NOT FOUND');
  } else {
    print('Found: ' + user.email + ' | role: ' + user.role);
  }
"
ENDSSH
