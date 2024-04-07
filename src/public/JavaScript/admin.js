const elForm = document.querySelector(".js-form");
const elItemTemp = document.querySelector(".js-item-temp").content;
const elVideoList = document.querySelector(".js-video-list");
const handleGetMyData = async () => {
  const req = await fetch(BECKEND_SERVER + `/video?userId=${user.userId}`, {
    method: "GET",
    headers: {
      token,
    },
  });
  const res = await req.json();
  handleRenderVideos(res);
};
const handleCreateVideo = async (arr) => {
  try {
    let videos = await Promise.all(
      arr.map(async (data) => {
        const response = await fetch(
          `${BECKEND_SERVER}/video/${data.videoName}`,
          {
            method: "GET",
            headers: {
              token,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        return blob;
      })
    );
    return videos;
  } catch (error) {
    console.log(error);
  }
};
async function handleRenderVideos(arr) {
  const docVideosFragment = new DocumentFragment();
  const videos = await handleCreateVideo(arr);
  elVideoList.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    let clone = elItemTemp.cloneNode(true);
    clone.querySelector(".js-video-item").src = URL.createObjectURL(videos[i]);
    clone.querySelector(".js-video-content").textContent = arr[i].video_title;
    clone.querySelector(".js-video-content").dataset.id = arr[i].id;
    clone.querySelector(".js-del-vid").dataset.id = arr[i].videoName;
    docVideosFragment.append(clone);
  }
  elVideoList.append(docVideosFragment);
}
elForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const formData = new FormData();
  formData.append("video", uploadInput.files[0]);
  formData.append("video_title", videoInput.value);
  formData.append("userId", user.userId);
  formData.append("birth_date", new Date().toLocaleDateString().split(".").reverse().join(".").replaceAll(".", "-"))
  const req = await fetch(BECKEND_SERVER + "/video/upload", {
    method: "POST",
    body: formData,
    headers: {
      token,
    },
  });
  await req.json();
  handleGetMyData();
});
handleGetMyData();
const handleKeyUp = async (evt) => {
  if (evt.target.matches(".js-video-content") && evt.keyCode == 13) {
    let updateData = { video_title: evt.target.textContent };
    const id = evt.target.dataset.id;
    const req = await fetch(BECKEND_SERVER + `/video/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        token,
      },
      body: JSON.stringify(updateData),
    });
    await req.json();
  }
};
elVideoList.addEventListener("keyup", handleKeyUp);
const handleClick = async (evt) => {
    if(evt.target.matches(".js-del-vid")){
        const id = evt.target.dataset.id;
        const req = await fetch(BECKEND_SERVER + `/video/${id}`, {
          method: "DELETE",
          headers: {
            token
          }
        });
        await req.json();
        handleGetMyData()
    }
};
elVideoList.addEventListener("click", handleClick);
const handleIncludeToken = () => {
    if(!token){
        location.replace("/register")
    }
}
handleIncludeToken()