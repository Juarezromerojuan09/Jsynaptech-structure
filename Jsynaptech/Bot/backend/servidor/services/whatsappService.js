import axios from 'axios';

const META_API_VERSION = process.env.META_API_VERSION || 'v20.0';

/**
 * Envía un mensaje de texto a través de la API de WhatsApp.
 * @param {string} to - El número de teléfono del destinatario (wa_id).
 * @param {string} body - El contenido del mensaje de texto.
 * @param {string} accessToken - El token de acceso de la app de Meta del tenant.
 * @param {string} phoneNumberId - El ID del número de teléfono de WhatsApp del tenant.
 * @returns {Promise<object|boolean>} - La respuesta de la API o false si hay un error.
 */
export const sendWhatsAppMessage = async (to, body, accessToken, phoneNumberId) => {
  if (!accessToken || !phoneNumberId) {
    console.error('Error: Faltan accessToken o phoneNumberId para enviar el mensaje.');
    return false;
  }

  try {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    };

    const { data } = await axios.post(
      `https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  } catch (err) {
    const msg = err.response?.data || err.message;
    console.error('Error enviando mensaje por WhatsApp (Meta):', JSON.stringify(msg));
    return false;
  }
};