const nearbyResourcesRoute = require("./routes/nearbyResources");
const metricsRoutes = require("./routes/metricsRoutes");

app.use("/api", nearbyResourcesRoute);
app.use("/api", metricsRoutes);