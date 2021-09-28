import pkg from "mongodb";
const { ObjectID } = pkg;
const Query = {
  myTaskLists: async (_, __, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    return await db
      .collection("TaskList")
      .find({ userIds: user._id })
      .toArray();
  },

  getTaskList: async (_, { id }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    return await db.collection("TaskList").findOne({ _id: ObjectID(id) });
  },
};
export default Query;
