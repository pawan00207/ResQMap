const nearbyResourcesRoute = require("./routes/nearbyResources");
const metricsRoutes = require("./routes/metricsRoutes");
const searchRoutes = require("./routes/searchRoutes");

app.use("/api", nearbyResourcesRoute);
app.use("/api", metricsRoutes);
app.use("/api", searchRoutes);