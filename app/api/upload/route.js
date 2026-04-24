import { RekognitionClient, CreateCollectionCommand, IndexFacesCommand } from '@aws-sdk/client-rekognition'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function POST(request) {
  try {
    const formData = await request.formData()
    const photo = formData.get('photo')
    const raceId = formData.get('raceId')

    const photoBuffer = Buffer.from(await photo.arrayBuffer())
    const base64Photo = photoBuffer.toString('base64')
    const dataUri = `data:${photo.type};base64,${base64Photo}`

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(dataUri, {
      folder: `stryd/race-${raceId}`,
    })

    const photoUrl = cloudinaryResult.secure_url

    // Use a short token as external ID, store URL mapping
    const externalId = cloudinaryResult.public_id.split('/').pop()

    // Store the mapping of externalId -> photoUrl in Cloudinary metadata
    await cloudinary.uploader.explicit(cloudinaryResult.public_id, {
      type: 'upload',
      context: `photoUrl=${photoUrl}`
    })

    const collectionId = `race-${raceId}`

    try {
      await rekognition.send(new CreateCollectionCommand({ CollectionId: collectionId }))
    } catch (e) {
      // Already exists
    }

    // Store the full Cloudinary URL as externalImageId
    // AWS allows up to 255 chars, URLs are usually under that
    const safeExternalId = Buffer.from(photoUrl).toString('base64').substring(0, 255)

    await rekognition.send(new IndexFacesCommand({
      CollectionId: collectionId,
      Image: { Bytes: photoBuffer },
      ExternalImageId: safeExternalId,
      DetectionAttributes: [],
    }))

    return Response.json({ success: true, photoUrl })

  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
