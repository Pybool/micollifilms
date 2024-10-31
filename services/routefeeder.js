const AboutUsModel = require("../models/aboutusPage.model");
const HomePageModel = require("../models/homePage.model");
const PackageModel = require("../models/packages.model");
const PortfolioModel = require("../models/portFolio.model");
const Testimonials = require("../models/testimonial.model");
class RouteFeeder {
  static async getTestimonialsContext(req) {
    try {
      let testimonials = [];
      if (req?.user) {
        testimonials = await Testimonials.find();
      } else {
        testimonials = await Testimonials.find({ isArchive: false });
      }

      return JSON.parse(JSON.stringify(testimonials));
    } catch (error) {
      return [];
    }
  }

  static async getHomepageContext(req) {
    let homePageContext = await HomePageModel.findOne({});
    homePageContext = JSON.parse(JSON.stringify(homePageContext));
    if (!homePageContext) {
      return {
        status: false,
        message: "No homepage data has been configured",
      };
    }
    let latestFromPortFolioVideos = [];
    if (req?.user) {
      latestFromPortFolioVideos = await PortfolioModel.find({});
    } else {
      latestFromPortFolioVideos = await PortfolioModel.find({
        isLatest: true,
        isArchive: false,
      });
    }

    homePageContext.latestFromPortFolioVideos = latestFromPortFolioVideos;
    homePageContext.testimonials = await RouteFeeder.getTestimonialsContext(req);

    return homePageContext;
  }

  static async updateHomepageContext() {
    const homePageContext = await HomePageModel.findOne({});
    if (!homePageContext) {
      return {
        status: false,
        message: "No homepage data has been configured",
      };
    }
    homePageContext;
    return homePageContext;
  }

  static async getAboutUsPageContext() {
    let aboutUsPageContext = await AboutUsModel.findOne({});
    const aboutUs = await HomePageModel.findOne({});
    if (!aboutUsPageContext) {
      return {
        status: false,
        message: "No about us data has been configured",
      };
    }
    aboutUsPageContext = JSON.parse(JSON.stringify(aboutUsPageContext));
    aboutUsPageContext.text = aboutUs.aboutUsText;
    return aboutUsPageContext;
  }

  static async getPortFolioPageContext() {
    const portFolioPageContext = await PortfolioModel.find({});
    if (!portFolioPageContext) {
      return {
        status: false,
        message: "No portfolio data has been configured",
      };
    }
    return JSON.parse(JSON.stringify(portFolioPageContext));
  }

  static async getPackagesPageContext(req) {
    let packagesPageContext = [];
    if (req?.user) {
      packagesPageContext = await PackageModel.find({});
    } else {
      packagesPageContext = await PackageModel.find({ isArchive: false });
    }

    return packagesPageContext;
  }
}

module.exports = RouteFeeder;
