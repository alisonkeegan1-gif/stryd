import { RekognitionClient, CreateCollectionCommand, SearchFacesByImageCommand } from '@aws-sdk/client-rekognition'

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
    const selfie = formData.get('selfie')
    const raceId = formData.get('raceId')

    const selfieBuffer = Buffer.from(await selfie.arrayBuffer())
    const collectionId = `race-${raceId}`

    try {
      await rekognition.send(new CreateCollectionCommand({ CollectionId: collectionId }))
    } catch (e) {
      // Already exists
    }

    const searchResult = await rekognition.send(new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: { Bytes: selfieBuffer },
      MaxFaces: 10,
      FaceMatchThreshold: 80,
    }))

    const matches = searchResult.FaceMatches || []

    const results = matches
      .map(match => {
        const externalImageId = match.Face.ExternalImageId
        const photoUrl = Buffer.from(externalImageId, 'base64').toString('utf8')
        return {
          faceId: match.Face.FaceId,
          confidence: Math.round(match.Similarity),
          photoUrl,
        }
      })
      .filter(match => match.photoUrl.startsWith('https'))

    return Response.json({ success: true, matches: results })

  } catch (error) {
    console.error('Search error:', error)
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
