const elForm = document.querySelector(".js-form");
elForm.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const user = {
        username: usernameInput.value,
        password: passwordInput.value
    };
    const req = await fetch(BECKEND_SERVER + "/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    });
    const res = await req.json();
    if(res.accessToken && res.user){
        setItem("youtube-token", res.accessToken);
        setItem("youtube-user", res.user)
        location.replace("/")
        toCheckToken()
    }
})
showButton.addEventListener("click", (evt) => {
    const elPasswordInput = evt.target.parentNode.querySelector("#passwordInput")
    elPasswordInput.type = elPasswordInput.type == "password" ? "text": "password";
})
if(token){
    window.location.replace("/admin")
}