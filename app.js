const container = document.getElementsByClassName('container')[0]
const video = document.getElementById('video')

const init = () => {
    navigator.mediaDevices.getUserMedia({video:{}}).then(stream => {
        video.srcObject = stream
    })
}

Promise.all([
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
]).then(
    init(),
    err => {
        console.error(err)
    }
)

video.onplay = () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    container.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(
        async () => {
            const detectionsWithExpression = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detectionsWithExpression, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            const minProbability = 0.05
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minProbability)
        },
        1000
    )
}


