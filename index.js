const dropzone = document.querySelector(".drop-zone");
const fileinput = document.querySelector("#fileinp");
const browsebtn = document.querySelector(".browse");

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
