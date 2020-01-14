# Haystack

- [Getting Started](docs/getting-started.md)
- [Utility Box](docs/server-setup.md)
- [SQL Snippets](docs/sql-snippets.md)


## Development

#### Requirements
1. Docker / docker-compose
1. npm / node

#### First time steps 
1. `npm install`
1. `npm run build`
1. `cd frontend & npm install`
1. Add `.env` file (provided by Haystack team)
1. Start application (`make dev`)
1. Run Postgres migration (`docker exec -it haystack npm run db:migration:run`) 
1. Prep with data (`curl http://localhost:3000/api/git/prepdb` then `curl http://localhost:5000/api/git/refresh_all`)
1. `make logs` and wait for build data pull to finish  

#### Run Locally
1. Start application (`make dev`)
1. `make logs` to view logs

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`
