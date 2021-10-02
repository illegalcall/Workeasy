import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Text } from "react-native";
import { useMutation, gql } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";

import Checkbox from "../Checkbox";

const UPDATE_TODO = gql`
  mutation updateToDo($id: ID!, $content: String, $isCompleted: Boolean) {
    updateToDo(id: $id, content: $content, isCompleted: $isCompleted) {
      id
      content
      isCompleted

      taskList {
        title
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

const DELETE_TODO = gql`
  mutation deleteToDo($id: ID!) {
    deleteToDo(id: $id) {
        id
      }
    }
  }
`;

interface ToDoItemProps {
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  };
  onSubmit: () => void;
}

const ToDoItem = ({ todo, onSubmit }: ToDoItemProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [content, setContent] = useState("");

  const [updateItem] = useMutation(UPDATE_TODO);
  const [deleteItem] = useMutation(DELETE_TODO);
  const input = useRef(null);

  const callUpdateItem = () => {
    updateItem({
      variables: {
        id: todo.id,
        content,
        isCompleted: isChecked,
      },
    });
  };
  const handleDeleteItem = () => {
    deleteItem({
      variables: {
        id: todo.id,
      },
    });
  };
  useEffect(() => {
    if (!todo) {
      return;
    }

    setIsChecked(todo.isCompleted);
    setContent(todo.content);
  }, [todo]);

  useEffect(() => {
    if (input.current) {
      input?.current?.focus();
    }
  }, [input]);

  const onKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Backspace" && content === "") {
      // Delete item
      console.warn("Delete item");
    }
  };

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}
    >
      {/* Checkbox */}
      <Checkbox
        isChecked={isChecked}
        onPress={() => {
          setIsChecked(!isChecked);
          callUpdateItem();
        }}
      />

      {/* Text Input */}
      <Text
        style={{
          flex: 1,
          fontSize: 18,
          color: "black",
          marginLeft: 12,
        }}
      >
        {content}
      </Text>

      {/**delete icon */}
      <AntDesign
        name="delete"
        size={24}
        color="black"
        onPress={() => handleDeleteItem()}
      />
    </View>
  );
};

export default ToDoItem;
