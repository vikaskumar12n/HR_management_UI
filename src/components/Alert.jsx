
// eslint-disable-next-line react/prop-types
const Alert = ({ message, type }) => {
  return message ? <div className={`alert alert-${type}`}>{message}</div> : null;
};

export default Alert;
