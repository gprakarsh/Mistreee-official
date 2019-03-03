select t.id,t.item,tk.time,u.name,u.address,u.number 
from timeslots t
join timeslot_key tk on t.ts_id=tk.id
join users u on u.id=t.user_id
where item = $1 and mech_id is null;