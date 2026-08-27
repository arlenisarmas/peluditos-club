import { v2 as cloudinary } from "cloudinary";

function configure() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Faltan las credenciales de Cloudinary en .env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Creá una cuenta gratis en https://cloudinary.com/users/register/free y copiá los 3 datos del dashboard."
    );
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

// f_auto/q_auto le piden a Cloudinary que negocie el mejor formato (WebP/AVIF
// según el navegador) y la mejor calidad automáticamente — se inserta como
// segmento de transformación justo después de "/upload/" en la URL de entrega.
function withAutoOptimization(secureUrl: string): string {
  return secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");
}

export async function uploadImage(buffer: Buffer, publicId: string) {
  const client = configure();
  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = client.uploader.upload_stream(
        { folder: "che-peludos/products", public_id: publicId, overwrite: true },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary no devolvió resultado."));
            return;
          }
          resolve(result);
        }
      );
      stream.end(buffer);
    });
    return { secureUrl: withAutoOptimization(result.secure_url), publicId: result.public_id };
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    throw new Error("No se pudo subir la imagen a Cloudinary. Probá de nuevo en unos minutos.");
  }
}

export async function deleteImage(publicId: string) {
  const client = configure();
  await client.uploader.destroy(publicId);
}

// Las URLs de Cloudinary tienen la forma
// https://res.cloudinary.com/<cloud>/image/upload/<transformación opcional>/v169.../<folder>/<public_id>.<ext>
// — de ahí sacamos el public_id (carpeta + nombre, sin transformación, sin
// versión y sin extensión) para poder borrar la imagen más adelante sin
// tener que guardarlo aparte. El segmento de transformación (p. ej.
// "f_auto,q_auto") no tiene guiones, así que no se confunde con una carpeta
// real del proyecto (todas usan guiones, como "che-peludos").
export function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:[a-z0-9_,]+\/)?(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
