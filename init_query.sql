create table flights (
    id serial PRIMARY KEY,
    desc_txt text,
    username varchar (80),
    country varchar (100) not null,
    city  varchar (100) not null,
    flight json,
    rating smallint,
	created_on TIMESTAMP NOT NULL,
    updated_on TIMESTAMP
)
