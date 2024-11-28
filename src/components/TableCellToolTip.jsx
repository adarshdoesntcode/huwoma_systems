import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function TableCellToolTip({ text, children }) {
  return (
    <HoverCard openDelay={10} closeDelay={0}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side="left"
        className="max-w-[350px] text-xs text-wrap  bg-primary text-primary-foreground "
      >
        {text}
      </HoverCardContent>
    </HoverCard>
  );
}

export default TableCellToolTip;
