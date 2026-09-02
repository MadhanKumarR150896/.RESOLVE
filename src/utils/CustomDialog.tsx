import * as Dialog from "@radix-ui/react-dialog";
import { SquarePen, X, type LucideProps } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "./classMerger";

const dialogIcons = {
  update: SquarePen,
  close: X,
};

export type DialogBoxProps = {
  rootProps?: Dialog.DialogProps;
  trigger: {
    props?: Dialog.DialogTriggerProps;
    buttonProps?: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
    title?: {
      value: string;
      props?: HTMLAttributes<HTMLSpanElement>;
    };
    extra?: {
      value: string;
      props?: HTMLAttributes<HTMLSpanElement>;
    };
    icon?: {
      name: "update";
      props?: LucideProps;
    };
  };
  portal: {
    props?: Dialog.DialogPortalProps;
    overlayProps?: Dialog.DialogOverlayProps;
    content: {
      props?: Dialog.DialogContentProps;
      divProps?: HTMLAttributes<HTMLDivElement>;
      title?: {
        value: string;
        props?: Dialog.DialogTitleProps;
      };
      description?: {
        value: string;
        props?: Dialog.DialogDescriptionProps;
      };
    };
    close: {
      props?: Dialog.DialogCloseProps;
      buttonProps?: Pick<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
      icon: {
        name: "close";
        props?: LucideProps;
      };
    };
  };
};

type CustomDialogBoxProps = {
  dialog: DialogBoxProps;
  children: ReactNode;
};

export const CustomDialogBox = ({ dialog, children }: CustomDialogBoxProps) => {
  const trigger = dialog.trigger;
  const triggerTitle = trigger.title ?? null;
  const triggerExtra = trigger.extra ?? null;
  const TriggerIcon = trigger.icon?.name
    ? dialogIcons[trigger.icon?.name]
    : null;
  const portal = dialog.portal;
  const dialogTitle = portal.content.title ?? null;
  const dialogDesc = portal.content.description ?? null;
  const close = portal.close;
  const CloseIcon = dialogIcons["close"];

  return (
    <Dialog.Root {...dialog.rootProps}>
      <Dialog.Trigger {...trigger.props} asChild>
        <button
          {...trigger.buttonProps}
          className={cn(
            "cursor-pointer outline-none",
            trigger.buttonProps?.className
          )}
        >
          {triggerTitle && (
            <span {...triggerTitle.props}>{triggerTitle.value}</span>
          )}
          {triggerExtra && (
            <span {...triggerExtra.props}>{triggerExtra.value}</span>
          )}
          {TriggerIcon && <TriggerIcon {...trigger.icon?.props} />}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal {...portal.props}>
        <Dialog.Overlay
          {...portal.overlayProps}
          className={cn(
            "data-[state=open]:bg-neutral-400",
            portal.overlayProps?.className
          )}
        />
        <Dialog.Content {...portal.content.props}>
          <div {...portal.content.divProps}>
            {dialogTitle && (
              <Dialog.Title {...dialogTitle.props}>
                {dialogTitle.value}
              </Dialog.Title>
            )}
            {dialogDesc && (
              <Dialog.Title {...dialogDesc.props}>
                {dialogDesc.value}
              </Dialog.Title>
            )}
            {children}
          </div>
          <Dialog.Close {...close.props} asChild>
            <button
              {...close.buttonProps}
              className={cn(
                "cursor-pointer outline-none",
                close.buttonProps?.className
              )}
            >
              <CloseIcon {...close.icon.props} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
