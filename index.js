const dropzone = document.querySelector(".drop-zone");
const fileinput = document.querySelector("#fileinp");
const browsebtn = document.querySelector(".browse");
const host = "";
const uploadurl = `${host}api/files`;
const bgProgress = document.querySelector(".bg-progress");

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
});

browsebtn.addEventListener("click", ()=>{
  fileinput.click();
});

fileinput.addEventListener("change", () => {
  uploadfile();
});

const uploadfile = () => {
    const file = fileinput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if(xhr.readyState === XMLHttpRequest.DONE) {  
        console.log(xhr.response);
      }  
    };
    xhr.upload.onprogress = updateProgress;
    xhr.open("POST", uploadurl);
    xhr.send(formData);
};

const updateProgress = (e) => {
    const perc = Math.round((e.loaded / e.total) * 100);
    console.log(perc);
    bgProgress.style.width = `${perc}%`;
}
