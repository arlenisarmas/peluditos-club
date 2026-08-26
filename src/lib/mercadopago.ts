import { MercadoPagoConfig } from "mercadopago";

function getAccessToken() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Falta MP_ACCESS_TOKEN en .env. Conseguí las credenciales de prueba en https://www.mercadopago.com.ar/developers/panel/app."
    );
  }
  return token;
}

export function getMercadoPagoClient() {
  return new MercadoPagoConfig({ accessToken: getAccessToken(), options: { timeout: 8000 } });
}
