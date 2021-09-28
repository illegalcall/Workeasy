import pkg from "mongodb";
const { ObjectID } = pkg;
const TaskList = {
  id: ({ _id, id }) => _id || id,
  progress: async ({ _id }, _, { db }) => {
    const todos = await db
      .collection("ToDo")
      .find({ taskListId: ObjectID(_id) })
      .toArray();
    const completed = todos.filter((todo) => todo.isCompleted);

    if (todos.length === 0) {
      return 0;
    }

    return (100 * completed.length) / todos.length;
  },
  users: async ({ userIds }, _, { db }) =>
    Promise.all(
      userIds.map((userId) => db.collection("Users").findOne({ _id: userId }))
    ),
  todos: async ({ _id }, _, { db }) =>
    await db
      .collection("ToDo")
      .find({ taskListId: ObjectID(_id) })
      .toArray(),
};
export default TaskList;
