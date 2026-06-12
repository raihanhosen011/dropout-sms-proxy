export default async function handler(req, res) {
  // Allow CORS from any origin (your HTML file needs this)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { number, message } = req.query;

  if (!number || !message) {
    return res.status(400).json({ error: 'number এবং message দিতে হবে' });
  }

  const API_KEY = 'HvRjIz7qzTfN69SbzPtmjQcXFzDVbv46SXt9OPqG';
  const SENDER_ID = '8809617626047';

  const smsUrl = `https://sms.onecodesoft.com/api/send-sms?api_key=${API_KEY}&type=text&number=${number}&senderid=${SENDER_ID}&message=${encodeURIComponent(message)}`;

  try {
    const response = await fetch(smsUrl);
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
