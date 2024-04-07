const elUserBtn = document.querySelector(".js-user-btn");
const elUserTemp = document.querySelector(".js-user-temp").content;
const elUserList = document.querySelector(".js-user-list");
const elVideoTemp = document.querySelector(".js-video-temp").content;
const elVideoList = document.querySelector(".js-video-list");
const elMicBtn = document.querySelector(".js-mic-btn");
const elForm = document.querySelector(".js-search-form");
const elMic = document.querySelector(".js-mic")
if (token) {
  elUserBtn.innerHTML = "";
  elUserBtn.textContent = user.username;
}
elUserBtn.addEventListener("click", () => {
  if (!token) {
    window.location.replace("/register");
  } else {
    window.location.replace("admin");
  }
});
const handleRenderUsers = (arr) => {
  const docUserFragment = document.createDocumentFragment();
  for (let user of arr) {
    const clone = elUserTemp.cloneNode(true);
    clone.querySelector(".js-username").textContent = user.username;
    clone.querySelector(".js-user-link").dataset.id = user.userId;
    clone.querySelector(".js-username").dataset.id = user.userId
    docUserFragment.append(clone);
  }
  elUserList.append(docUserFragment);
};

const handleGetUsers = async () => {
  const req = await fetch(BECKEND_SERVER + "/users", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token,
    },
  });
  const res = await req.json();
  handleRenderUsers(res);
};
elUserList.addEventListener("click", async (evt) => {
  if (evt.target.matches(".js-user-link") || evt.target.matches(".js-username")) {
    const id = evt.target.dataset.id;
    const req = await fetch(BECKEND_SERVER + `/video?userId=${id}`, {
      method: "GET",
      headers: {
        token,
      },
    });
    const res = await req.json();
    handleRenderVideos(res)
  }
  if(evt.target.matches(".js-home-page-link") || evt.target.matches(".js-home-page-info")){
    handleGetVideos()
}
});
const handleGetVideos = async () => {
  const req = await fetch(BECKEND_SERVER + "/video", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
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
  const handleGetUser = async (userId) => {
    const req = await fetch(BECKEND_SERVER + `/users?userId=${userId}`, {
        method: "GET",
        headers: {
            token
        }
    });
    const res = await req.json();
    return res
  }
  const handleCalculateMb = async (video) => {
    let data = await handleCreateVideo([video])
    return Math.round(data[0].size / (1024 * 1024)) + "mb"
  }
async function handleRenderVideos  (arr) {
    const videos = await handleCreateVideo(arr);
    const docVideoFragment = new DocumentFragment();
    elVideoList.innerHTML = ''
    if(arr.length){
        for(let i = 0; i<arr.length; i++){
            const clone = elVideoTemp.cloneNode(true);
            clone.querySelector(".js-video").src = URL.createObjectURL(videos[i]);
            clone.querySelector(".js-avtor-name").textContent = (await handleGetUser(arr[i].userId))[0].username;
            clone.querySelector(".js-video-title").textContent = arr[i].video_title;
            clone.querySelector(".js-uploaded-time").textContent = arr[i].birth_date;
            clone.querySelector(".js-video-mb").textContent = await handleCalculateMb(arr[i])
            clone.querySelector(".js-download-link").href = BECKEND_SERVER + `/download/${arr[i].videoName}`
            docVideoFragment.append(clone);
        }
        elVideoList.append(docVideoFragment)
    }
};

const SpeechRecognition = new window.webkitSpeechRecognition();
SpeechRecognition.lang = "uz-UZ";

elMic.addEventListener("click", () => {
  if(token){
    SpeechRecognition.start();
    SpeechRecognition.addEventListener("audiostart", (event) => {
      console.log("Start", event)
    })
    SpeechRecognition.addEventListener("audioend", (event) => {
      console.log("END", event)
    })
    SpeechRecognition.addEventListener("result", async (event) => {
      const transcript = event.results[0][0].transcript;
      const req = await fetch(BECKEND_SERVER + `/video?video_title=${transcript}`, {
        method: "GET",
        headers: {
          token
        }
      })
      const res = await req.json();
      handleRenderVideos(res)
    });
  }else{
    confirm("You are not registered");
  }
})
elForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  if(videoTitle.value.length){
    const req = await fetch(BECKEND_SERVER + `/video?video_title=${videoTitle.value}`, {
      method: "GET",
      headers: {
        token
      }
    })
    const res = await req.json();
    handleRenderVideos(res)
  }else{
    handleGetVideos();
  }
})
handleGetVideos();
handleGetUsers();
