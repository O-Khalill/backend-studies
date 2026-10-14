export const create = ({ model, data }) => model.create(data);

export const findOne = ({ model, filter = {}, select, options = {} }) =>
  model.findOne(filter, select, options);

export const updateOne = ({ model, filter = {}, updates, options = {} }) =>
  model.updateOne(filter, updates, options);

export const findById = ({ model, id, select, options = {} }) =>
  model.findById(id, select, options);

export const findOneAndUpdate = ({ model, filter = {}, updates = {} }) =>
  model.findOneAndUpdate(filter, updates, {
    returnDocument: "after",
    runValidators: true,
  });

export const findOneAndDelete = ({ model, filter = {} }) =>
  model.findOneAndDelete(filter);
