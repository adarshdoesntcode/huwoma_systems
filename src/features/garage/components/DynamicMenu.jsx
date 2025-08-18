import { isMobile } from "react-device-detect";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DynamicMenu({ configs = [], children }) {
  let content = (
    <div>
      {configs.map((config, idx) => (
        <div
          key={idx}
          onClick={config.action}
          className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-muted "
        >
          {config.icon}
          <span className="text-sm text-muted-foreground hover:text-primary">
            {config.label}
          </span>
        </div>
      ))}
    </div>
  );
  return isMobile ? (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="pb-4">{content}</DrawerContent>
    </Drawer>
  ) : (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent side="top" className="w-auto p-1">
        {content}
      </PopoverContent>
    </Popover>
  );
}

export default DynamicMenu;
