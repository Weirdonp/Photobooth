document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('video');
  const captureBtn = document.getElementById('captureBtn');
  const photoStrip = document.getElementById('photoStrip');
  const photoCount = document.getElementById('photoCount');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');
  const previewBtn = document.getElementById('previewBtn');
  const layoutOptions = document.querySelectorAll('.layout-option');
  const filterOptions = document.querySelectorAll('.filter-option');

  let photosRemaining = 4;
  let currentFilter = 'normal';
  let capturedPhotos = [];

  // Initialize camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.error("Camera error: ", error);
        alert("Unable to access camera. Please grant permission.");
      });
  }

  // Capture photo
  captureBtn.addEventListener('click', function () {
    if (photosRemaining <= 0) {
      alert("You've reached the maximum number of photos.");
      return;
    }

    // Countdown before capturing
    let countdown = 3;
    captureBtn.disabled = true;
    captureBtn.innerHTML = countdown;

    const countdownInterval = setInterval(() => {
      countdown--;
      captureBtn.innerHTML = countdown;

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        captureBtn.innerHTML = '<i class="ri-camera-line"></i>';
        captureBtn.disabled = false;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.className = 'strip-photo';

        if (currentFilter === 'vintage') img.classList.add('vintage-filter');
        if (currentFilter === 'bw') img.classList.add('bw-filter');

        capturedPhotos.push(img.src);
        photoStrip.appendChild(img);
        photosRemaining--;
        photoCount.textContent = photosRemaining;
      }
    }, 1000);
  });

  // Reset button functionality
  resetBtn.addEventListener('click', function () {
    photoStrip.innerHTML = '';
    photosRemaining = 4;
    photoCount.textContent = photosRemaining;
    capturedPhotos = [];
  });

  // Download button functionality
  downloadBtn.addEventListener('click', function () {
    if (capturedPhotos.length === 0) {
      alert("No photos to download.");
      return;
    }

    const link = document.createElement('a');
    link.download = 'photo_booth.png';
    link.href = capturedPhotos[capturedPhotos.length - 1]; // Last captured image
    link.click();
  });

  // Layout options
  layoutOptions.forEach(option => {
    option.addEventListener('click', function () {
      layoutOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Filter options
  filterOptions.forEach(option => {
    option.addEventListener('click', function () {
      if (this.dataset.filter === 'more') {
        alert("More filters coming soon!");
        return;
      }
      filterOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
    });
  });

  // Preview button functionality
  previewBtn.addEventListener('click', function () {
    if (capturedPhotos.length === 0) {
      alert("No photos to preview.");
      return;
    }
    window.open(capturedPhotos[capturedPhotos.length - 1], '_blank');
  });
});
