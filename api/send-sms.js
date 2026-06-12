const https = require('https');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { number, message } = req.query;

  if (!number || !message) {
    res.status(400).json({ error: 'number এবং message দিতে হবে' });
    return;
  }

  const API_KEY = 'HvRjIz7qzTfN69SbzPtmjQcXFzDVbv46SXt9OPqG';
  const SENDER_ID = '8809617626047';
  const path = `/api/send-sms?api_key=${API_KEY}&type=text&number=${number}&senderid=${SENDER_ID}&message=${encodeURIComponent(message)}`;

  https.get({ hostname: 'sms.onecodesoft.com', path: path }, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.status(200).json({ success: true, data: parsed });
      } catch (e) {
        res.status(200).json({ success: true, raw: data });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ success: false, error: err.message });
  });
};
