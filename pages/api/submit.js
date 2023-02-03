import redis from "../../db/redis";

export default async function Submit(req, res) {
  const data = req.body;
  if (data[0] === "" || data[1] === "") {
    res.status(407);
    res.end();
    return;
  }

  await redis.set(data[0], data[1]);

  if (data[2] === true) {
    await redis.lpush("projects", data[0]);
  } else {
    await redis.lpush("articles", data[0]);
  }

  res.status(200);
  res.end();
}
