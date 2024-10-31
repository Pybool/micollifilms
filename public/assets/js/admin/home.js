let context = {}

function setContext(_context){
    context = _context
    console.log("Setting THe context ", context)
}

function getContext(){
  return context
}

function toggleTextAndInputSave(id, event) {
  const elementTxt = document.getElementById(id);
  const elementTxtInput = document.getElementById(`${id}-input`);

  if (elementTxt && elementTxtInput) {
    
    elementTxt.classList.toggle("no-display");
    elementTxtInput.classList.toggle("no-display");
    if (Array.from(elementTxtInput.classList).includes("no-display") == false) {
      elementTxtInput.value = elementTxt.textContent?.trim();
      event.target.innerHTML = ` <i class="fas fa-save" style="line-height: 1; color: white;"></i> Save`;
    } else {
      event.target.innerHTML = ` <i class="fas fa-pen" style="line-height: 1; color: white;"></i> Edit`;
      buildPayload(id, context, elementTxtInput);
    }
  }
  
}

async function buildPayload(id) {
  const elementTxt = document.getElementById(id);
  const elementTxtInput = document.getElementById(`${id}-input`);
  context[id] =elementTxtInput?.value || "";
  console.log(context);
  try {
    const response = await fetch('/api/home-page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(context),
    });

    if (response.ok) {
      // Redirect to home page if login is successful
      window.location.reload()
    } else {
      // Handle error
      const errorData = await response.json();
      alert("Operation failed to complete");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
}

async function toggleArchiveItem(id){
  try {
    const response = await fetch('/api/toggle-archive-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({_id: id}),
    });

    if (response.ok) {
      window.location.reload()
    } else {
      // Handle error
      const errorData = await response.json();
      alert("Operation failed to complete");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
}


async function toggleLatestItem(id){
  try {
    const response = await fetch('/api/toggle-latest-portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({_id: id}),
    });

    if (response.ok) {
      window.location.reload()
    } else {
      // Handle error
      const errorData = await response.json();
      alert("Operation failed to complete");
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
}

async function selectBackgroundImage() {
  // Trigger the hidden file input
  document.getElementById('backgroundImageInput').click();
}

// Handle image selection and upload
async function changeBg(event){
  const file = event.target.files[0];
  if (!file) return; // No file selected

  const formData = new FormData();
  formData.append('image', file);  // Attach the selected image
  formData.append('homePageId', getContext()._id);  // Add your home page ID (you can dynamically generate this)

  // Send the image to the backend using fetch
  try {
      const response = await fetch('/api/upload-banner-image', {
          method: 'POST',
          body: formData
      });

      const result = await response.json();
      if (result.success) {
        setBackgroundImage(result.imageUrl)
          alert('Background image uploaded successfully!');
          // You can also update the banner image on the front-end here
      } else {
          alert('Failed to upload background image.');
      }
  } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image.');
  }
}

// Handle image selection and upload
async function changeAboutBg(event){
  const file = event.target.files[0];
  if (!file) return; // No file selected

  const formData = new FormData();
  formData.append('image', file);  // Attach the selected image
  formData.append('aboutPageId', getContext()._id);  // Add your home page ID (you can dynamically generate this)

  // Send the image to the backend using fetch
  try {
      const response = await fetch('/api/upload-about-banner-image', {
          method: 'POST',
          body: formData
      });

      const result = await response.json();
      if (result.success) {
        setBackgroundImage(result.imageUrl)
          alert('Background image uploaded successfully!');
          // You can also update the banner image on the front-end here
      } else {
          alert('Failed to upload background image.');
      }
  } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image.');
  }
}


  
function setBackgroundImage(imageUrl) {
  const bannerSection = document.getElementById('image-background');
  if(bannerSection){
    bannerSection.style.backgroundImage = `url('${imageUrl}')`;
  }
}