import { Footer, Header, TodoCollection, TodoInput } from 'components';
import { useEffect, useState } from 'react'; 
import { getTodos, createTodo, patchTodo, deleteTodo } from 'api/todos';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const TodoPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState([]);
  const todoNums = todos.length; //todoNums數目
  const navigate = useNavigate();
  const { isAuthenticated, currentNumber } = useAuth();

  const handleChange = (value) => {
    setInputValue(value);
  };

  // 監聽器
 const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };
  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleDone = async (id) => {
   const currentTodo = todos.find((todo) => todo.id === id);
   try {
    await patchTodo({
      id,
      isDone: !currentTodo.isDone,
    });
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isDone: !todo.isDone,
          };
        }
        return todo;
      });
    });
   } catch (error) {
    console.error(error);
   }
};


  const handleChangeMode = ({ id, isEdit}) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }
        return {...todo, isEdit: false }; //其他沒有被觸發到的，就不會是編輯模式
      });
    });
  }

  const handleSave = async ({ id, title }) => {
    try {
      await patchTodo({
        id,
        title,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, title, isEdit: false };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

   useEffect(() => {
     const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, 
          isEdit: false })));
        } catch (error) {
          console.error (error);
        }
      };
      getTodosAsync();
     }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [navigate, isAuthenticated]);    

  return (
    <div>
      TodoPage
      <Header username={currentNumber?.name} />
      <TodoInput
        inputValue={inputValue} 
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos} 
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Footer numOfTodos={todoNums} />
    </div>
  );
};

export default TodoPage;