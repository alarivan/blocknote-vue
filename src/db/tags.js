import Datastore from "nedb-promises";

export default Datastore.create({
  filename: "tags.db",
  autoload: true
});
