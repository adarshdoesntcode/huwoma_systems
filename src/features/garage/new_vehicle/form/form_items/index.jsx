import InputField from "./InputField";
import SearchSelect from "./SearchSelect";
import InputArea from "./InputArea";
import { SearchMultiSelect } from "./SearchMultiSelect";
import { MultiInputField } from "./MultiInputField";

function FormItems({ type, props }) {
  switch (type) {
    case "input":
      return <InputField {...props} />;
    case "multiInput":
      return <MultiInputField {...props} />;
    case "searchSelect":
      return <SearchSelect {...props} />;
    case "searchMultiSelect":
      return <SearchMultiSelect {...props} />;
    case "inputArea":
      return <InputArea {...props} />;
    default:
      return null;
  }
}

export default FormItems;
