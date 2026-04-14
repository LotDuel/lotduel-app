# LotDuel — Operations Manual
## Last updated: April 14, 2026

---

## Short Commands

### "Save thread" / "Save to GitHub"
1. Update memory files with decisions and work from current session
2. Commit code changes (if any) in one commit
3. Commit memory file updates in a separate commit
4. Push to main
5. Two-commit discipline: code changes and memory updates are always separate commits

### "Deploy"
1. Push code to GitHub
2. Call deploy webhook:
```
curl -s "https://api.lotduel.com/api/admin/run?token=<ADMIN_TOKEN>&job=deploy"
```
3. Wait 3 seconds
4. Verify with status check:
```
curl -s "https://api.lotduel.com/api/admin/run?token=<ADMIN_TOKEN>&job=status"
```
Note: Deploy restart returns exit code -15 (SIGTERM) because the service kills its own worker. This is expected. Always verify with status after.

### "Status"
```
curl -s "https://api.lotduel.com/api/admin/run?token=<ADMIN_TOKEN>&job=status"
```

### "Logs"
```
curl -s "https://api.lotduel.com/api/admin/run?token=<ADMIN_TOKEN>&job=logs"
```

### Custom VPS Command
```
curl -s "https://api.lotduel.com/api/admin/run?token=<ADMIN_TOKEN>&cmd=YOUR+COMMAND+HERE"
```

---

## Webhook Reference

| Job | What it does |
|-----|-------------|
| `deploy` | git pull → pip install → db migrate → systemctl restart |
| `restart` | systemctl restart lotduel |
| `status` | systemctl is-active + health check |
| `logs` | journalctl -u lotduel -n 40 |
| `disk` | df + free |
| `env` | Show .env with secrets masked |
| `nginx_reload` | Reload nginx config |

---

## Git Workflow

```bash
# Clone (use PAT from Claude Project file LOTDUEL-CREDENTIALS.md)
cd /home/claude
git clone https://<GITHUB_PAT>@github.com/LotDuel/lotduel-app.git
cd lotduel-app
git config user.email "lotduel.com@outlook.com"
git config user.name "LotDuel"

# Push
git add -A && git commit -m "message" && git push origin main
```

Frontend auto-deploys on Vercel when pushed to main.
Backend deploys via webhook after push.

---

## VPS Details

- **IP:** 72.62.164.161
- **OS:** Ubuntu 24.04
- **SSH:** Not accessible from Claude sandbox (port 22 blocked)
- **Access method:** Admin webhook only
- **Service user:** lotduel
- **App dir:** /opt/lotduel/lotduel-app
- **Python venv:** /opt/lotduel/lotduel-app/backend/venv
- **Env file:** /opt/lotduel/lotduel-app/backend/.env
- **Systemd:** lotduel.service (ProtectHome=false, NoNewPrivileges=false)
- **Nginx:** /etc/nginx/sites-available/api.lotduel.com
- **SSL:** Let's Encrypt, auto-renew via certbot
- **Sudoers:** lotduel user has NOPASSWD for systemctl restart/reload/is-active and journalctl

---

## API Keys & Tokens

| Key | Location | Purpose |
|-----|----------|---------|
| GitHub PAT | Claude Project file | Repo access (ghp_Z1bZ...) |
| MarketCheck API | VPS .env | Market valuation ($0.002/call) |
| Admin Token | VPS .env | Webhook auth |
| Vercel | Auto-deploy | No token needed (GitHub integration) |

---

## DNS (Namecheap)

| Type | Host | Value |
|------|------|-------|
| A | @ | 216.198.79.1 (Vercel) |
| A | api | 72.62.164.161 (VPS) |
| CNAME | www | cname.vercel-dns.com |

---

## Vote Allocation Framework

When Rob distributes 100 votes across options, higher votes = stronger preference. Use this to understand weighted priority on decisions.
