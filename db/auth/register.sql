insert into users(
name,address,isadmin,ismechanic,number,username,password,email,url
)values(
$1,$2,$3,$4,$5,$6,$7,$8,$9
)
returning *;