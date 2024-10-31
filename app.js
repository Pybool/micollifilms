const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require('fs');
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
const multer = require("multer");
const Testimonials = require("./models/testimonial.model"); // Assuming you have a model for testimonials

const cors = require("cors");
function slugify(text) {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters (letters, numbers, hyphens)
    .replace(/\-\-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Remove leading hyphen
    .replace(/-+$/, ""); // Remove trailing hyphen
}

dotenv.config();

const PORT = process.env.PORT || 5000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.use(cors);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "30d",
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

// Multer configuration for file uploads
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/testimonials/";

    // Create directory recursively if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Save files to the specified directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename by appending the timestamp and the original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let storageBg = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/banners/";

    // Create directory recursively if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Save files to the specified directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename by appending the timestamp and the original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let storagePackages = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads/packages/";

    // Create directory recursively if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath); // Save files to the specified directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename by appending the timestamp and the original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadBg = multer({ storage: storageBg });

const uploadPackages = multer({ storage: storagePackages });

app.post("/api/home-page", async (req, res) => {
  try {
    const homePageData = req.body;
    const promises = homePageData.latestFromPortFolioVideos.map(
      async (portFolioVideo) => {
        if (portFolioVideo?.isYoutube) {
          const thumbNailUrl = await addThumbNail(portFolioVideo.videoUrl);
          portFolioVideo.src = thumbNailUrl;
          return portFolioVideo;
        }
        return "";
      }
    );

    const thumbNailedlatestFromPortFolioVideos = await Promise.all(promises);
    homePageData.latestFromPortFolioVideos =
      thumbNailedlatestFromPortFolioVideos;

    const savedHomePage = await HomePageModel.findOneAndUpdate(
      { _id: homePageData._id }, // Query to find the document
      homePageData, // The new data to update the document with
      { new: true, upsert: true } // Options: return the updated document, create if it doesn't exist
    );
    res.json({
      status: true,
      versionId: savedHomePage?._id.toString(),
      message: "Homepage data has been updated",
    });
  } catch (error) {
    console.error("Error storing home page data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while storing home page data." });
  }
});

app.post("/api/toggle-latest-portfolio", async (req, res) => {
  try {
    const savedPortfolioVideo = await PortfolioModel.findOne(req.body);
    if (savedPortfolioVideo) {
      savedPortfolioVideo.isLatest = !savedPortfolioVideo.isLatest;
      await savedPortfolioVideo.save();
      res.json(savedPortfolioVideo);
    } else {
      res.json({ message: "Update failed" });
    }
  } catch (error) {
    console.error("Error storing  portfolio video data:", error);
    res.status(500).json({
      error: "An error occurred while storing  portfolio video data.",
    });
  }
});


app.post("/api/toggle-archive-item", async (req, res) => {
  try {
    const savedPortfolioVideo = await PortfolioModel.findOne(req.body);
    if (savedPortfolioVideo) {
      savedPortfolioVideo.isArchive = !savedPortfolioVideo.isArchive;
      await savedPortfolioVideo.save();
      res.json(savedPortfolioVideo);
    } else {
      res.json({ message: "Update failed" });
    }
  } catch (error) {
    console.error("Error storing  portfolio video data:", error);
    res.status(500).json({
      error: "An error occurred while storing  portfolio video data.",
    });
  }
});



app.put("/api/update-portfolio-item", async (req, res) => {
  try {
    const payload = req.body;
    const slug = slugify(payload.desc);
    payload.id = slug;
    payload.href = `/wedding-film?q=${slug}`;
    const savedPortfolioVideo = await PortfolioModel.findOneAndUpdate(
      { _id: payload._id },
      payload,
      { new: true }
    );
    if (savedPortfolioVideo) {
      res.json(savedPortfolioVideo);
    } else {
      res.json({ message: "Update failed" });
    }
  } catch (error) {
    console.error("Error updating  portfolio video data:", error);
    res.status(500).json({
      error: "An error occurred while updating  portfolio video data.",
    });
  }
});

app.post("/api/about-us", async (req, res) => {
  try {
    const aboutUsdata = req.body;
    const savedAboutUsPage = await AboutUsModel.create(aboutUsdata);
    res.json({
      status: true,
      versionId: savedAboutUsPage._id.toString(),
      message: "About us page data was saved",
    });
  } catch (error) {
    console.error("Error storing about us data:", error);
    res.status(500).json({
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
    const savedPackagesPage = await PackageModel.bulkWrite(operations);
    res.json({
      status: true,
      versionId: savedPackagesPage?.toString(),
      message: "Packages page data was saved",
    });
  } catch (error) {
    console.error("Error storing packages data:", error);
    res.status(500).json({
      error: "An error occurred while storing packages data.",
    });
  }
});

app.post("/api/portfolio-videos", async (req, res) => {
  try {
    const portfolioVideoData = req.body;
    const promises = portfolioVideoData.portfolioItems.map(
      async (portFolioVideo) => {
        if (portFolioVideo?.isYoutube) {
          const thumbNailUrl = await addThumbNail(portFolioVideo.videoUrl);
          portFolioVideo.src = thumbNailUrl;
          return portFolioVideo;
        }
        return "";
      }
    );

    const thumbNailedportFolioVideos = await Promise.all(promises);
    portfolioVideoData.portfolioItems = thumbNailedportFolioVideos;
    const savedPortfolioVideo = await PortfolioModel.create(portfolioVideoData);
    res.json(savedPortfolioVideo);
  } catch (error) {
    console.error("Error storing  portfolio video data:", error);
    res.status(500).json({
      error: "An error occurred while storing  portfolio video data.",
    });
  }
});

// Endpoint to handle testimonial submission
app.post("/api/add-testimonials", upload.single("image"), async (req, res) => {
  try {
    const { imageName, testimonialText } = req.body;

    // Save the testimonial in the database
    const newTestimonial = new Testimonials({
      imageName,
      imageSrc: `/uploads/testimonials/${req.file.filename}`, // Use the uploaded image path
      testimonial: testimonialText,
    });

    await newTestimonial.save();

    res.status(201).json({ message: "Testimonial saved successfully" });
  } catch (error) {
    console.error("Error saving testimonial:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/upload-testimonial-image', upload.single('image'), async (req, res) => {
  const testimonialId = req.body._id;
  const newImageUrl = `/uploads/testimonials/${req.file.filename}`;

  // Find the testimonial by ID and update its image URL
  await Testimonials.findByIdAndUpdate(testimonialId, { imageSrc: newImageUrl });

  res.json({ success: true, newImageUrl });
});

app.post('/api/save-testimonials', async (req, res) => {
  const testimonials = req.body;

  try {
    for (let testimonial of testimonials) {
      await Testimonials.findByIdAndUpdate(testimonial._id, testimonial);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save testimonials' });
  }
});

app.post("/api/toggle-archive-testimonial", async (req, res) => {
  try {
    const testimonial = await Testimonials.findOne(req.body);
    if (testimonial) {
      testimonial.isArchive = !testimonial.isArchive;
      await testimonial.save();
      res.json(testimonial);
    } else {
      res.json({ message: "Update failed" });
    }
  } catch (error) {
    console.error("Error storing  archiving testimonial:", error);
    res.status(500).json({
      error: "An error occurred while storing  archiving testimonial.",
    });
  }
});

// Handle the image upload and update banner images
app.post('/api/upload-banner-image', uploadBg.single('image'), async (req, res) => {
  const homePageId = req.body.homePageId;
  const imageUrl = `/uploads/banners/${req.file.filename}`;  // Path to the uploaded image

  try {
    // Assuming HomePageModel is your Mongoose model
    await HomePageModel.findByIdAndUpdate(
      homePageId, 
      { bannerImages: imageUrl },  // Push the new image to bannerImages array
      { new: true }  // Return the updated document
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error saving banner image:', error);
    res.status(500).json({ success: false, error: 'Failed to save banner image' });
  }
});

// Handle the image upload and update banner images
app.post('/api/upload-about-banner-image', uploadBg.single('image'), async (req, res) => {
  const aboutPageId = req.body.aboutPageId;
  const imageUrl = `/uploads/banners/${req.file.filename}`;  // Path to the uploaded image

  try {
    // Assuming HomePageModel is your Mongoose model
    await AboutUsModel.findByIdAndUpdate(
      aboutPageId, 
      { bannerImage: imageUrl },  // Push the new image to bannerImages array
      { new: true }  // Return the updated document
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error saving banner image:', error);
    res.status(500).json({ success: false, error: 'Failed to save banner image' });
  }
});

// Express route to handle the form submission
app.post('/api/add-package', uploadPackages.single('image'), async (req, res) => {
  try {
      const { name, features } = req.body;
      const imageSrc = `/uploads/packages/${req.file.filename}`;

      // Parse features as an array
      const featuresArray = features.split('\n').filter(feature => feature.trim() !== '');

      // Create the package object
      const newPackage = {
          name,
          imageSrc,
          features: featuresArray
      };

      await PackageModel.create(newPackage);

      res.json({ success: true, package: newPackage });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error creating package' });
  }
});

app.post('/api/upload-package-image', uploadPackages.single('image'), async (req, res) => {
  const packageId = req.body._id;
  const newImageUrl = `/uploads/packages/${req.file.filename}`;

  // Find the package by ID and update its image URL
  await PackageModel.findByIdAndUpdate(packageId, { imageSrc: newImageUrl });

  res.json({ success: true, newImageUrl });
});

app.post('/api/save-packages', async (req, res) => {
  const packages = req.body;

  try {
    for (let package of packages) {
      await PackageModel.findByIdAndUpdate(package._id, package);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save packages' });
  }
});

app.post("/api/toggle-archive-package", async (req, res) => {
  try {
    const package = await PackageModel.findOne(req.body);
    if (package) {
      package.isArchive = !package.isArchive;
      await package.save();
      res.json(package);
    } else {
      res.json({ message: "Update failed" });
    }
  } catch (error) {
    console.error("Error storing  archiving package:", error);
    res.status(500).json({
      error: "An error occurred while storing  archiving package.",
    });
  }
});


httpServer.listen(PORT, () => {
  console.log(`Http Server is running on port ${PORT}`);
});

module.exports = app;
