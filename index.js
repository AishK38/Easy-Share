const dropzone = document.querySelector(".drop-zone");
const fileinput = document.querySelector("#fileinp");
const browsebtn = document.querySelector(".browse");
const host = "";
const uploadurl = `${host}api/files`;
const bgProgress = document.querySelector(".bg-progress");
const percentupdates = document.querySelector("#perc");
const progressbar = document.querySelector(".smallbar");
const progressContainer = document.querySelector(".progressbar");
const fileURL = document.querySelector("#fileURL");
const sharingbox = document.querySelector(".sharingbox");
const copyBtn = document.querySelector("#copybtn");

dropzone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    console.log("dragging");
    if(!dropzone.classList.contains("dragged")){
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
    progressContainer.style.display = "block";
    const file = fileinput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if(xhr.readyState === XMLHttpRequest.DONE) {  
        console.log(xhr.response);
        showlink(JSON.parse(xhr.response));
      }  
    };
    xhr.upload.onprogress = updateProgress;
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
    progressContainer.style.display = 'none';
    sharingbox.style.display = 'block';
    fileURL.value = url;
 }

 copyBtn.addEventListener('click',"click", ()=>{
    fileURL.select();
    document.execCommand("copy");
 })
