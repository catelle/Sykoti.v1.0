import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

// Define prop types
interface DrawerDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerButton?: React.ReactNode;
  footerButtonForMobile?: React.ReactNode;
  dismissible?: boolean;
  shouldScaleBackground?: boolean;
  indicator?: React.ReactNode;
  hiddenCloseButton?: boolean;
  classNameContent?: string;
  onCloseAutoFocus?: () => void;
}

// Functional component with TypeScript types
export default function DrawerDialog({
  children,
  title,
  description,
  open,
  setOpen,
  triggerButton,
  footerButtonForMobile,
  dismissible = true, // Provide default values for optional props
  shouldScaleBackground = true,
  indicator,
  hiddenCloseButton = false,
  classNameContent = "",
  onCloseAutoFocus,
}: DrawerDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
     <Dialog
  open={open}
  onOpenChange={setOpen} // Handle the dialog state changes manually
>
  {triggerButton && (
    <DialogTrigger asChild>{triggerButton}</DialogTrigger>
  )}
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
    {children}
  </DialogContent>
</Dialog>

    );
  }

  return (
    <Drawer
      open={open}
      dismissible={false}
      shouldScaleBackground={shouldScaleBackground}
      onOpenChange={setOpen}
      modal={false}
    >
      {triggerButton && <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>}
      <DrawerContent
  className={cn("h-[95%]", classNameContent)}
  onCloseAutoFocus={onCloseAutoFocus}
>
  <DrawerHeader className="text-left">
    {title && <DrawerTitle>{title}</DrawerTitle>}
    {description && <DrawerDescription>{description}</DrawerDescription>}
  </DrawerHeader>
  {children}

  <DrawerFooter className="pt-2 space-y-1">
    {footerButtonForMobile}
    {!hiddenCloseButton && (
      <DrawerClose asChild>
        <Button variant="outline">Fermer</Button>
      </DrawerClose>
    )}
  </DrawerFooter>
</DrawerContent>

    </Drawer>
  );
}
