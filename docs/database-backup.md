# Database Backup — Dump & Download

How to back up the production `real_estate` PostgreSQL database on the EC2 server and download the dump to a local machine.

## Server details

| | |
|---|---|
| EC2 public IP | `54.234.25.124` |
| SSH user | `ec2-user` |
| App directory | `/home/ec2-user/real-estate-be` |
| Database | `real_estate` on `localhost` (PostgreSQL 15) |
| DB user | `postgres` (password prompted) |

## 1. Create the dump (on the EC2 server)

Custom format (`-Fc`) — compressed, and restorable selectively with `pg_restore`:

```bash
pg_dump -h localhost -U postgres -d real_estate -Fc -f ~/real_estate_$(date +%F).dump
```

Verify it was created and is readable:

```bash
ls -lh ~/real_estate_*.dump
pg_restore -l ~/real_estate_$(date +%F).dump | head -20
```

## 2. Download to local machine (Windows)

SSH key access is already set up: the private key lives at
`C:\Users\saqib\.ssh\ec2_realestate`, and its public key is in the server's
`~/.ssh/authorized_keys`.

From local PowerShell / CMD:

```powershell
scp -i C:\Users\saqib\.ssh\ec2_realestate ec2-user@54.234.25.124:/home/ec2-user/real_estate_2026-09-04.dump "E:\Real-estate project\real_estate_2026-09-04.dump"
```

Adjust the date in the filename to match the dump you created.

> **Windows quoting gotcha:** don't end the quoted destination with a
> backslash (`"E:\Real-estate project\"`) — the `\"` escapes the quote and
> scp fails with *"No such file or directory"*. Either drop the trailing
> backslash or spell out the full destination filename as above.

### Alternative: FileZilla

EC2 accepts key authentication only (no passwords), so Quickconnect won't work.
Use **File → Site Manager → New site**:

- Protocol: **SFTP**
- Host: `54.234.25.124`, Port: `22`
- Logon Type: **Key file**
- User: `ec2-user`
- Key file: `C:\Users\saqib\.ssh\ec2_realestate` (let FileZilla convert to `.ppk` if it asks)

The remote pane opens in `/home/ec2-user` where the dump files live.

### If key access is ever lost

Generate a new keypair locally and authorize it via an EC2 Instance Connect
(browser) session:

```powershell
ssh-keygen -t ed25519 -f C:\Users\saqib\.ssh\ec2_realestate -C "saqib-ec2-access"
type C:\Users\saqib\.ssh\ec2_realestate.pub
```

Then on the server (browser terminal), append the printed public key:

```bash
echo '<public key line>' >> ~/.ssh/authorized_keys
```

## 3. Restore (when needed)

Into a fresh local database:

```bash
createdb -h localhost -U postgres real_estate
pg_restore -h localhost -U postgres -d real_estate --no-owner --no-privileges real_estate_2026-09-04.dump
```

To restore only specific tables, list contents with `pg_restore -l` and use
`-t <table>`.

## Notes

- `pg_dump` client and server minor versions may differ (e.g. 15.13 vs 15.14);
  only the major version matters.
- `pg_dump` prints nothing on success — a silent exit means the dump worked.
- Take a dump before any deploy that resets the repo (`git reset --hard`) or
  runs migrations. The dump is a safety net; email-only modules (e.g.
  rent-requests) need no migration.
- To skip the password prompt in scripts, create `~/.pgpass` on the server
  with `localhost:5432:real_estate:postgres:<password>` and `chmod 600 ~/.pgpass`.
