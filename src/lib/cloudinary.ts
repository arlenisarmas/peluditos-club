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

export async function uploadImage(buffer: Buffer, publicId: string) {
  const client = configure();
  return new Promise<{ secureUrl: string; publicId: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      { folder: "peluditos-club/products", public_id: publicId, overwrite: true },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary no devolvió resultado."));
          return;
        }
        resolve({ secureUrl: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  const client = configure();
  await client.uploader.destroy(publicId);
}

// Las URLs de Cloudinary tienen la forma
// https://res.cloudinary.com/<cloud>/image/upload/v169.../<folder>/<public_id>.<ext>
// — de ahí sacamos el public_id (carpeta + nombre, sin versión ni extensión)
// para poder borrar la imagen más adelante sin tener que guardarlo aparte.
export function publicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
}
