import { useRef, useState } from "react";
import Button from "../Buttons/Button";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { PiImages } from "react-icons/pi";
import "./Main.css";

function Main() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [showTasks, setShowTasks] = useState(false);
  const [inputIsEmpty, setInputIsEmpty] = useState(true);
  const [completeTask, setCompleteTask] = useState([]);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef("");

  const saveTodo = () => {
    if (input.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        text: input,
        date: new Date(),
        fileUrl: fileUrl,
      };
      setTodos([...todos, newTodo]);
      setInput("");
      setFile(null);
      setFileUrl(null); 
      setInputIsEmpty(false);
    } else {
      setInputIsEmpty(true);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile)); 
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const deleteTodo = (todo) => {
    setTodos(todos.filter((item) => item.id !== todo.id));
    setCompleteTask(completeTask.filter((task) => task.id !== todo.id));
  };

  const editTodo = (todo) => {
    setInput(todo.text);
    setFileUrl(todo.fileUrl || null); 
    inputRef.current.value = todo.text;
    deleteTodo(todo);
  };

  const toggleCompleteTask = (e, todo) => {
    if (e.target.checked) {
      setCompleteTask([...completeTask, todo]);
    } else {
      setCompleteTask(completeTask.filter((task) => task.id !== todo.id));
    }
  };

  const toggleShowCompletedTasks = (e) => {
    setShowTasks(e.target.checked);
  };

  return (
    <main>
      <section>
        <div className="input-container">
          <input
            type="text"
            placeholder="Your tasks"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
          />
          <div className="file-div">
            <input type="file" onChange={handleFileUpload} />
          </div>
          {inputIsEmpty && (
            <p className="input-message">
              Please fill in the input field before saving your todo.
            </p>
          )}
        </div>
        <div className="save-btn">
          <Button text="Save" onclick={saveTodo} />
        </div>
      </section>

      <div className="checkBox-sec">
        <input
          style={{ accentColor: "#4caf50" }}
          type="checkbox"
          id="showCompleteCheckbox"
          onChange={toggleShowCompletedTasks}
        />
        <label htmlFor="showCompleteCheckbox">Show Completed Tasks</label>
      </div>

      <div className="todo-sec">
        {(showTasks ? completeTask : todos).map((todo) => {
          const isComplete = completeTask.some((task) => task.id === todo.id);
          return (
            <div key={todo.id} className="todo">
              <div className="textarea">
                <input
                  style={{ accentColor: "#4caf50" }}
                  type="checkbox"
                  checked={isComplete}
                  onChange={(e) => toggleCompleteTask(e, todo)}
                />
                <span
                  style={{
                    textDecoration: isComplete ? "line-through" : "none",
                    textDecorationThickness: isComplete ? "2px" : "",
                  }}
                >
                  {todo.text}
                </span>
              </div>
              <div className="todo-btn">
                {todo.fileUrl && (
                  <Button
                    text={<PiImages />}
                    onclick={() => {
                      setFileUrl(todo.fileUrl);
                      openModal();
                    }}
                  />
                )}

                <Button text={<MdDelete />} onclick={() => deleteTodo(todo)} />
                <Button text={<CiEdit />} onclick={() => editTodo(todo)} />
              </div>
            </div>
          );
        })}
      </div>

      {showModal && fileUrl && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <img src={fileUrl} alt="Preview" className="modal-image" />
          </div>
        </div>
      )}
    </main>
  );
}

export default Main;
