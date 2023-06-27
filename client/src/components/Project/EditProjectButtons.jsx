import React from "react";

const EditProjectButtons = ({
  setEditMode,
  createBugMode,
  setBugMode,
  project,
}) => {
  return (
    <div className="flex mobile-column">
      <button className="button-primary" onClick={() => setEditMode(true)}>
        Edit Project
      </button>
      <button
        className="button-secondary"
        disabled={createBugMode}
        onClick={() => setBugMode(true)}
      >
        Add New Bug
      </button>
      <a
        href={`/projects/${project._id}/managemembers`}
        className="button-secondary"
      >
        Manage Members
      </a>
    </div>
  );
};

export default EditProjectButtons;