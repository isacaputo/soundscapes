import React from "react";
import PropTypes from "prop-types";

export const NoteButton = ({ note, isActive, onClick }) => {
  return (
    <div className={`note ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="text">
        <strong>{note}</strong>
      </div>
    </div>
  );
};

NoteButton.propTypes = {
  note: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
