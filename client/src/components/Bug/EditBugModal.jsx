import Input from "../Shared/GeneralInput";
import TextArea from "../Shared/TextArea";
import Select from "../Shared/Select";
import dayjs from "dayjs";
import Buttons from "../Shared/Buttons";
import { statusList, priorities } from "../../constants/ticket";

const EditTicketModal = ({
  updatedBug,
  handleInputChange,
  reset,
  users,
  index,
  handleSubmit,
}) => {
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h1>Edit Ticket</h1>
        <Input
          value={updatedBug.title}
          onChange={handleInputChange}
          id={"title"}
          label={"Title"}
        />

        <TextArea
          label={"Description"}
          value={updatedBug.description}
          onChange={handleInputChange}
          id={"description"}
        />
        <label htmlFor="assignedTo">Assigned To: </label>
        <select name="assignedTo" value={index} onChange={handleInputChange}>
          <option value={-1}>Not Assigned</option>
          {users.map((user) => {
            return (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            );
          })}
        </select>
        <Select
          label={"Priority"}
          id={"priority"}
          value={updatedBug.priority}
          onChange={handleInputChange}
          listofOptions={priorities}
          placeholder={"Select a priority"}
          disablePlaceholder={true}
        />
        <Select
          label={"Status"}
          id={"status"}
          value={updatedBug.status}
          onChange={handleInputChange}
          listofOptions={statusList}
          placeholder={"Select a status"}
          disablePlaceholder={true}
        />
        <Input
          value={dayjs(updatedBug.deadline).format("YYYY-MM-DD")}
          onChange={handleInputChange}
          label={"Deadline"}
          type="date"
          id="deadline"
        />
        <Buttons
          secondary={"Cancel"}
          secondaryFunction={reset}
          submit={"Submit"}
        />
      </form>
    </div>
  );
};

export default EditTicketModal;
