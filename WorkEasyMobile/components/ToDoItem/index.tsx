import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Text } from "react-native";
import { useMutation, gql, useQuery } from "@apollo/client";
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

interface ToDoItemProps {
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  };
  onSubmit: () => void;
  handleDeleteItem:(id?:string)=>void
}


const ToDoItem = ({ todo, onSubmit,handleDeleteItem }: ToDoItemProps) => {
  const [isChecked, setIsChecked] = useState<any>(false);
  const [content, setContent] = useState<string|null>("");
  
  const [updateItem] = useMutation(UPDATE_TODO);
  // const =useQuery(GET_TODO)
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
  

  useEffect(() => {
    if (todo&&todo.content) {
      setIsChecked(todo.isCompleted);
      setContent(todo.content);
    }
    //initial setting

    
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
    // <View>
    content?(
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
          // onPress={() => {
          //   callUpdateItem();
          // }}
        >
          {content}
        </Text>
  
        {/**delete icon */}
        <AntDesign
          name="delete"
          size={24}
          color="black"
          onPress={() => {
            console.log("step1");
            console.log(todo.id);
            
            
            handleDeleteItem(todo.id)
            // callUpdateItem();

          }}
        />
      </View>):null
      // </View>
    
  );
}
;

export default ToDoItem;
