select name,number,address,item,mech_id from 
timeslots t
join users u on t.user_id = u.id
where user_id = $1 and mech_id is not null;