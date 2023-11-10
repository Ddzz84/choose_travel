create table flights (
    id INT PRIMARY KEY,
    desc_txt text,
    username varchar (80),
    country varchar (100) not null,
    city  varchar (100) not null,
    flight JSON,
    rating smallint,
	created_on INT,
    updated_on INT
)
