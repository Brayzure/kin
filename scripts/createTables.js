const Postgres = require("pg");
const client = new Postgres.Client();

init(client);

async function init(client) {
    await client.connect();
    console.log("Connected to the database!");

    await client.query(createLinkTable);
    console.log("Created domain table");
    await client.query(createUserTable);
    console.log("Created user table");
    await client.query(createMemberTable);
    console.log("Created member table");
    console.log("All done!");
    process.exit();
}

const createLinkTable = `
CREATE TABLE domains (
    domain text,
    guild_id text,
    instances integer,
    deleted_instances integer,
    CONSTRAINT domain_key UNIQUE (domain, guild_id)
);
`;

const createUserTable = `
CREATE TABLE users (
    id text,
    ban_instances integer
);
`;

const createMemberTable = `
CREATE TABLE members (
    id text,
    guild_id text,
    message_count integer,
    CONSTRAINT member_key UNIQUE (id, guild_id)
);
`;
