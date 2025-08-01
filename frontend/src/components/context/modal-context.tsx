"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import useWindowDimensions from "../hooks/useWindowDimension";

interface ModalContextProps {
  openSheet: (content: ReactNode) => void;
  closeSheet: () => void;
  setSheetWidth: (width: string) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState<ReactNode>(null);
  const [sheetWidth, setSheetWidth] = useState<string | null>(null);

  const { width: windowWidth } = useWindowDimensions();

  // 👉 Functions for Sheet
  const openSheet = (content: ReactNode) => {
    setSheetContent(content);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSheetContent(null);
    if (sheetWidth) setSheetWidth(null);
  };

  // 👉 Adjust width dynamically based on window size
  useEffect(() => {
    if (windowWidth <= 500) {
      setSheetWidth("95vw");
    } else if (windowWidth <= 650) {
      setSheetWidth("80vw");
    } else if (windowWidth <= 800) {
      setSheetWidth("75vw");
    } else if (windowWidth <= 1000) {
      setSheetWidth("65vw");
    } else if (windowWidth <= 1200) {
      setSheetWidth("60vw");
    } else {
      setSheetWidth("40vw");
    }
    if (!isSheetOpen && sheetWidth) {
      setSheetWidth(null);
    }
  }, [isSheetOpen]);

  return (
    <ModalContext.Provider value={{ openSheet, closeSheet, setSheetWidth }}>
      {children}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="h-screen top-0 right-0 left-auto mt-0 rounded-none dark:bg-darkBg bg-white dark:text-white text-black p-2 sm:w-full"
          style={{
            width: sheetWidth ? sheetWidth : `calc(100vw - 70vw)`,
            border: "none",
          }}
        >
          <div className="p-2">{sheetContent}</div>
        </SheetContent>
      </Sheet>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
