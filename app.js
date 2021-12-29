const container = document.getElementsByClassName('container')[0]
const video = document.getElementById('video')

const init = () => {
    navigator.mediaDevices.getUserMedia({video:{}}).then(stream => {
        video.srcObject = stream
    })
}
