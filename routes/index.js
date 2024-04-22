const express = require("express");
const data = require("./services");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const indexControllers = require("../controllers/index");
const RouteFeeder = require("../services/routefeeder");

const router = express.Router();

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join("public", "assets/uploads", getCurrentDate());
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if not exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp as filename
  },
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  console.log("Fire")
  res.render("pages/index", {
    pageTitle: "Home",
    motto: "~ Capturing Imaginations",
    context: await RouteFeeder.getHomepageContext(),
  });
});

router.get("/testimonials", async (req, res, next) => {
  res.render("pages/testimonials", {
    pageTitle: "Testimonials",
    motto: "",
    context: await RouteFeeder.getHomepageContext(),
  });
});

router.get("/fetchbannerImages", async (req, res, next) => {
  const homeContext = await RouteFeeder.getHomepageContext();
  res.send({ bannerImages: homeContext.bannerImages });
});

router.get("/about-us", async (req, res, next) => {
  res.render("pages/about", {
    pageTitle: "About Us",
    motto: "",
    context: await RouteFeeder.getAboutUsPageContext(),
  });
});

router.get("/wedding-films-collection", async (req, res, next) => {
  res.render("pages/portfolio", {
    pageTitle: "Wedding Films",
    motto: "",
    context: await RouteFeeder.getPortFolioPageContext(),
  });
});

router.get("/packages", async (req, res, next) => {
  res.render("pages/packages", {
    pageTitle: "packages",
    motto: "",
    context: await RouteFeeder.getPackagesPageContext(),
  });
});

router.get("/wedding-film", async (req, res, next) => {
  const filter = req.query.q;
  console.log("filter =================> ", filter);

  const portFolioContext = await RouteFeeder.getPortFolioPageContext();
  res.render("pages/portfolioItem", {
    pageTitle: "portfolio",
    motto: "",
    context: data.filterById(
      JSON.parse(JSON.stringify(portFolioContext)).portfolioItems,
      filter
    ),
  });
});

router.get("/contact", (req, res, next) => {
  res.render("pages/contact", {
    pageTitle: "contact Form",
    motto: "",
    content: "",
  });
});

router.post("/api/v1/book-event", indexControllers.bookEvent);

// router.post("/api/v1/submit-application", indexControllers.submitApplication);

// router.get("/api/v1/fetch-application", indexControllers.getApplication);

// router.post(
//   "/api/v1/subscribe-newsletter",
//   indexControllers.subscribeNewsLetter
// );

// router.post(
//   "/api/v1/append-signature",
//   upload.single("signature"),
//   indexControllers.appendApplicationSignature
// );

module.exports = router;
