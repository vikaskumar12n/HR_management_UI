

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      className="form-control my-3"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;
