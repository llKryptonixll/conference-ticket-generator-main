const fileInput = document.getElementById('file-input')
const ticketForm = document.getElementById('ticket-form')
const dropArea = document.getElementById('drop-area')
const dragDropSettings_Area = document.getElementById('drag-drop-settings')
const fullNameInput = document.getElementById('full-name')
const emailInput = document.getElementById('email')
const githubUsernameInput = document.getElementById('github-username')
let imgUrl = ''

ticketForm.addEventListener('submit', (event) => {
  handleSubmit(event)
})

// Drag Events
dropArea.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0]
  handleFile(file)
})

fileInput.addEventListener('change', () => {
  handleFile(fileInput.files[0])
})

// Drag & Drop Handler
function handleFile(file) {
  if (validateFileInput(file)) {
    fileInput.files = createFileList(file)
    previewImage(file)
    renderBtn()
  }
}

// Helper to assign file to file input
function createFileList(file) {
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)
  return dataTransfer.files
}

function previewImage(file) {
  if (!file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = () => {
    dropArea.innerHTML = ''
    const img = document.createElement('img')
    img.src = reader.result
    img.className = 'rounded-lg h-full w-full'
    dropArea.appendChild(img)

    imgUrl = reader.result
  }
  reader.readAsDataURL(file)
}

// Settings Buttons
function renderBtn() {
  dragDropSettings_Area.innerHTML = `
    <button 
      onclick="removeImage()" 
      type="button" 
      class="z-20 relative cursor-pointer text-neutral-300 bg-neutral-0/10 px-2 py-1 rounded-md text-sm">
      Remove image
    </button>
    <button 
      onclick="changeImage()" 
      type="button" 
      class="z-20 relative cursor-pointer text-neutral-300 bg-neutral-0/10 px-2 py-1 rounded-md text-sm">
      Change image
    </button>
  `
}

function removeImage() {
  fileInput.value = ''
  dropArea.innerHTML = ` 
    <img src="./assets/images/icon-upload.svg" alt="upload-image-icon" />
  `
  dragDropSettings_Area.innerHTML = `
    <p class="text-neutral-300">Drag and drop or click to upload</p>
  `
}

function changeImage() {
  fileInput.click()
}

// Input Validation
function validateInputs(input, regex = null) {
  const value = input.value.trim()
  const isValidInput = regex ? regex.test(value) : value !== ''

  if (!isValidInput) {
    input.nextElementSibling.classList.remove('hidden')
    input.nextElementSibling.classList.add('flex')
    input.classList.add('outline-1', 'outline-neutral-500', 'border-orange-700')
    return false
  } else {
    input.nextElementSibling.classList.add('hidden')
    input.classList.remove('outline-1', 'outline-neutral-500', 'border-orange-700')
    return true
  }
}

function validateFileInput(file) {
  const fileErrorMessage = document.getElementById('file-size-check')
  const infoIcon = document.getElementById('info-icon-file')

  if (!file || !file.type.startsWith('image/')) {
    fileErrorMessage.innerHTML = 'Please provide an image'
    fileErrorMessage.classList.add('text-orange-700')
    infoIcon.classList.add('stroke-orange-700')
    return false
  } else if (file.size >= 512000) {
    fileErrorMessage.innerHTML = 'File too large. Please upload a photo under 500KB.'
    fileErrorMessage.classList.add('text-orange-700')
    infoIcon.classList.add('stroke-orange-700')
    return false
  } else {
    fileErrorMessage.innerHTML = 'Upload your photo (JPG or PNG, max size 500KB).'
    fileErrorMessage.classList.remove('text-orange-700')
    infoIcon.classList.remove('stroke-orange-700')
    return true
  }
}

function handleSubmit(event) {
  event.preventDefault()

  let isValid = true

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

  const file = fileInput.files[0]

  if (!validateInputs(fullNameInput)) isValid = false
  if (!validateInputs(githubUsernameInput)) isValid = false
  if (!validateInputs(emailInput, emailRegex)) isValid = false
  if (!validateFileInput(file)) isValid = false

  if (isValid) {
    renderTicket()
  } else {
    console.log('error')
  }
}

function renderTicket() {
  const mainSection = document.getElementById('main-section')
  const textContainer = document.getElementById('head-text')

  textContainer.innerHTML = `
    <h1 class="lg:text-6xl md:text-5xl text-3xl font-bold">
      Congrats, <span class="bg-gradient-to-r from-gradient-1 to-gradient-2 bg-clip-text text-transparent">${fullNameInput.value}!</span><br/> Your ticket is ready.
    </h1>
    <br />
    <p class="lg:text-2xl text-xl text-neutral-300 max-w-[480px] w-full">
      We've emailed your ticket to <span class="text-orange-500">${emailInput.value}</span> and will send updates in the run up to the event.
    </p>
  `

  mainSection.innerHTML = `
    <h2 id="section-title" class="sr-only">${fullNameInput.value}'s Conference Ticket</h2>
    <article class="relative w-full max-w-[600px] aspect-[600/280] grid place-items-center sm:p-7 p-4 mt-12">
      <img
        src="./assets/images/pattern-ticket.svg"
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
      />
        
      <div class="relative z-10 w-full h-full flex flex-col justify-between">
        <header class="flex gap-6 items-start">
          <img class="xs:max-w-full max-w-[30px]" src="./assets/images/logo-mark.svg" alt="company-logo-coding-conf">  <!-- Verwende die gespeicherte Data-URL -->
          <div class="grid xs:gap-4">
            <p class="xs:text-4xl text-2xl font-bold text-neutral-0">Coding Conf</p>
            <time datetime="2025-01-31T00:00" class="text-neutral-300 xs:text-md text-sm">
              Jan 31, 2025 &nbsp; <span class="text-xl">/</span> &nbsp; Austin, TX
            </time>
          </div>
        </header>
        
        <section class="flex gap-6 items-center">
          <img class="xs:max-w-[80px] max-w-[45px] rounded-xl" src="${imgUrl}" alt="avatar">
          <div>
            <p class="xs:text-2xl text-lg text-neutral-0">${fullNameInput.value}</p>
            <div class="flex items-center gap-2">
              <img src="./assets/images/icon-github.svg" alt="github-icon">
              <p class="text-neutral-300 xs:text-lg text-sm">@${githubUsernameInput.value}</p>
            </div>
          </div>
        </section>
        
        <span class="vertical-text xs:text-2xl text-lg text-neutral-500 absolute xs:right-2 right-0 top-1/2 -translate-y-1/2">
          #01609
        </span>
      </div>
    </article>
  `
}
