const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// // Remove room from all users upon deletion
// roomSchema.pre('remove', async function (next) {
//     const User = mongoose.model('User');
//     try {
//       await User.updateMany(
//         { rooms: this._id },
//         { $pull: { rooms: this._id } }
//       );
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });



module.exports = mongoose.model("Room", roomSchema);