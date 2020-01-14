# SQL Snippets

## TypeORM

More info on typeorm:

https://github.com/typeorm/typeorm/tree/master/docs
https://codeburst.io/typeorm-by-example-part-1-6d6da04f9f23

## Migrations

Navigate into container with `make bash`

Create migration: `npm run db:migration:create -- -n UserAddedCategories`
Run migration: `npm run db:migration:run`
Run revert: `npm run db:migration:revert`

## PG DUMP

Get pg_dump then upload to digital ocean cluster.

```
> docker exec -it postgres bash
> psql -d haystackdb -U haystackadmin
// it should open psql promp after password
> pg_dump -U haystackadmin -W -F t haystackdb > dump
// will create dump in root folder in docker
> /q
> PGPASSWORD=<INSERT_PASSWORD> pg_restore -U haystackadmin -h haystack-test-db-do-user-1694345-0.db.ondigitalocean.com -p 25060 -d haystackdb dump

```

### Companies Without Organization

We have to create the organization manually for companies which do not have organization

```
INSERT INTO organization(
key,
url,
avatar_url,
user_id,
source_meta
)
VALUES(
    'demiculus',
    'github.com/demiculus',
    'someurl.com',
    <user_id>,
    '{ "phones":[ {"type": "mobile", "phone": "001001"} , {"type": "fix", "phone": "002002"} ] }'
)
```

```
INSERT INTO repository(
name,
key,
html_url,
ssh_url,
clone_url,
organization_id,
source_meta
)
VALUES(
    'katan',
    'demiculus/katan',
    'someurl.com',
    'someurl.com',
    'someurl.com',
    7,
    '{ "phones":[ {"type": "mobile", "phone": "001001"} , {"type": "fix", "phone": "002002"} ] }'
)
```

If there is repositories already use the following template

```
UPDATE repository
SET organization_id = 4
WHERE id = 1;
```

---

1) https://github.com/apps/haystack-analytics give access to a repo or all repo (we're testing in prod)
2) check database githooks table. Check the last object and get the installation id
3) create a user to manual or update existing users installation id `UPDATE "user" SET installation_id=xxx WHERE id=yy`
4a1) if org, call the org url `/api/git/org?username=julianmcolina&organizationKey=usehaystack`
4a2) call `/api/git/org/repos?username=julianmcolina`
4b1) if not org, create org manually https://github.com/usehaystack/haystack/blob/master/docs/sql-snippets.md#companies-without-organization
4b2) create a repository for that person
---