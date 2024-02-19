import { Task } from "../lib/types";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";

function TaskBox(props: Task) {
  const date = new Date(props.due_date);

  const handleDelete = async () => {
    return await axios.delete(
      `http://localhost:8000/api/tasks/${props.taskid}`
    );
    // console.log(props.taskid);
  };

  const handleComplete = async () => {
    if (props.complete == false) {
      return await axios.patch(
        `http://localhost:8000/api/tasks/${props.taskid}`,
        { complete: true }
      );
    } else {
      return await axios.patch(
        `http://localhost:8000/api/tasks/${props.taskid}`,
        { complete: false }
      );
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-3/4 pl-5 pr-5 mb-5 lg:pl-2 lg:pr-2 p-14">
      <div className="bg-white rounded-lg m-h-64 p-2 transform hover:translate-y-2 hover:shadow-xl transition duration-300">
        <figure className="mb-2 opacity-20">
          <CircleIcon></CircleIcon>
        </figure>
        <div className="rounded-lg p-4 bg-blue-500 flex flex-col">
          <div>
            <h5 className="text-white text-2xl font-bold leading-none">
              {date.toDateString()}
            </h5>
            <span className="text-xs text-gray-200 leading-none">
              {props.task_description}
            </span>
          </div>
          <div className="flex  items-center my-4">
            <button
              onClick={handleDelete}
              className="rounded-fullbg-blue-600 text-white hover:bg-white hover:text-blue-900 hover:shadow-xl focus:outline-none w-10 h-10 flex m-auto transition duration-300 justify-center items-center"
            >
              <DeleteIcon />
            </button>
            <button
              onClick={handleComplete}
              className={`rounded-fullbg-blue-600 ${
                props.complete
                  ? "text-green-500  hover:bg-red-600 hover:text-blue-900 "
                  : "text-white hover:bg-white hover:text-blue-900 "
              }  hover:shadow-xl focus:outline-none w-10 h-10 flex m-auto transition duration-300 justify-center items-center `}
            >
              <DoneIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskBox;
