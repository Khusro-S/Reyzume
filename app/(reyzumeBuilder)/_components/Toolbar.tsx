"use client";
import FontSelector from "./toolbarButtons/FontSelector";
import FontSize from "./toolbarButtons/FontSize";
import Hyperlink from "./toolbarButtons/Hyperlink";
import TextFormatting from "./toolbarButtons/TextFormatting";
import UndoRedo from "./toolbarButtons/UndoRedo";
import Zoom from "./toolbarButtons/Zoom";

export default function Toolbar() {
  return (
    <div className="fixed left-7 md:left-40 right-0 top-13 flex gap-5 scrollbar-hide overflow-scroll w-full">
      <UndoRedo />
      <Zoom />
      <FontSelector />
      <FontSize />
      <TextFormatting />
      <Hyperlink />
    </div>
  );
}
