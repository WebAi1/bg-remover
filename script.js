// ===== CONFIGURATION ===== //
const PIXELBIN_API = "https://api.pixelbin.io/v2/removebg";
const API_KEY = "7881e729-2837-4076-9466-08c622cdae4a"; // REPLACE WITH YOUR KEY

// ===== ELEMENTS ===== //
const uploadZone = document.getElementById('uploadZone');
const resultSection = document.getElementById('resultSection');
const loader = document.getElementById('loader');
const imageInput = document.getElementById('imageInput');
const downloadBtn = document.getElementById('downloadBtn');

// ===== IMAGE PROCESSING ===== //
imageInput.addEventListener('change', handleImageSelect);

async function handleImageSelect(e) {
  if(!e.target.files.length) return;
  
  const file = e.target.files[0];
  if(!file.type.match('image.*')) {
    alert('Please select an image file (JPG/PNG)');
    return;
  }
  
  showLoader(true);
  
  try {
    // Display original image
    const originalImg = document.getElementById('originalImg');
    originalImg.src = URL.createObjectURL(file);
    
    // Prepare API request
    const formData = new FormData();
    formData.append('image', file);
    
    // Call PixelBin API
    const response = await fetch(PIXELBIN_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      },
      body: formData
    });
    
    // Handle API errors
    if(!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Background removal failed');
    }
    
    // Show result
    const resultBlob = await response.blob();
    const resultImg = document.getElementById('resultImg');
    resultImg.src = URL.createObjectURL(resultBlob);
    
    // Set up download
    downloadBtn.onclick = () => downloadImage(resultBlob);
    
    // Show results
    resultSection.style.display = 'block';
    
  } catch(error) {
    alert(`Error: ${error.message}\n\nTip: Use clear photos with distinct foreground objects`);
  } finally {
    showLoader(false);
  }
}

// ===== HELPER FUNCTIONS ===== //
function downloadImage(blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'no-background.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function resetApp() {
  imageInput.value = '';
  resultSection.style.display = 'none';
  uploadZone.style.display = 'block';
}

function showLoader(show) {
  loader.style.display = show ? 'block' : 'none';
  uploadZone.style.display = show ? 'none' : 'block';
}

// Touch optimization for mobile
document.body.addEventListener('touchstart', function() {}, { passive: true });
