const BECKEND_SERVER = "http://192.168.1.108:4000"
const getItem = (key) => window.localStorage.getItem(key);
const setItem = (key, value) => window.localStorage.setItem(key, typeof value == "object" ? JSON.stringify(value): value);
const token = getItem("youtube-token");
const user = JSON.parse(getItem("youtube-user"));
const toCheckToken = () => {
    if(!getItem("youtube-token")){
        window.location.replace("/register")
    }else{
        window.location.replace("/")
    }
}
