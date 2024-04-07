const elForm = document.querySelector(".js-form");
const elFileInput = document.querySelector(".js-file-input")

elForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.target);
    formData.append("file", elFileInput.files[0]);

    const req = await fetch(BECKEND_SERVER + "/auth/register", {
        method: "POST",
        body: formData
    });
    const res = await req.json();
    if(res.accessToken){
        console.log(res)
        setItem("youtube-token", res.accessToken);
        setItem("youtube-user", res.user)
        toCheckToken()
    }
})
if(token){
    window.location.replace("/admin")
}