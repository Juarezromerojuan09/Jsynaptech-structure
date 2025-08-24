import axios from 'axios';
import WhatsAppIntegration from '../models/WhatsAppIntegration.js';

const { META_APP_ID, META_APP_SECRET, META_REDIRECT_URI } = process.env;

/**
 * Inicia el flujo de OAuth para conectar una cuenta de WhatsApp.
 * Redirige al usuario a la página de login de Facebook.
 */
export const initiateWhatsAppAuth = (req, res) => {
  const { _id: tenantId } = req.tenant;

  // El 'state' es crucial para la seguridad y para identificar al tenant en el callback.
  const state = JSON.stringify({ tenantId });
  const encodedState = Buffer.from(state).toString('base64');

  const scope = 'whatsapp_business_management,whatsapp_business_messaging';

  const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${META_REDIRECT_URI}&state=${encodedState}&scope=${scope}&response_type=code`;

  res.redirect(authUrl);
};

/**
 * Maneja el callback de la autenticación de Meta/Facebook.
 * Intercambia el código de autorización por un token de acceso.
 */
export const handleWhatsAppCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send('Error: Faltan el código de autorización o el estado.');
  }

  let decodedState;
  try {
    decodedState = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
  } catch (error) {
    return res.status(400).send('Error: Estado (state) inválido.');
  }

  const { tenantId } = decodedState;

  try {
    // 1. Intercambiar código por token de acceso de corta duración
    const tokenResponse = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: {
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: META_REDIRECT_URI,
        code,
      },
    });

    const shortLivedToken = tokenResponse.data.access_token;

    // 2. (Opcional pero recomendado) Intercambiar por token de larga duración
    const longLivedTokenResponse = await axios.get('https://graph.facebook.com/oauth/access_token', {
        params: {
            grant_type: 'fb_exchange_token',
            client_id: META_APP_ID,
            client_secret: META_APP_SECRET,
            fb_exchange_token: shortLivedToken
        }
    });

    const accessToken = longLivedTokenResponse.data.access_token;

    // En un flujo real, aquí se obtendrían los WABAs y números de teléfono disponibles
    // y se le presentaría al usuario para que elija. Por ahora, guardamos el token.
    // La obtención del phoneNumberId y wabaId se haría en un paso posterior.

    await WhatsAppIntegration.findOneAndUpdate(
      { tenantId },
      { accessToken, status: 'pending_selection' }, // Estado intermedio
      { new: true, upsert: true }
    );

    // Redirigir al frontend a una página de éxito o de selección
    res.send('¡Conexión exitosa! Por favor, vuelve a la aplicación para completar la configuración.');

  } catch (error) {
    console.error('Error en el callback de WhatsApp:', error.response?.data || error.message);
    res.status(500).send('Ocurrió un error al procesar la autenticación de WhatsApp.');
  }
};
