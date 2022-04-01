export default async function handler(req, res) {
  const { nbf, expiryMinutes, ...rest } = req.body;

  if (req.method === 'POST') {
    console.log(`Creating room on domain ${process.env.DAILY_DOMAIN}`);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        properties: {
          enable_prejoin_ui: true,
          nbf: Math.floor(new Date(nbf).getTime() / 1000),
          exp:
            Math.floor(new Date(nbf).getTime() / 1000) +
            (expiryMinutes || 5) * 60, // expire in x minutes
          eject_at_room_exp: true,
          ...rest,
        },
      }),
    };

    const dailyRes = await fetch(
      `${process.env.DAILY_REST_DOMAIN || 'https://api.daily.co/v1'}/rooms`,
      options,
    );

    const { name, url, error, info } = await dailyRes.json();

    if (error) {
      return res.status(500).json({ error: info });
    }

    return res
      .status(200)
      .json({ name, url, domain: process.env.DAILY_DOMAIN });
  }

  return res.status(500);
}
