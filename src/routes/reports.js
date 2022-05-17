const reports = require("../controllers/reports/index");

const addRoutes = (router) => {
    router.post(
        "/reports/exceed-threshold",
        reports.exceedThresholdController
    );
}

module.exports = { addRoutes }
