# Utility Box

This thing is used for running scripts and other fun stuff

- [Deployment](#deployment)
- [Server Setup](#server-setup)
- [Application Setup](#application-setup)

## Deployment

1) `git pull`
2a) If change is minimal: `make stop`, `docker rm haystack`
2b) If change is big (like node_module or Dockerfile) or frontend: `make clean`
3) `make production`

## Server Setup

### Application Setup

#### First Time
- Create droplet from Ubuntu Docker
- `git clone` haystack
- `apt install npm`
- `npm install`
- `cd frontend`
- `npm install`
- Install `make`
  - `sudo apt-get update`
  - `sudo apt-get install build-essential`
- Install `postgres` cli
    - `sudo apt-get install postgresql postgresql-contrib`
- `npm run build`
- `make production`

### Nginx Setup

1) Download nginx
2) `rm /etc/nginx/sites-available/default`
3) `vi /etc/nginx/sites-available/default`

```
server {
    listen 80;
    server_name usehaystack.io;
    location / {
        proxy_pass https://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
     }
}
```

4) Syntax check: `nginx -t`
5) Restart nginx: /etc/init.d/nginx reload

#### Create SSL Certificates

Make sure nginx setup is done.

Install [Certbot](https://certbot.eff.org/lets-encrypt/ubuntuxenial-nginx) to server. While doing this step make sure Cloudflare proxy is not on.

1) ssh as root
2) Run the following. Say yes to everything

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
```

3) Run

`sudo certbot --nginx`

  - Enter your **email address** (company email is better).
  -  **A**gree to Terms.
  - **N**o to send marketting emails.
  - **Enter** blank.
  - **Redirect 2**

4) Enable auto cert renew:

`sudo certbot renew --dry-run`

5) Copy Certs to local

  - `/etc/letsencrypt/live/usehaystack.io/fullchain.pem`
  - `/etc/letsencrypt/live/usehaystack.io/privkey.pem`

also make sure `server.ts` looks at the correct path for https. It should be the same as above

6) Setup Cloudflare. Assuming you have added the domain to Cloudflare to the following settings
- SSL -> Full
- DNS -> Orange Clouded

#### Enable Firewall
```
// Assuming ufw is downloaded

ufw disable
ufw reset
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```


#### Usage
- SSH w/ port forwarding
    - `make utility`
        - `ssh -L 5000:167.99.162.216:5000 root@167.99.162.216`
- Setup Tmux
    - Create a session
        - `tmux`
    - Attach to an existing session
        - `tmux attach -t <SESSION_NAME>`
- Create a new 'pane' (so you can have multiple terminal windows open in the session)
    - `control-b o`
- Windows
    - Start up haystack
        - `make dev`
    - Postgres CLI
        - `psql -h haystack-test-db-do-user-1694345-0.db.ondigitalocean.com -p 25060 -U haystackadmin haystackdb`
    - Logs
        - `make logs`

#### SSH Forwarding

To avoid github password being asked all the time:

We need to enable SSH Forwarding to use github without leaking our private keys.

1) Add the following line in your local machine.
```
> vi ~/.ssh/config
Host <ip>
  ForwardAgent yes
```

2a) For OS X: `ssh-add -K`
2b) For Linux: `ssh-add -k`
3) `ssh -T git@github.com`
3a) if error run `eval $(tmux show-env -s |grep '^SSH_')` 
3b) Run step 3 again
3c) if still doesn't work, start from step 2 in new terminal page

Testing if it worked

1) `make utility`
2) `ssh -T git@github.com`

You need to see `Hi username! You've successfully authenticated, but GitHub does not provide
shell access.`

If it stilld doesn't work edit .git file in the remote repository https://developer.github.com/v3/guides/using-ssh-agent-forwarding/#you-must-be-using-an-ssh-url-to-check-out-code

#### Notes
- Install `tmux` for terminal multiplexing
    - sudo apt-get install tmux