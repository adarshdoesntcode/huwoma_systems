import InputField from "./InputField";
import SearchSelect from "./SearchSelect";
import InputArea from "./InputArea";

function FormItems({ type, props }) {
  switch (type) {
    case "input":
      return <InputField {...props} />;
    case "searchSelect":
      return <SearchSelect {...props} />;
    case "inputArea":
      return <InputArea {...props} />;
    default:
      return null;
  }
}

export default FormItems;
