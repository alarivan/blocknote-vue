import Datastore from "nedb-promises";

export default Datastore.create({
  filename: "notes.db",
  autoload: true,
  timestampData: true
});
