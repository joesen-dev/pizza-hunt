const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // every time we retrieve a pizza, the value in the createdAt field will be formatted by the dateFormat() function
      // and used instead of the default timestamp value
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      required: true,
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
      default: "Large",
    },
    toppings: [],
    comments: [
      {
        // tell Mongoose to expect an ObjectId
        // and to tell it that its data comes from the Comment model
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      // tell the Mongoose model that it should use any getter function we've specified
      getters: true,
    },
    id: false,
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  // update the pizza's virtual commentCount so that it includes all replies
  // use the .reduce() method to tally up the total of every comment with its replies
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
  // return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;
