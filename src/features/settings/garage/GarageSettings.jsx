import { useIsSuper } from "@/hooks/useSuper";
import {
  useGetGarageVehicleConfigQuery,
  useUpdateGarageVehicleConfigMutation,
} from "../settingsApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import ApiError from "@/components/error/ApiError";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/SubmitButton";
import { useState, useEffect } from "react";
import { Plus, X, Edit2, Check, X as XIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function GarageSettings() {
  const isSuper = useIsSuper();

  const { data, isLoading, isSuccess, isError, refetch, error, isFetching } =
    useGetGarageVehicleConfigQuery();
  const [updateGarageVehicleConfig, { isLoading: updateLoading }] =
    useUpdateGarageVehicleConfigMutation();

  // Local state for editing
  const [editingData, setEditingData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [newItems, setNewItems] = useState({
    vehicleMakers: "",
    vehicleCategories: "",
    transmissionTypes: "",
    driveTypes: "",
    fuelTypes: "",
  });
  const [editingItems, setEditingItems] = useState({});

  // Initialize editing data when API data is loaded
  useEffect(() => {
    if (isSuccess && data && data.data) {
      const clonedData = JSON.parse(JSON.stringify(data.data));
      setEditingData(clonedData);
      setOriginalData(clonedData);
    }
  }, [isSuccess, data]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    if (!editingData || !originalData) return false;
    return JSON.stringify(editingData) !== JSON.stringify(originalData);
  };

  // Utility function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1)
    );
  };

  // Check for duplicates (case-insensitive)
  const isDuplicate = (category, newItem) => {
    if (!editingData || !editingData[category]) return false;
    return editingData[category].some(
      (item) => item.toLowerCase() === newItem.toLowerCase()
    );
  };

  const handleAddItem = (category) => {
    const rawItem = newItems[category].trim();
    if (!rawItem) return;

    const capitalizedItem = capitalizeWords(rawItem);

    if (editingData && !isDuplicate(category, capitalizedItem)) {
      setEditingData({
        ...editingData,
        [category]: [...editingData[category], capitalizedItem],
      });
      setNewItems({
        ...newItems,
        [category]: "",
      });
    }
  };

  const handleRemoveItem = (category, index) => {
    if (editingData) {
      setEditingData({
        ...editingData,
        [category]: editingData[category].filter((_, i) => i !== index),
      });
    }
  };

  const startEditing = (category, index) => {
    setEditingItems({
      ...editingItems,
      [`${category}-${index}`]: editingData[category][index],
    });
  };

  const saveEdit = (category, index) => {
    const editKey = `${category}-${index}`;
    const rawValue = editingItems[editKey];

    if (!rawValue || !rawValue.trim()) return;

    const capitalizedValue = capitalizeWords(rawValue.trim());

    // Check if the new value is a duplicate (excluding the current item)
    const otherItems = editingData[category].filter((_, i) => i !== index);
    const isDuplicateEdit = otherItems.some(
      (item) => item.toLowerCase() === capitalizedValue.toLowerCase()
    );

    if (!isDuplicateEdit) {
      setEditingData({
        ...editingData,
        [category]: editingData[category].map((item, i) =>
          i === index ? capitalizedValue : item
        ),
      });
    }

    const updatedEditingItems = { ...editingItems };
    delete updatedEditingItems[editKey];
    setEditingItems(updatedEditingItems);
  };

  const cancelEdit = (category, index) => {
    const editKey = `${category}-${index}`;
    const updatedEditingItems = { ...editingItems };
    delete updatedEditingItems[editKey];
    setEditingItems(updatedEditingItems);
  };

  const handleSaveChanges = async () => {
    if (editingData) {
      try {
        const res = await updateGarageVehicleConfig(editingData);
        if (res.error) {
          throw new Error(res.error.data.message);
        }
        if (!res.error) {
          toast({
            title: "Config Updated!",
            description: "Successfully",
            duration: 2000,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: error.message,
        });
      }
    }
  };

  const renderCategory = (categoryKey, categoryTitle) => {
    const items = editingData?.[categoryKey] || [];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{categoryTitle}</Label>
          <span className="text-xs text-muted-foreground">
            {items.length} items
          </span>
        </div>

        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            placeholder={`Add new ${categoryTitle.toLowerCase()}`}
            value={newItems[categoryKey]}
            onChange={(e) =>
              setNewItems({
                ...newItems,
                [categoryKey]: e.target.value,
              })
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddItem(categoryKey);
              }
            }}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={() => handleAddItem(categoryKey)}
            disabled={
              !newItems[categoryKey].trim() ||
              isDuplicate(
                categoryKey,
                capitalizeWords(newItems[categoryKey].trim())
              )
            }
            title={
              isDuplicate(
                categoryKey,
                capitalizeWords(newItems[categoryKey].trim())
              )
                ? "This item already exists"
                : "Add item"
            }
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Existing items */}
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => {
            const editKey = `${categoryKey}-${index}`;
            const isEditing = Object.prototype.hasOwnProperty.call(
              editingItems,
              editKey
            );

            return (
              <div key={index} className="flex items-center gap-1">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingItems[editKey]}
                      onChange={(e) =>
                        setEditingItems({
                          ...editingItems,
                          [editKey]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          saveEdit(categoryKey, index);
                        } else if (e.key === "Escape") {
                          cancelEdit(categoryKey, index);
                        }
                      }}
                      className="w-32 h-6 px-2 text-xs"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveEdit(categoryKey, index)}
                      className="w-6 h-6 p-0"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => cancelEdit(categoryKey, index)}
                      className="w-6 h-6 p-0"
                    >
                      <XIcon className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => startEditing(categoryKey, index)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-sm p-0.5"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(categoryKey, index)}
                      className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="pb-2">
        <div className="flex gap-4 py-3 border-t">
          <Skeleton className="w-1/6 h-10" />
          <Skeleton className="w-2/6 h-10" />
          <Skeleton className="w-1/6 h-10" />
          <Skeleton className="w-2/6 h-10" />
        </div>
        <div className="flex gap-4 py-3 border-t">
          <Skeleton className="w-1/6 h-10" />
          <Skeleton className="w-2/6 h-10" />
          <Skeleton className="w-1/6 h-10" />
          <Skeleton className="w-2/6 h-10" />
        </div>
      </div>
    );
  } else if (isSuccess) {
    if (!data || !data.data) {
      content = (
        <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
          No Vehicle Configs
        </div>
      );
    } else {
      content = (
        <div className="space-y-6">
          {renderCategory("vehicleMakers", "Vehicle Makers")}
          <Separator />
          {renderCategory("vehicleCategories", "Vehicle Categories")}
          <Separator />
          {renderCategory("transmissionTypes", "Transmission Types")}
          <Separator />
          {renderCategory("driveTypes", "Drive Types")}
          <Separator />
          {renderCategory("fuelTypes", "Fuel Types")}
        </div>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          <div className="flex items-center justify-between w-full gap-2">
            <span>Garage Vehicle Configs</span>
            {hasUnsavedChanges() && (
              <Badge variant="destructive">Unsaved changes</Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure your garage vehicles
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">{content}</CardContent>

      {isSuper && isSuccess && data && data.data && (
        <CardFooter className="flex justify-end px-4 py-4 border-t sm:px-6">
          <SubmitButton
            condition={updateLoading}
            disabled={!hasUnsavedChanges()}
            buttonText="Save Changes"
            loadingText="Saving..."
            onClick={handleSaveChanges}
          />
        </CardFooter>
      )}
    </Card>
  );
}

export default GarageSettings;
