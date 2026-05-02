import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmergencyWhatsApp = async ({ to, message }) => {
  try {
    let formattedTo = to.trim();
    if (formattedTo.length === 10 && /^\d+$/.test(formattedTo)) {
      formattedTo = `+91${formattedTo}`;
    } else if (!formattedTo.startsWith("+")) {
      formattedTo = `+${formattedTo}`;
    }

    const fromWhatsApp = `whatsapp:${process.env.TWILIO_WHATSAPP_PHONE || process.env.TWILIO_PHONE}`;
    const toWhatsApp = `whatsapp:${formattedTo}`;

    console.log(`[WhatsApp Tool] Attempting to send message.`);
    console.log(` - From: ${fromWhatsApp}`);
    console.log(` - To: ${toWhatsApp}`);

    const res = await client.messages.create({
      body: message,
      from: fromWhatsApp,
      to: toWhatsApp,
    });

    console.log("[WhatsApp] Sent:", res.sid);

    return {
      success: true,
      sid: res.sid,
    };
  } catch (err) {
    console.error("[WhatsApp] Failed:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
export default sendEmergencyWhatsApp;
