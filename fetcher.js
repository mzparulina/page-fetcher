const request = require('request');
const fs = require("fs");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const path = process.argv[3];
const domain = process.argv[2];
request(domain, (error, response, body) => {
  if (error) {
    console.log('Your URL path is incorrect:');
    console.log('\nerror:', error);
  } else {
    if (fs.lstatSync(path).isFile()) {
      let writeFile = (rl) => {
        fs.promises
          .writeFile(`${path}`, body)
          .then(() => {
            console.log(`Downloaded and saved ${response.headers["content-length"]} bytes to ${path}`);
            rl.close();
          })
          .catch((error) => {
            console.log("error:", error);
            rl.close();
          });
      };

      fs.access(path, fs.F_OK, (err) => {
        if (err) {
          writeFile();
        } else {
          console.log('File exists');
          rl.question("The file already exist, do you want to overwrite? [Y]/[N]: ", function(answ) {
            if (answ === 'Y' || answ === 'y') {
              writeFile(rl);
            } else {
              rl.close();
            }
          });
          rl.on("close", function() {
            console.log("\nExiting !!!");
            process.exit(0);
          });
        }
      });
    } else {
      console.log('Your file path is incorrect:');
      console.log('\nerror:', error);
    }
  }
});
