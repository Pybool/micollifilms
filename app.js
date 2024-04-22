const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const indexRouter = require("./routes/index");
const app = express();
const addThumbNail = require("./thumbnail");
const HomePageModel = require("./models/homePage.model");
const AboutUsModel = require("./models/aboutusPage.model");
const PackageModel = require("./models/packages.model");
const PortfolioModel = require("./models/portFolio.model");
const cors = require("cors")

// const AboutUsModel = require("./dtos/about");
// const HomePageModel = require("./dtos/home");
// const PackageModel = require("./dtos/packages");
// const PortfolioModel = require("./dtos/portfolio");

dotenv.config();

const PORT = process.env.PORT || 5000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "7d",
  })
);

app.use("/", indexRouter);
mongoose
  .connect(process.env.DATABASE, {
    dbName: "MICOLLI_FILMS",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected Successfully.");
  })
  .catch((err) => console.log(err.message));

const httpServer = http.createServer(app);

app.post("/api/home-page", async (req, res) => {
  try {
    const homePageData = req.body;
    const promises = homePageData.latestFromPortFolioVideos.map(
      async (portFolioVideo) => {
        if(portFolioVideo?.isYoutube){
          const thumbNailUrl = await addThumbNail(portFolioVideo.videoUrl);
          portFolioVideo.src = thumbNailUrl;
          return portFolioVideo;
        }
        return ""
      }
    );

    const thumbNailedlatestFromPortFolioVideos = await Promise.all(promises);
    homePageData.latestFromPortFolioVideos =
      thumbNailedlatestFromPortFolioVideos;

    const savedHomePage = await HomePageModel.create(homePageData);
    res.json({
      status: true,
      versionId: savedHomePage._id.toString(),
      message: "Homepage data has been updated",
    });
  } catch (error) {
    console.error("Error storing home page data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing home page data." });
  }
});

app.post("/api/about-us", async (req, res) => {
  try {
    const aboutUsdata = req.body;
    const savedAboutUsPage = await AboutUsModel.create(
      aboutUsdata
    );
    res.json({
      status: true,
      versionId: savedAboutUsPage._id.toString(),
      message:"About us page data was saved"
    });
  } catch (error) {
    console.error("Error storing about us data:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while storing about us data.",
      });
  }
});

app.post("/api/our-packages", async (req, res) => {
  try {
    const ourPackagesUsdata = req.body;
    const operations = ourPackagesUsdata.packages.map((package) => ({
      insertOne: {
        document: package,
      },
    }));
    const savedPackagesPage = await PackageModel.bulkWrite(
      operations
    );
    res.json({
      status: true,
      versionId: savedPackagesPage?.toString(),
      message:"Packages page data was saved"
    });
  } catch (error) {
    console.error("Error storing packages data:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while storing packages data.",
      });
  }
});

app.post("/api/portfolio-videos", async (req, res) => {
  try {
    const portfolioVideoData = req.body;
    const promises = portfolioVideoData.portfolioItems.map(
      async (portFolioVideo) => {
        if(portFolioVideo?.isYoutube){
          const thumbNailUrl = await addThumbNail(portFolioVideo.videoUrl);
          portFolioVideo.src = thumbNailUrl;
          return portFolioVideo;
        }
        return ""
      }
    );

    const thumbNailedportFolioVideos = await Promise.all(promises);
    portfolioVideoData.portfolioItems =
      thumbNailedportFolioVideos;
    const savedPortfolioVideo = await PortfolioModel.create(
      portfolioVideoData
    );
    res.json(savedPortfolioVideo);
  } catch (error) {
    console.error("Error storing  portfolio video data:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while storing  portfolio video data.",
      });
  }
});

httpServer.listen(PORT, () => {
  console.log(`Http Server is running on port ${PORT}`);
});

module.exports = app;
