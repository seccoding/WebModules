function fileSelector(selector) {
  if (!selector) {
    return;
  }
  const selectors = document.querySelectorAll(selector);
  if (!selectors) {
    return;
  }

  function insertAfter(newDom, existsDom) {
    existsDom.parentNode.insertBefore(newDom, existsDom.nextSibling);
  }

  for (const file of selectors) {
    file.dataset.id = Math.random();
    const fileDiv = document.createElement("div");
    fileDiv.className = "file-div";
    fileDiv.dataset.target = file.dataset.id;

    const appendBtn = document.createElement("button");
    appendBtn.className = "append-btn";
    appendBtn.setAttribute("type", "button");
    appendBtn.addEventListener("click", function () {
      file.click();
    });
    fileDiv.append(appendBtn);

    const appendedFiles = document.createElement("div");
    appendedFiles.className = "appended-files";

    fileDiv.append(appendedFiles);

    file.addEventListener("change", function () {
      const prevFileList = fileDiv.querySelector("ul.file-list");
      if (prevFileList) {
        prevFileList.remove();
      }

      const fileUl = document.createElement("ul");
      fileUl.className = "file-list";
      for (const f of this.files) {
        const fileItem = document.createElement("li");
        fileUl.append(fileItem);
        const fileName = f.name.toLowerCase();
        if (
          fileName.endsWith(".jpg") ||
          fileName.endsWith(".jpeg") ||
          fileName.endsWith(".png") ||
          fileName.endsWith(".gif") ||
          fileName.endsWith(".webp") ||
          fileName.endsWith(".mp3") ||
          fileName.endsWith(".mp4")
        ) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const p = document.createElement("p");
            p.innerText = f.name + ` (size: ${f.size}bytes)`;

            let multimedia;
            if (fileName.endsWith("mp3")) {
              multimedia = document.createElement("audio");
              multimedia.setAttribute("controls", true);
            } else if (fileName.endsWith("mp4")) {
              multimedia = document.createElement("video");
              multimedia.setAttribute("controls", true);
            } else {
              multimedia = document.createElement("img");
              multimedia.addEventListener("click", function () {
                const image = new Image();
                image.src = this.getAttribute("src");
                const imagePopup = window.open("", "");
                imagePopup.document.write(image.outerHTML);
              });
            }

            multimedia.setAttribute("src", e.target.result);

            fileItem.append(p);
            fileItem.append(multimedia);
          };
          reader.readAsDataURL(f);
        } else {
          fileItem.innerText = f.name + ` (size: ${f.size}bytes)`;
        }
      }

      appendedFiles.append(fileUl);
    });

    insertAfter(fileDiv, file);

    file.style.display = "none";
  }
}
