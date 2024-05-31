const http = require("http");
const fs = require("fs");
var requests = require("requests");

const port = 3450;
const homefile = fs.readFileSync("home.html", "utf-8");
const replaceval = (tempval,orgval)=>
    {
        let temperature =tempval.replace("{%tempval%}",orgval.main.temp);
         temperature =temperature.replace("{%tempmin%}",orgval.main.temp_min);
         temperature =temperature.replace("{%tempmax%}",orgval.main.temp_max);
         temperature =temperature.replace("{%location%}",orgval.name);
         temperature =temperature.replace("{%country%}",orgval.sys.country);
         return temperature
        
    }
const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests("https://api.openweathermap.org/data/2.5/weather?q=anand&appid=64aba0927652f2eaa10c6b28b8ab3cb8")
      .on("data",  (chunk) =>{
        const objdata = JSON.parse(chunk);
        const arrdata = [objdata];
          objdata.main.temp=Math.floor(objdata.main.temp-273.15)
        objdata.main.temp_min=Math.floor(objdata.main.temp_min-273.15)
        objdata.main.temp_max=Math.floor(objdata.main.temp_max-273.15)
        objdata.main.feels_like=Math.floor(objdata.main.feels_like-273.15)
        //  console.log(objdata);;
        const realTimeData = arrdata.map(val=>replaceval(homefile,val) ).join("");
        res.write(realTimeData)
        
      })
      .on("end", (err)=> {
        if (err) return console.log("connection closed due to errors", err);

        res.end()
      });
  }
});
server.listen(port,console.log("server started"));