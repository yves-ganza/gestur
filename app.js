const wrapper = document.getElementById('wrapper')
const video = document.getElementById('video')
const textField = document.getElementById('details')

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
    wrapper.append(canvas)
    const displaySize = {width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(
        async () => {
            const detectionsWithExpression = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            textField.innerText = ''

            if(detectionsWithExpression){
                const {expression, confidence} = detectionsWithExpression[0].expressions.asSortedArray()[0]
                textField.innerText = `${expression}`
                const resizedDetections = faceapi.resizeResults(detectionsWithExpression, displaySize)
                const minProbability = 0.05
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            }
        },
        100
    )
}


