"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Task } from "../lib/types";
import TaskBox from "../components/TaskBox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Modal } from "../components/Modal";
import CreateTaskForm from "../components/CreateTaskForm";
import CloseIcon from "@mui/icons-material/Close";

function Home({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();
  const handleLogout = async () => {
    router.push(`/`);
    const response = await axios.get("http://localhost:8000/api/users/logout");
  };

  const completeTask: Task[] = tasks.filter(
    (task: Task) => task.complete === true
  );

  const completeDataItems = completeTask.map((task: Task) => (
    <TaskBox
      key={task.taskid}
      taskid={task.taskid}
      task_description={task.task_description}
      due_date={task.due_date}
      complete={task.complete}
    />
  ));

  const arrayDataItems = tasks
    .filter((task: Task) => task.complete === false)
    .map((task: Task) => (
      <TaskBox
        key={task.taskid}
        taskid={task.taskid}
        task_description={task.task_description}
        due_date={task.due_date}
        complete={task.complete}
      />
    ));

  useEffect(() => {
    const getTasks = async () => {
      const response = await axios.get(
        `http://localhost:8000/api/users/mytasks/${params.id}`
      );

      setTasks(response.data.tasks);
    };
    getTasks();
  }, [tasks]);

  const [isActive, setisActive] = useState(false);
  const handleActive = () => {
    if (isActive == false) {
      setisActive(true);
    } else {
      setisActive(false);
    }
    console.log(isActive);
  };
  return (
    <>
      <div>
        {isActive && (
          <Modal>
            <div className={`${"bg-blue-500 p-10"}`}>
              <div className="flex justify-end">
                <button onClick={handleActive}>
                  <CloseIcon className="text-white" />
                </button>
              </div>

              <CreateTaskForm id={params.id} />
            </div>
          </Modal>
        )}
      </div>

      <div className="flex justify-end m-3 ">
        <button
          onClick={handleLogout}
          className="bg-blue-500 p-6 rounded text-white hover:bg-blue-700 "
        >
          Logout
        </button>

        <button
          onClick={handleActive}
          className="bg-blue-500 p-6 rounded text-white hover:bg-blue-700 mx-4"
        >
          New
        </button>
      </div>

      <div className="grid grid-cols-5">{arrayDataItems}</div>

      <h1 className="text-white bg-blue-600 font-bold mb-6 p-5">
        COMPLETED TASKS
      </h1>

      <div className="grid grid-cols-5">{completeDataItems}</div>
    </>
  );
}

export default Home;
