const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const image = document.getElementById("image");
const captureBtn = document.getElementById("capture-btn");
const retakeBtn = document.getElementById("retake-btn");
const downloadBtn = document.getElementById("download-btn");
const filtersContainer = document.getElementById("filters-container");
const filters = document.getElementsByClassName("filter");

let stream;
let selectedFilter = "";

// Access the device camera and set the video source
async function initializeCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing the camera: ", err);
    }
}

// Capture photo from video stream
function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    // Show captured image and hide video
    video.style.display = "none";
    canvas.style.display = "block";
    image.style.display = "none";

    // Show retake, download, and filters buttons
    captureBtn.style.display = "none";
    retakeBtn.style.display = "inline-block";
    downloadBtn.style.display = "inline-block";
    filtersContainer.style.display = "block";

    // Reset selected filter
    selectedFilter = "";
    applyFilter();
}

// Retake photo
function retakePhoto() {
    // Clear the canvas
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    // Hide captured image, show video
    image.style.display = "none";
    video.style.display = "block";
    canvas.style.display = "none";

    // Show capture button, hide retake and download buttons
    captureBtn.style.display = "inline-block";
    retakeBtn.style.display = "none";
    downloadBtn.style.display = "none";
    filtersContainer.style.display = "none";
}

// Apply selected filter to the image
function applyFilter() {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    if (selectedFilter) {
        canvas.style.filter = selectedFilter;
    } else {
        canvas.style.filter = "none";
    }
}

// Download the filtered image
function downloadImage() {
    const downloadLink = document.createElement("a");
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.download = "filtered_photo.png";
    downloadLink.click();
}

// Event listeners for buttons
captureBtn.addEventListener("click", capturePhoto);
retakeBtn.addEventListener("click", retakePhoto);
downloadBtn.addEventListener("click", downloadImage);

// Apply selected filter when a filter is clicked
Array.from(filters).forEach(filter => {
    filter.addEventListener("click", function () {
        selectedFilter = filter.dataset.filter;
        applyFilter();
    });
});

// Initialize the camera on page load
initializeCamera();
