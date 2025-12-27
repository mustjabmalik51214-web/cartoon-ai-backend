const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.get("/", (req, res) => {
    res.send("Cartoon AI Backend is Running ✅");
});

app.post("/convert", upload.single("video"), (req, res) => {
    try {
        const inputPath = req.file.path;
        const outputPath = inputPath + "_cartoon.mp4";

        // DEMO conversion (copy video)
        fs.copyFileSync(inputPath, outputPath);

        res.setHeader("Content-Type", "video/mp4");
        const stream = fs.createReadStream(outputPath);
        stream.pipe(res);

        stream.on("end", () => {
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (e) {
        console.error(e);
        res.status(500).send("Conversion failed");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
