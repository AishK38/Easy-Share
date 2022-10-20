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
const fileURL = document.querySelector("#fileURL");

const sharingbox = document.querySelector(".sharingbox");
const copyBtn = document.querySelector("#copybtn");
const emailForm = document.querySelector("#emailform");

const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024;

dropzone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    console.log("dragging");
    if(!dropzone.classList.contains("dragged")){
      dropzone.classList.add("dragged");
    }  
});

dropzone.addEventListener("dragleave", ()=>{
    dropzone.classList.remove("dragged");
    console.log("drag ended");
});

dropzone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropzone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    if (files.length === 1) {
      if (files[0].size < maxAllowedSize) {
        fileinput.files = files;
        uploadfile();
      } else {
        showToast("Max file size allowed is 100MB");
      }
    } else if (files.length > 1) {
      showToast("You can't upload multiple files");
    }
});

browsebtn.addEventListener("click", ()=>{
  fileinput.click();
});

fileinput.addEventListener("change", () => {
  if (fileinput.files[0].size > maxAllowedSize) {
    showToast("Max file size is 100MB");
    fileinput.value = ""; // reset the input
    return;
  }
  uploadfile();
});

const uploadfile = () => {
    progressContainer.style.display = "block";
    console.log("File added uploading");
    file = fileinput.files;
    const formData = new FormData();
    formData.append("myfile", file[0]);

    const xhr = new XMLHttpRequest();

    xhr.upload.onerror = function () {
      showToast(`Error in upload: ${xhr.status}.`);
      fileinput.value = ""; // reset the input
    };
    xhr.upload.progress = function (e) {
      const perc = Math.round((e.loaded / e.total) * 100);
     // console.log(perc);
      bgProgress.style.width = `${perc}%`;
      percentupdates.innerText = perc;
      progressbar.style.transform = `scaleX(${perc/100})`;
    }  
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        onFileUploadSuccess(xhr.responseText);
      }  
    }
    xhr.open("POST", uploadurl);
    xhr.send(formData);
};

 const showlink = ({file: url})=>{
    console.log(url);
    progressContainer.style.display = 'none';
    sharingbox.style.display = 'block';
    fileURL.value = url;
 }

 copyBtn.addEventListener('click',"click", ()=>{
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
 })
 fileURL.addEventListener("click", () => {
  fileURL.select();
});
emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  const url = fileURL.value;
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
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};
