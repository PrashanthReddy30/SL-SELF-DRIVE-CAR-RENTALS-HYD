const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

// Read credentials from environment variables (fallback to placeholders for setup)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_ACCOUNT_SID";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_AUTH_TOKEN";
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

exports.onBookingStatusChange = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    // Only proceed if the status changed to 'Confirmed'
    if (newValue.status === 'Confirmed' && previousValue.status !== 'Confirmed') {
      const customerName = newValue.customerName;
      const assignedReg = newValue.carNumber || "N/A";
      const startDate = new Date(newValue.startDate).toLocaleDateString();
      const endDate = new Date(newValue.endDate).toLocaleDateString();
      
      const customerMsg = `Hello ${customerName}, your booking for (${assignedReg}) starting on ${startDate} is Confirmed!`;

      // 1. Send to Customer
      if (newValue.customerPhone) {
        let phone = newValue.customerPhone.replace(/\D/g, '');
        if (!phone.startsWith('91')) phone = '91' + phone;
        
        try {
          await client.messages.create({
            body: customerMsg,
            from: TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+${phone}`
          });
          console.log(`WhatsApp sent to customer: +${phone}`);
        } catch (error) {
          console.error(`Failed to send WhatsApp to customer +${phone}:`, error);
        }
      }

      // 2. Fetch car details to get owner info
      try {
        const carDoc = await admin.firestore().collection("cars").doc(newValue.carId).get();
        if (carDoc.exists) {
          const carData = carDoc.data();
          const carName = carData.name;
          
          let ownerPhone = '';
          let ownerName = '';
          
          if (carData.carNumbers) {
            const regObj = carData.carNumbers.find(n => (typeof n === 'string' ? n : n.number) === assignedReg);
            if (regObj && typeof regObj !== 'string' && regObj.ownerPhone) {
              ownerPhone = regObj.ownerPhone;
              ownerName = regObj.owner;
            }
          }

          if (ownerPhone) {
            const ownerMsg = `Hello ${ownerName}, your car ${carName} (${assignedReg}) has a confirmed booking from ${startDate} to ${endDate}.`;
            let oPhone = ownerPhone.replace(/\D/g, '');
            if (!oPhone.startsWith('91')) oPhone = '91' + oPhone;

            await client.messages.create({
              body: ownerMsg,
              from: TWILIO_WHATSAPP_NUMBER,
              to: `whatsapp:+${oPhone}`
            });
            console.log(`WhatsApp sent to owner: +${oPhone}`);
          }
        }
      } catch (error) {
        console.error("Failed to process owner WhatsApp message:", error);
      }
    }
    return null;
  });
