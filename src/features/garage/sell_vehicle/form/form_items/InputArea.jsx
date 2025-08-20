import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const InputArea = ({
  label,
  errors,
  formItemProps,
  formItemClassName,
  labelClassName,
  containerClassName = "duration-300 fade-in animate-in",
  smallSpan,
  largeSpan,
  required,
}) => (
  <div
    className={cn(
      "grid gap-3",
      `col-span-${smallSpan}`,
      `sm:col-span-${largeSpan}`,
      containerClassName
    )}
  >
    <Label className={labelClassName}>
      {errors ? (
        <span className="text-destructive ">{errors.message}</span>
      ) : (
        <span className="relative">
          {required && (
            <span className="absolute text-xs -right-2.5 -top-1 text-destructive">
              *
            </span>
          )}
          {label}
        </span>
      )}
    </Label>
    <Textarea
      {...formItemProps}
      className={cn(errors ? "border-destructive" : "", formItemClassName)}
    />
  </div>
);

export default InputArea;
