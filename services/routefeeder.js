const AboutUsModel = require("../models/aboutusPage.model");
const HomePageModel = require("../models/homePage.model");
const PackageModel = require("../models/packages.model");
const PortfolioModel = require("../models/portFolio.model");

class RouteFeeder{

    static async getHomepageContext(){
        const homePageContext = await HomePageModel.findOne({});
        if(!homePageContext){
            return {
                status: false,
                message: "No homepage data has been configured"
            }
        }
        return homePageContext;
    }

    static async getAboutUsPageContext(){
        const aboutUsPageContext = await AboutUsModel.findOne({});
        if(!aboutUsPageContext){
            return {
                status: false,
                message: "No about us data has been configured"
            }
        }
        return aboutUsPageContext;
    }

    static async getPortFolioPageContext(){
        const portFolioPageContext = await PortfolioModel.findOne({});
        if(!portFolioPageContext){
            return {
                status: false,
                message: "No portfolio data has been configured"
            }
        }
        return portFolioPageContext;
    }

    static async getPackagesPageContext(){
        const packagesPageContext = await PackageModel.find({});
        if(!packagesPageContext){
            return {
                status: false,
                message: "No packages data has been configured"
            }
        }
        return packagesPageContext;
    }
}

module.exports = RouteFeeder;