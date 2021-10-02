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
    console.log("get task list");
    return await db.collection("TaskList").findOne({ _id: ObjectID(id) });
  },
  getTodo: async (_, { id }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }
    console.log('corrent resolver');
    const toDo=await db.collection("ToDo").findOne({ _id: ObjectID(id) })
    if(toDo)
      return toDo 
    //else? 
    //return ;
  },
};
export default Query;
