#!/bin/bash
# Remove all changes we added to sshd_config
ssh -i /c/Users/Administrator/.ssh/id_ed25519_bbedits -o StrictHostKeyChecking=no root@88.222.245.226 '
sed -i "/^ClientAliveInterval/d" /etc/ssh/sshd_config
sed -i "/^ClientAliveCountMax/d" /etc/ssh/sshd_config
sed -i "/^Compression yes/d" /etc/ssh/sshd_config
sed -i "/^IPQoS/d" /etc/ssh/sshd_config
systemctl restart sshd
echo "=== ALL CHANGES REMOVED, sshd restarted ==="
grep -n "ClientAlive\|Compression\|IPQoS" /etc/ssh/sshd_config
'
