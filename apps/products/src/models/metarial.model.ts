import mongoose from "mongoose";
import { IMetarial } from "~/interface/models";

const Metarial = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: false,
  },

  is_deleted: {
    type: Boolean,
    required: false,
  },
});

const Metarials = mongoose.model<IMetarial>("Metarial", Metarial);
export default Metarials;
