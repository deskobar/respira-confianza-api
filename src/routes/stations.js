const authController = require("../controllers/auth");
const stationController = require("../controllers/station");
const applicationStationController = require("../controllers/application/station")

const addRoutes = (router) => {
  router.get(
    "/stations",
    authController.isAuthenticated,
    stationController.getStations
  );
  router.get(
    "/stations/:id",
    authController.isAuthenticated,
    stationController.getStation
  );
  router.post(
    "/stations/new",
    authController.isAuthenticated,
    stationController.newStation
  );
  router.put(
    "/stations/:id",
    authController.isAuthenticated,
    stationController.editStation
  );
  router.delete(
    "/stations/:id",
    authController.isAuthenticated,
    stationController.deleteStation
  );

  //APP 
  router.get(
    "/stations/:id/status",
    applicationStationController.stationStatus
  );

  router.get(
    "/stations/search",
    applicationStationController.searchStations,
  );

  router.get(
    "/stations/status/:pollutant",
    applicationStationController.stationStatusByPollutant,
  );
}

module.exports = { addRoutes }