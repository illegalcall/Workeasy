import pkg from "mongodb";
const { ObjectID } = pkg;

const ToDo = {
  id: ({ _id, id }) => _id || id,
  taskList: async ({ taskListId }, _, { db }) =>
    await db.collection("TaskList").findOne({ _id: ObjectID(taskListId) }),
};
export default ToDo;
