update users
set name = $2,
address = $3,
number = $4,
username = $5,
email = $6,
url=$7
where id = $1;
