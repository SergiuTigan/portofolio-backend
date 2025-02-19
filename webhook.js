const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  const branch = req.body.ref;
  
  if (branch === "refs/heads/master") {
    console.log("🚀 Received push to master. Pulling latest code...");

    exec("cd /home/ubuntu/blog-backend && git pull origin master && npm install && sudo systemctl restart blog-api", (err, stdout, stderr) => {
      if (err) {
        console.error(`❌ Error updating: ${err.message}`);
        return res.status(500).send("Update failed.");
      }

      console.log(`✅ Update successful:\n${stdout}`);
      res.status(200).send("Update successful.");
    });
  } else {
    res.status(200).send("Not master branch, ignoring.");
  }
});

app.listen(3001, () => console.log("🎧 Webhook listener running on port 3001"));
