export default async function handler(req, res) {
  if (req.method === 'GET') {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    };

    const dailyRes = await fetch(
      `${process.env.DAILY_REST_DOMAIN || 'https://api.daily.co/v1'}/`,
      options,
    );

    const { config, error } = await dailyRes.json();

    if (error) {
      return res.status(500).json({ error });
    }

    return res
      .status(200)
      .json({ isTranscriptionEnabled: !!config.enable_transcription });
  }

  return res.status(500);
}
