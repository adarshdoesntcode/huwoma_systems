import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCarwashInspectionTemplateQuery,
  useUpdateInspectionTemplateMutation,
} from "../settingsApiSlice";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Edit2, Loader2, PlusCircle, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isEqual } from "lodash";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const CarWashInspectionSetting = () => {
  const [initialInspections, setInitialInspections] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [addNewInspection, setAddNewinspection] = useState(false);
  const [inspectionScope, setInspectionScope] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const { data, isLoading, isSuccess, isError, isFetching, error } =
    useCarwashInspectionTemplateQuery();
  const [updateInspectionTemplate, { isLoading: isSubmitting }] =
    useUpdateInspectionTemplateMutation();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const newForm = useRef(null);
  const editForm = useRef(null);

  useEffect(() => {
    if (addNewInspection && newForm.current) {
      newForm.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    if (editForm && editForm.current) {
      editForm.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [addNewInspection, editIndex]);

  useEffect(() => {
    if (isSuccess) {
      setInspections(data?.data || []);
      setInitialInspections(data?.data || []);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (initialInspections && !isEqual(inspections, initialInspections)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [inspections, initialInspections]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleInspectionRemove = (deleteIndex) => {
    setInspections((prev) => {
      return prev.filter((inspection, index) => {
        return index !== deleteIndex;
      });
    });
  };

  const onEdit = (data) => {
    setInspections((prev) => {
      return prev.map((inspection, index) => {
        if (index === editIndex) {
          return {
            _id: editId || undefined,
            categoryName: data.categoryName,
            items: data.inspectionItems.split(","),
            scope: inspectionScope,
          };
        } else {
          return inspection;
        }
      });
    });
    reset();
    setEditIndex(null);
    setEditId(null);
    setInspectionScope("");
  };

  const onAdd = (data) => {
    setInspections((prev) => {
      return [
        ...prev,
        {
          categoryName: data.categoryName,
          items: data.inspectionItems.split(","),
          scope: inspectionScope,
        },
      ];
    });
    reset();
    setAddNewinspection(false);
    setInspectionScope("");
  };

  const onSubmit = async () => {
    try {
      const res = await updateInspectionTemplate({
        inspections,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Inspection Template Modification",
          description: `Success`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  let content;

  if (isLoading || isFetching) {
    content = (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl"> Inspection</CardTitle>
          <CardDescription>Template of the inspection form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className=" space-y-6">
            <Skeleton className="w-full h-24 rounded-xl" />
            <Skeleton className="w-full h-24 rounded-xl" />
            <Skeleton className="w-full h-34 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  } else if (isSuccess) {
    content = (
      <Card className="mb-64">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <CardTitle className="text-xl sm:text-2xl">Inspection</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Template of the inspection form
              </CardDescription>
            </div>
            <div>
              {isDirty && !isFetching && (
                <Badge variant="destructive">Unsaved Changes</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
          {inspections.length === 0 ? (
            <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
              No Inspections
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-5">
              {inspections.map((inspection, index) => {
                if (editIndex === index) {
                  return (
                    <form
                      ref={editForm}
                      key={`inspection-${index}`}
                      onSubmit={handleSubmit(onEdit)}
                      className="grid gap-4 border p-4 sm:p-6  rounded-md mt-4"
                    >
                      <div>
                        <div className="grid gap-2 col-span-2">
                          <Label>
                            {errors.categoryName ? (
                              <span className="text-destructive">
                                {errors.categoryName.message}
                              </span>
                            ) : (
                              <span>Category Name</span>
                            )}
                          </Label>
                          <Input
                            id="categoryName"
                            type="text"
                            defaultValue={inspection.categoryName}
                            placeholder="Category name"
                            {...register("categoryName", {
                              required: "Name is required",
                            })}
                            className={
                              errors.categoryName ? "border-destructive" : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2 col-span-3">
                          <Label>
                            {errors.inspectionItems ? (
                              <span className="text-destructive">
                                {errors.inspectionItems.message}
                              </span>
                            ) : (
                              <span>
                                Inspection List{" "}
                                <span className="font-normal text-muted-foreground text-xs">
                                  (separate with commas)
                                </span>
                              </span>
                            )}
                          </Label>
                          <Textarea
                            id="inspectionItems"
                            type="text"
                            defaultValue={inspection.items.join()}
                            placeholder="item1,item2,item3.."
                            {...register("inspectionItems", {
                              required: "Items are required",
                            })}
                            className={
                              errors.inspectionItems ? "border-destructive" : ""
                            }
                          />
                        </div>
                        <Separator className="col-span-3" />
                        <div className="space-y-2 col-span-3 ">
                          <Label>Inspection Scope</Label>
                          <RadioGroup
                            defaultValue={inspection.scope}
                            onValueChange={setInspectionScope}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="exterior" id="exterior" />
                              <Label htmlFor="exterior">Exterior</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="interior" id="interior" />
                              <Label htmlFor="interior">Interior</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                      <CardFooter className="justify-center border-t p-4 pb-0">
                        <Button variant="secondary">Done</Button>
                      </CardFooter>
                    </form>
                  );
                } else {
                  return (
                    <Card key={index}>
                      <CardHeader className="pl-4 sm:pl-6 pb-0 pt-2 pr-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm gap-2 flex-wrap flex">
                              <span>{inspection.categoryName} </span>
                              <Badge
                                variant="secondary"
                                className="font-medium uppercase text-xs hidden sm:flex"
                              >
                                {inspection.scope}
                              </Badge>
                            </CardTitle>
                          </div>
                          <div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground"
                              onClick={() => {
                                setInspectionScope(inspection.scope);
                                setEditIndex(index);
                                setEditId(inspection._id);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-muted-foreground"
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleInspectionRemove(index)
                                    }
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="px-2 sm:px-4 pb-1">
                        <div>
                          <ul className="ml-6 text-xs mb-2 list-disc">
                            {inspection.items.map((item, index) => {
                              return <li key={index}>{item}</li>;
                            })}
                          </ul>
                        </div>
                        <div className="flex items-center justify-between mt-4"></div>
                      </CardContent>
                    </Card>
                  );
                }
              })}
            </div>
          )}
          {addNewInspection && (
            <form
              ref={newForm}
              onSubmit={handleSubmit(onAdd)}
              className="grid gap-4 border p-4 sm:p-6 rounded-md mt-4"
            >
              <div>
                <div className="grid gap-2 col-span-2">
                  <Label>
                    {errors.categoryName ? (
                      <span className="text-destructive">
                        {errors.categoryName.message}
                      </span>
                    ) : (
                      <span>Category Name</span>
                    )}
                  </Label>
                  <Input
                    id="categoryName"
                    type="text"
                    placeholder="Category name"
                    {...register("categoryName", {
                      required: "Name is required",
                    })}
                    className={errors.categoryName ? "border-destructive" : ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2 col-span-3">
                  <Label>
                    {errors.inspectionItems ? (
                      <span className="text-destructive">
                        {errors.inspectionItems.message}
                      </span>
                    ) : (
                      <span>
                        Inspection List{" "}
                        <span className="font-normal text-muted-foreground text-xs">
                          (separate with commas)
                        </span>
                      </span>
                    )}
                  </Label>
                  <Textarea
                    id="inspectionItems"
                    type="text"
                    placeholder="item1,item2,item3.."
                    {...register("inspectionItems", {
                      required: "Items are required",
                    })}
                    className={
                      errors.inspectionItems ? "border-destructive" : ""
                    }
                  />
                </div>
                <Separator className="col-span-3" />
                <div className="space-y-2 col-span-3 ">
                  <Label>Inspection Scope</Label>
                  <RadioGroup
                    value={inspectionScope}
                    onValueChange={setInspectionScope}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exterior" id="exterior" />
                      <Label htmlFor="exterior">Exterior</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="interior" id="interior" />
                      <Label htmlFor="interior">Interior</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <CardFooter className="justify-center border-t p-4 pb-0">
                <Button variant="secondary">Done</Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
        <CardFooter className="border-t px-4 sm:px-6  py-4  flex justify-between">
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => {
              reset();
              if (!addNewInspection) {
                setInspectionScope("exterior");
              } else {
                setInspectionScope("");
              }
              setAddNewinspection(!addNewInspection);
            }}
          >
            {!addNewInspection && <PlusCircle className="h-3.5 w-3.5" />}
            {addNewInspection ? "Cancel" : "Add"}
          </Button>
          <div>
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </Button>
            ) : (
              <Button disabled={!isDirty} onClick={onSubmit}>
                Save
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
};

export default CarWashInspectionSetting;
