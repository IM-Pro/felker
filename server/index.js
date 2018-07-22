const app = require("express")();
const sessionSetup = require("./startup/session");
const logger = require("./startup/logging");

const port = process.env.PORT || 3000;

process.on("unhandledRejection", ex => {
  console.log(`unhandledRejection!!!`, ex);
  throw new Error(`Unhandle rejection: ${ex}`);
});

process.on("uncaughtException", ex => {
  console.log(`uncaughtException!!! `, ex);
  throw new Error(`Unhandle rejection: ${ex}`);
});

exports.run = async () => {
  require("./startup/static")(app);
  require("./startup/logging");
  require("./startup/view-template")(app);

  try {
    await sessionSetup(app);
  } catch (err) {
    console.log(err);
  }

  require("./startup/tools")(app);
  require("./startup/locals")(app);
  require("./startup/routes")(app);
  require("./startup/prod")(app);

  app.use((req, res, next) => {
    res.status(404).render("404");
  });

  app.listen(port, () => {
    logger.verbose(`Server listen on port ${port}`);
  });
};
