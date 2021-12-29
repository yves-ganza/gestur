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




