import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Button,
} from "react-native";
import { useQuery, useMutation, gql, useLazyQuery } from "@apollo/client";
import { useRoute } from "@react-navigation/native";

import ToDoItem from "../components/ToDoItem";

import { Text, View } from "../components/Themed";



const DELETE_TODO = gql`
  mutation deleteToDo($id: ID!) {
    deleteToDo(id: $id) {
    id
    isDeleted
    }
  }
`;

const GET_PROJECT = gql`
  query getTasklist($id: ID!) {
    getTaskList(id: $id) {
      id
      title
      createdAt
      todos {
        id
        content
        isCompleted
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation createToDo($content: String!, $taskListId: ID!) {
    createToDo(content: $content, taskListId: $taskListId) {
      id
      content
      isCompleted

      taskList {
        id
        progress
        todos {
          id
          content
          isCompleted
        }
      }
    }
  }
`;

let id = "4";

export default function ToDoScreen() {

  const [project, setProject] = useState<any>(null);
  const [title, setTitle] = useState("");

  const route = useRoute();
  const id = route.params.id;

  // const { data, error, loading } = useQuery(GET_PROJECT, { variables: { id } });
  const [getProjectData, { called,loading, error, data }] = useLazyQuery(
    GET_PROJECT,
    { variables: { id } }
  );
  
  const [createTodo, { data: createTodoData, error: createTodoError }] =
  useMutation(CREATE_TODO, { refetchQueries: GET_PROJECT });
  const [deleteItem, { data: deleteTodoData,loading:deleteLoading, error: deleteTodoError }] = useMutation(DELETE_TODO,{ refetchQueries: GET_PROJECT});
  
  useEffect(() => {
    if (error) {
      console.log(error);
      Alert.alert("Error fetching project", error.message);
    }
  }, [error]);
  
  useEffect(() => {
    getProjectData()
    if (called&&!loading&&!error&&data) {
      setProject(data.getTaskList);
      setTitle(data.getTaskList.title);
    }
  }, [data]);
  
  const createNewItem = () => {
    if (todo.length == 0) return;
    createTodo({
      variables: {
        content: todo,
        taskListId: id,
      },
    });
    setTodo(""); //clear after submit
  };
  const handleDeleteItem = (id?:string) => {
    console.log("delete pressed",id);
    const delItem = deleteItem({
      variables: {
        id: id,
      },
    });
    getProjectData()
    if(!loading&&data)
    {
      console.log("after delete call");
      
    }
    // console.log("delItem",delItem);
    
  };
  const [todo, setTodo] = useState("");
  const handleTodoChange = () => {
    setTodo(todo);
  };
  useEffect(() => {
    handleTodoChange();
  }, [todo]);
  if (!project) {
    return null;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <TextInput
          value={title}
          onChangeText={handleTodoChange}
          placeholder={"Title"}
          style={styles.title}
        />
        <View style={styles.addTodo}>
          <TextInput
            style={styles.addTodoInput}
            onChangeText={setTodo}
            value={todo}
            placeholder="enter new todo"
          />
          <Button 
          // style={styles.addTodoBtn} 
          title="Add new todo" 
          onPress={() => createNewItem()} />
        </View>
        <FlatList
          data={project.todos}
          renderItem={({ item, index }) => (
            <ToDoItem todo={item} onSubmit={() => createNewItem()} handleDeleteItem={handleDeleteItem} />
          )}
          style={{ width: "100%" }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  title: {
    width: "100%",
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginBottom: 12,
  },
  addTodo:{
    flexDirection: "row" ,
    justifyContent:"space-between",
  },
  addTodoInput: {
    flex:1,
    fontSize: 17,
    color: "black",
  },
  addTodoBtn:{
    flex:1
  }
});
