const { Pizza } = require("../models");

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      .populate({
        path: "comments",
        // use the select option inside of populate(),
        // to tell Mongoose that we don't care about the __v field on comments
        // minus sign - in front of the field indicates that we don't want it to be returned
        // If we didn't have the - , it would mean that it would return only the __v field
        select: "-__v",
      })
      .select("-__v")
      // use .sort({ _id: -1 }) to sort in DESC order by the _id value
      // This gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) {
    // {params} - destructure the params out of the Express.js req object
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza
  createPizza({ body }, res) {
    // {body} - destructure the body out of the Express.js req object
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },

  // update pizza by id
  updatePizza({ params, body }, res) {
    // { params, body } - destructure the params & body out of the Express.js req object
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      // If we don't set that third parameter, { new: true }, it will return the original document.
      // By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    // {params} - destructure the params out of the Express.js req object
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
