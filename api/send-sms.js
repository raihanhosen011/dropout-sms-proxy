const https = require('https');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { number, message } = req.query;
  if (!number || !message) {
    return res.status(400).json({ error: 'number এবং message দিতে হবে' });
  }

  const API_KEY = 'HvRjIz7qzTfN69SbzPtmjQcXFzDVbv46SXt9OPqG';
  const SENDER_ID = '8809617626047';
  const encodedMsg = encodeURIComponent(message);
  const path = `/api/send-sms?api_key=${API_KEY}&type=text&number=${number}&senderid=${SENDER_ID}&message=${encodedMsg}`;

  return new Promise((resolve) => {
    const options = {
      hostname: 'sms.onecodesoft.com',
      path: path,
      method: 'GET',
    };

    const request = https.get(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(200).json({ success: true, data: parsed });
        } catch(e) {
          res.status(200).json({ success: true, raw: data });
        }
        resolve();
      });
    });

    request.on('error', (err) => {
      res.status(500).json({ success: false, error: err.message });
      resolve();
    });

    request.end();
  });
}
