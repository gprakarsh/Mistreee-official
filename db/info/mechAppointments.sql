select t.id,t.item,tk.time,u.name,u.address,u.number 
from timeslots t
join timeslot_key tk on t.ts_id=tk.id
join users u on u.id=t.user_id
where mech_id = $1
order by t.ts_id asc;