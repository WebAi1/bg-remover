// ===== CONFIGURATION ===== //
const REMOVEBG_API = "https://api.remove.bg/v1.0/removebg";
const API_KEY = "7881e729-2837-4076-9466-08c622cdae4a"; // GET FROM REMOVE.BG

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
    alert('Please select JPG or PNG image');
    return;
  }
  
  showLoader(true);
  
  try {
    // Display original
    const originalImg = document.getElementById('originalImg');
    originalImg.src = URL.createObjectURL(file);
    
    // Prepare API request
    const formData = new FormData();
    formData.append('image_file', file);
    
    // Call API
    const response = await fetch(REMOVEBG_API, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY
      },
      body: formData
    });
    
    // Handle errors
    if(!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors[0].title);
    }
    
    // Show result
    const resultBlob = await response.blob();
    const resultImg = document.getElementById('resultImg');
    resultImg.src = URL.createObjectURL(resultBlob);
    
    // Setup download
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = resultImg.src;
      a.download = 'background-removed.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    
    resultSection.style.display = 'block';
    
  } catch(error) {
    alert(`Error: ${error.message}\n\n1. Use clear photos\n2. Check API key\n3. Try smaller image`);
  } finally {
    showLoader(false);
  }
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
