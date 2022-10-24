const { ChromeReaderMode } = require("@material-ui/icons");

const dropzone = document.querySelector(".drop-zone");
const fileinput = document.querySelector("#fileinp");
const browsebtn = document.querySelector(".browse");
const base = "";
const uploadurl = `${base}/api/files`;
const emailURL = `${base}/api/files/send`;

const bgProgress = document.querySelector(".bg-progress");
const percentupdates = document.querySelector("#perc");
const progressbar = document.querySelector(".smallbar");
const progressContainer = document.querySelector(".progressbar");
const fileURLInput = document.querySelector("#fileURL");

const sharingbox = document.querySelector(".sharingbox");
const copyBtn = document.querySelector("#copybtn");
const emailForm = document.querySelector("#emailform");

const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024;

dropzone.addEventListener("dragover", (e)=>{
    e.preventDefault();  
    if(!dropzone.classlist.contains("dragged")){
      dropzone.classList.add("dragged");
    }
});

dropzone.addEventListener("dragleave", ()=>{
    dropzone.classList.remove("dragged");
});

dropzone.addEventListener("drop", (e)=>{
  e.preventDefault();
  dropzone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  console.table(files);
  if(files.length){
      fileinput.files = files;
      uploadfile();
  }
});

browsebtn.addEventListener("click", ()=>{
  fileinput.click();
});
fileinput.addEventListener("change", () => {
  uploadfile();
});

const uploadfile = () => {
    if(fileinput.files.length > 1){
      fileinput.value = "";
      showToast("You can upload only 1 file!")
      return;
    }
    
   const file = fileinput.files[0];
   if (file.size > maxAllowedSize) {
    showToast("Max file size is 100MB");
    fileinput.value = ""; // reset the input
    return;
  }
  progressContainer.style.display = "block";
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onerror = function () {
      showToast(`Error in upload: ${xhr.statusText}`);
      fileinput.value = ""; // reset the input
    };
    xhr.upload.onprogress = updateProgress;
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onFileUploadSuccess(xhr.responseText);
      }  
    }
    xhr.open("POST", uploadurl);
    xhr.send(formData);
};

const updateProgress = (e) => {
  const perc = Math.round((e.loaded / e.total) * 100);
  // console.log(perc);
   bgProgress.style.width = `${perc}%`;
   percentupdates.innerText = perc;
   progressbar.style.transform = `scaleX(${perc/100})`;
}

 const showlink = ({file: url})=>{
    console.log(url);
    fileinput.value = "";
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = 'none';
    sharingbox.style.display = 'block';
    fileURLInput.value = url;
 };

 copyBtn.addEventListener("click", ()=>{
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
 })
 fileURLInput.addEventListener("click", () => {
  fileURLInput.select();
});
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  const url = fileURLInput.value;
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-mail"].value,
    emailFrom: emailForm.elements["sender-mail"].value,
  };
  console.log(formData);
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({data}) => {
      if (data.success) {
        showToast("Email Sent");
        sharingbox.style.display = "none";
      }
    });
 });
 let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%, 0)";
  clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%, 60px)";
  }, 2000);
};
