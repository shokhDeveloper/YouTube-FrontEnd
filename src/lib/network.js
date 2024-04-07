const os = require("os");
const networkInterface = os.networkInterfaces();
const PORT = process.env.PORT || 5000;
let IP_ADRESS = '';
try{
    if(networkInterface["Беспроводная сеть 3"]){
        IP_ADRESS += networkInterface["Беспроводная сеть 3"].find(network => network.family == "IPv4").address;
    }
}catch(error){
    console.log(error)
}
const host = `http://${"localhost"}:${PORT}`;
module.exports = {host, PORT};