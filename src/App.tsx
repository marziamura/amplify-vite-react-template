
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


import { Authenticator } from '@aws-amplify/ui-react'
import { uploadData } from 'aws-amplify/storage';
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  const [file, setFile] = useState<File>();
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    const selectedFile = (event.target as HTMLInputElement).files;
    if (selectedFile)
      setFile(selectedFile[0]);
  };

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
        
    <Authenticator>
      {({ signOut, user }) => (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        <div>
      <input type="file" onChange={handleChange} />
      <button
          onClick={() =>
            uploadData({
              path: `profile-pictures/${file?.name}`,
              data: file || "",
          })
        }
      >
        Uploadfile
      </button>
      </div>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
        
      )}
      </Authenticator>
  );
}

export default App;
