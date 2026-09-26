exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { phone, msg } = JSON.parse(event.body);

    if (!phone || !msg) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing phone or msg" }) };
    }

    // Using environment variables configured in Netlify dashboard
    const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.VITE_TWILIO_WHATSAPP_NUMBER;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const formData = new URLSearchParams();
    formData.append('To', `whatsapp:+${phone}`);
    formData.append('From', twilioNumber);
    formData.append('Body', msg);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Twilio API Error:", result);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sid: result.sid })
    };
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" })
    };
  }
};
