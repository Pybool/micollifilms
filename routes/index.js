const express = require("express");
const data = require("./services");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const indexControllers = require("../controllers/index");
const RouteFeeder = require("../services/routefeeder");
const auth = require("../middlewares/auth");

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

router.get("/", auth.authMiddleware, async (req, res, next) => {
  res.render("pages/index", {
    pageTitle: "Home",
    motto: "~ Capturing Imaginations",
    context: await RouteFeeder.getHomepageContext(req),
    user: req.user, // Pass req.user to the template
  });
});


router.get("/check-login", async (req, res, next) => {
  return res.json(await auth.checkLogin(req, res, next))
});



router.get("/login", async (req, res, next) => {
  res.render("pages/login", {
    pageTitle: "Login",
    motto: "Admin Login",
    user: req.user, // Pass req.user to the template
  });
});

router.get("/testimonials", auth.authMiddleware, async (req, res, next) => {
  res.render("pages/testimonials", {
    pageTitle: "Testimonials",
    motto: "",
    user: req.user, // Pass req.user to the template
    context: { testimonials: await RouteFeeder.getTestimonialsContext(req) },
  });
});

router.get("/fetchbannerImages", async (req, res, next) => {
  const homeContext = await RouteFeeder.getHomepageContext();
  res.send({ bannerImages: homeContext.bannerImages });
});

router.get("/about-us", auth.authMiddleware, async (req, res, next) => {
  res.render("pages/about", {
    pageTitle: "About Us",
    motto: "",
    user: req.user, // Pass req.user to the template
    context: await RouteFeeder.getAboutUsPageContext(),
  });
});

router.get(
  "/wedding-films-collection",
  auth.authMiddleware,
  async (req, res, next) => {
    res.render("pages/portfolio", {
      pageTitle: "Wedding Films",
      motto: "",
      user: req.user, // Pass req.user to the template
      wfcContext: {
        portfolioItems: await RouteFeeder.getPortFolioPageContext(),
      },
    });
  }
);

router.get("/packages", auth.authMiddleware, async (req, res, next) => {
  res.render("pages/packages", {
    pageTitle: "packages",
    motto: "",
    user: req.user, // Pass req.user to the template
    context: await RouteFeeder.getPackagesPageContext(req),
  });
});

router.get("/wedding-film", async (req, res, next) => {
  const filter = req.query.q;

  const portFolioContext = await RouteFeeder.getPortFolioPageContext();
  res.render("pages/portfolioItem", {
    pageTitle: "portfolio",
    motto: "",
    context: data.filterById(
      portFolioContext,
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

router.post("/api/login", async (req, res) => {
  await auth.login(req, res);
});


router.get("/api/logout", async (req, res) => {
  return res.json({data: await auth.logout(req, res)});
});

router.post("/api/register", async (req, res) => {
  await auth.register(req, res);
});

// router.post(
//   "/api/v1/append-signature",
//   upload.single("signature"),
//   indexControllers.appendApplicationSignature
// );

module.exports = router;
