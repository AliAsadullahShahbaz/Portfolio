
const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptbtn = document.querySelector(".prompt-btn");
const generatebtn = document.querySelector(".generate-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");
const img_download_btn = document.querySelectorAll(".img-overlay");
const apiKey = "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";
const examplePrompts = [
    "A beautiful mosque glowing under the moonlight with intricate calligraphy on its walls",
    "The Kaaba surrounded by worshippers during Hajj, with golden lanterns lighting the night",
    "A peaceful garden in Jannah with rivers of milk and honey, and trees with golden fruits",
    "A scholar writing with a quill in an ancient Islamic library, surrounded by books and scrolls",
    "A stunning Islamic geometric pattern forming a mesmerizing kaleidoscope of colors",
    "An oasis in the desert with flowing water, palm trees, and a Bedouin tent",
    "A luminous mihrab inside a grand mosque, with intricate tilework and Arabic calligraphy",
    "A child learning the Quran with their teacher in a madrasa filled with books and wisdom",
    "A breathtaking sunset over the Dome of the Rock, with golden reflections on its surface",
    "A mystical night in the desert with a traveler gazing at the stars, inspired by the Quranic verse",
    "A bustling marketplace in ancient Baghdad during the Islamic Golden Age",
    "A peaceful Ramadan night with lanterns, family gatherings, and the sound of adhan",
    "A grand minaret standing tall against a pastel-colored dawn sky",
    "A heavenly river flowing through lush gardens, as described in the Quran",
    "A vast desert landscape with a lone traveler and their camel, guided by the stars",
];

// 1. toggle dark and light theme 2. saving state in local storage 3. changing icon 
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
}
//1. checking for saved theme from local storage 
// 2. checking user system prefers dark theme or not by window.matchMedia(css query)
// 3. checking if saved theme is dark or light || if no saved theme and system prefers dark
// 4. adding dark theme class to body and changing icon according to isDarkTheme Value
(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersTheme = window.matchMedia("prefers-color-scheme: dark").matches;
    const isDarkTheme = savedTheme === "dark" || ((!savedTheme) && systemPrefersTheme);
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.querySelector("i").className = isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})()
// Function to handle image download
function handleImageDownload(imageURL) {
    
    const link = document.createElement("a"); // Create an anchor tag
    link.href = imageURL;
    link.download = "downloaded-image.png"; // Set filename
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Remove the link after download

    alert("Image will be downloaded.");
}

// Function to update image card and add event listener for download
async function updateImageCard(index, imageURL) { 
    const imgCard = document.getElementById(`img-card-${index}`);
    if (!imgCard) return;
    
    imgCard.classList.remove("loading");

    imgCard.innerHTML = `
        <img src="${imageURL}" class="result-img">
        <div class="img-overlay">
            <button class="img-download-btn">
                <i class="fa-solid fa-download"></i>
            </button>
        </div>`;

    console.log("This is my AI Generated Image URL:", imageURL);

    // Attach event listener to the newly created download button
    const downloadBtn = imgCard.querySelector(".img-overlay");
    // downloadBtn.addEventListener("click", handleImageDownload(imageURL));
}
// 1.random no. generation 2. setting prompt by value of random no.  3. cursor focus on input box  
promptbtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
});
function getImageDimenstion(aspectRatio, baseSize = 512) {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);
    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);

    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

    return { width: calculatedWidth, height: calculatedHeight };
}

// Send Request to API to create images 
async function generateImages(selectedModel, imageCount, aspectRatio, promptText) {
    const Model_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
    const { width, height } = getImageDimenstion(aspectRatio);
    generatebtn.setAttribute("disabled", true);
    // Creating Array to generate images 
    const imagePromises = Array.from({ length: imageCount }, async (_, i) => {   
        console.log("----------You have entered prompt : ",promptText,"-------------");   
          try {
            // Send Request to API
            const response = await fetch(Model_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: promptText,
                    parameters: { width, height },
                    options: { wait_for_model: true, x_use_cache: false }
                }),
            });

            // if (!response.ok) throw new error((await response.json())?.error);

            const result = await response.blob();
            console.log(i,result);

            const imageURL = URL.createObjectURL(result);
            console.log(imageURL);
            updateImageCard(i, imageURL);
        } catch (error) {
            console.error(error);
            const imgCard = document.getElementById(`img-card-${i}`);
            imgCard.classList.replace("loading", "error");
            imgCard.querySelector(".status-text").textContent = "Error Generating Image Please Try Again";
        }
    });
    await Promise.allSettled(imagePromises);
    generatebtn.removeAttribute("disabled");
}
// Create Placeholder cards with loading spinner 
const createImageCards = (selectedModel, imageCount, aspectRatio, promptText) => {
    gridGallery.innerHTML = "";
    for (let i = 0; i < imageCount; i++) {
        gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" 
        style="aspect-ratio: ${aspectRatio}">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                        <img src="test.png" class="result-img">
                        </div>`;
    }
    generateImages(selectedModel, imageCount, aspectRatio, promptText);
};
// To Remove the page reload when submit a form
const handleFormSubmit = (e) => {
    e.preventDefault();
    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value);
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();
    createImageCards(selectedModel, imageCount, aspectRatio, promptText);
    generateImages(selectedModel, imageCount, aspectRatio, promptText);
}
promptInput.addEventListener("input", () => {
    const promptText = promptInput.value.trim();
    generatebtn.disabled = !promptText;
})
promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);


