insert into timeslots(
    user_id,
    ts_id,
    item
)values(
    $1,
    $2,
    $3
)
returning *;