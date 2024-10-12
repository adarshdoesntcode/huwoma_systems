import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import {
  useCarwashInspectionTemplateQuery,
  useUpdateInspectionTemplateMutation,
} from "../settingsApiSlice";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, CloudFog, PlusCircle, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";

const newCategoryInitialState = {
  categoryName: "",
  items: [],
};
const CarWashInspectionSetting = () => {
  const { data, isLoading, isSuccess, isError, isFetching, error } =
    useCarwashInspectionTemplateQuery();
  const [updateInspectionTemplate] = useUpdateInspectionTemplateMutation();

  const [editing, setEditing] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newItemInput, setNewItemInput] = useState("");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewItemInput, setIsNewItemInput] = useState(false);
  const [newCategory, setNewCategory] = useState(newCategoryInitialState);
  const [formData, setFormData] = useState([]);

  // Handle edit click
  const handleEditClick = (value) => {
    setEditing(value);
    setIsNewCategory(false);
    setFormData(data.data[0].categories);
  };

  // Handle category input change
  const handleCategoryChange = (index, value) => {
    const updatedForm = formData.map((category, categoryIndex) => {
      if (categoryIndex === index) {
        return { ...category, categoryName: value };
      }
      return category;
    });
    setFormData(updatedForm);
  };

  const handleCategoryRemove = (index, value) => {
    const updatedForm = formData.map((category, categoryIndex) => {
      if (categoryIndex !== index) {
        return { ...category, categoryName: value };
      }
      return category;
    });
    setFormData(updatedForm);
  };

  const handleItemChange = (categoryIndex, itemIndex, value) => {
    const updatedForm = formData.map((category, catIdx) => {
      if (catIdx === categoryIndex) {
        const updatedItems = category.items.map((item, itemIdx) => {
          if (itemIdx === itemIndex) {
            return { ...item, itemName: value };
          }
          return item;
        });
        return { ...category, items: updatedItems };
      }
      return category;
    });
    setFormData(updatedForm);
  };

  const handleItemRemove = (categoryIndex, itemIndex) => {
    const updatedForm = formData.map((category, catIdx) => {
      if (catIdx === categoryIndex) {
        const updatedItems = category.items.filter((item, itemIdx) => {
          if (itemIdx !== itemIndex) {
            return item;
          }
        });
        return { ...category, items: updatedItems };
      }
      return category;
    });
    setFormData(updatedForm);
  };

  const handleSave = async () => {
    console.log({ ...newCategory, categoryName: newCategoryInput });
    try {
      setFormData([
        ...formData,
        { ...newCategory, categoryName: newCategoryInput },
      ]);
      setNewCategory(newCategoryInitialState);
      await updateInspectionTemplate({
        templateId: data.data[0]._id,
        categories: formData,
      }).unwrap();
      setEditing(false);
      setIsNewCategory(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = () => {
    setFormData([...formData, { ...newCategory }]);
    setNewCategory(newCategoryInitialState);
  };

  let content;

  if (isLoading || isFetching) {
    content = <Loader />;
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="w-full h-20 text-muted-foreground flex items-center justify-center">
          No Inspection Template
        </div>
      );
    } else {
      content = (
        <>
          <div>
            {editing
              ? formData.map((category, categoryIndex) => (
                  <div key={category._id} className="mb-2 p-2">
                    <Input
                      className="text-xl w-1/2  p-2"
                      value={category.categoryName}
                      onChange={(e) =>
                        handleCategoryChange(categoryIndex, e.target.value)
                      }
                    />
                    {category.items.map((item, itemIndex) => (
                      <div className="flex items-center gap-4" key={item._id}>
                        <div className="w-2">{itemIndex + 1}</div>
                        <Input
                          value={item.itemName}
                          onChange={(e) =>
                            handleItemChange(
                              categoryIndex,
                              itemIndex,
                              e.target.value
                            )
                          }
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            handleItemRemove(categoryIndex, itemIndex)
                          }
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                ))
              : data.data[0].categories.map((category) => {
                  return (
                    <div key={category._id} className="mb-2">
                      <div className="text-xl">{category.categoryName}</div>
                      {category.items.map((item) => {
                        return <div key={item._id}>{item.itemName}</div>;
                      })}
                    </div>
                  );
                })}
          </div>
        </>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspection</CardTitle>
        <CardDescription>Template of the inspection form</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
        {isNewCategory && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 border-b pb-4">
                  <Label>Category Title</Label>
                  <Input
                    placeholder="category name"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                  />
                </div>

                <div className="grid gap-4">
                  <Label>Category Items</Label>
                  <div>
                    {newCategory.items.map((item) => {
                      return item.itemName;
                    })}
                  </div>
                  {isNewItemInput && (
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="new item"
                        value={newItemInput}
                        onChange={(e) => {
                          setNewItemInput(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (!newItemInput) return;
                            setNewCategory((prev) => {
                              return {
                                ...prev,
                                items: [
                                  ...prev.items,
                                  { itemName: newItemInput },
                                ],
                              };
                            });
                            setNewItemInput("");
                            setIsNewItemInput(false);
                          }
                        }}
                      />

                      <Button
                        onClick={() => {
                          if (!newItemInput) return;
                          setNewCategory((prev) => {
                            return {
                              ...prev,
                              items: [
                                ...prev.items,
                                { itemName: newItemInput },
                              ],
                            };
                          });
                          setNewItemInput("");
                          setIsNewItemInput(false);
                        }}
                      >
                        <Check className=" w-5 h-5  " />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t p-2">
              <Button
                size="sm"
                variant="ghost"
                className="gap-1"
                onClick={() => setIsNewItemInput(true)}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-between">
        {editing || isNewCategory ? (
          <Button variant="outline" onClick={() => handleEditClick(false)}>
            Cancel
          </Button>
        ) : (
          <Button variant="outline" onClick={() => handleEditClick(true)}>
            Edit
          </Button>
        )}

        {isNewCategory || editing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <Button onClick={() => setIsNewCategory(true)}>Add Category</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CarWashInspectionSetting;
