import bcrypt from "bcryptjs";
import pkg from "mongodb";
const { ObjectID } = pkg;
import { getToken } from "../Controllers/Auth.js";
import dotenv from "dotenv";
dotenv.config();

const Mutation = {
  signUp: async (_, { input }, { db }) => {
    const hashedPassword = bcrypt.hashSync(input.password);
    const newUser = {
      ...input,
      password: hashedPassword,
    };

    //TODO: Check if user is already in DB, then dont add

    // save to database
    const result = await db.collection("Users").insertOne(newUser);
    const user = result.ops[0];
    const token = getToken(user);
    console.log("token", token);
    return {
      user,
      token,
    };
  },

  signIn: async (_, { input }, { db }) => {
    console.log("hello");
    const user = await db.collection("Users").findOne({ email: input.email });
    console.log("user", user);
    const isPasswordCorrect =
      user && bcrypt.compareSync(input.password, user.password);

    if (!user || !isPasswordCorrect) {
      throw new Error("Invalid credentials!");
    }

    return {
      user,
      token: getToken(user),
    };
  },

  createTaskList: async (_, { title }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    const newTaskList = {
      title,
      createdAt: new Date().toISOString(),
      userIds: [user._id],
    };
    const result = await db.collection("TaskList").insertOne(newTaskList);
    return result.ops[0];
  },

  updateTaskList: async (_, { id, title }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    const result = await db.collection("TaskList").updateOne(
      {
        _id: ObjectID(id),
      },
      {
        $set: {
          title,
        },
      }
    );

    return await db.collection("TaskList").findOne({ _id: ObjectID(id) });
  },

  addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    const taskList = await db
      .collection("TaskList")
      .findOne({ _id: ObjectID(taskListId) });
    if (!taskList) {
      return null;
    }

    //If the user already is in the taskList, then dont add
    if (
      taskList.userIds.find((dbId) => dbId.toString() === userId.toString())
    ) {
      return taskList;
    }
    await db.collection("TaskList").updateOne(
      {
        _id: ObjectID(taskListId),
      },
      {
        $push: {
          userIds: ObjectID(userId),
        },
      }
    );
    taskList.userIds.push(ObjectID(userId));
    return taskList;
  },

  deleteTaskList: async (_, { id }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    // TODO only collaborators of this task list should be able to delete
    await db.collection("TaskList").removeOne({ _id: ObjectID(id) });

    return true;
  },

  // ToDo Items
  createToDo: async (_, { content, taskListId }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }
    const newToDo = {
      content,
      taskListId: ObjectID(taskListId),
      isCompleted: false,
    };
    const result = await db.collection("ToDo").insertOne(newToDo);
    return result.ops[0];
  },

  updateToDo: async (_, data, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    const result = await db.collection("ToDo").updateOne(
      {
        _id: ObjectID(data.id),
      },
      {
        $set: data,
      }
    );

    return await db.collection("ToDo").findOne({ _id: ObjectID(data.id) });
  },

  deleteToDo: async (_, { id }, { db, user }) => {
    if (!user) {
      throw new Error("Authentication Error. Please sign in");
    }

    // TODO only collaborators of this task list should be able to delete
    await db.collection("ToDo").removeOne({ _id: ObjectID(id) });

    return true;
  },
};
export default Mutation;
