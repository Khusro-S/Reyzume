"use client";
import AddSection from "./toolbarButtons/AddSection";
import BulletPoint from "./toolbarButtons/BulletPoint";
import FontSelector from "./toolbarButtons/FontSelector";
import FontSize from "./toolbarButtons/FontSize";
import Hyperlink from "./toolbarButtons/Hyperlink";
import TextFormatting from "./toolbarButtons/TextFormatting";
import UndoRedo from "./toolbarButtons/UndoRedo";
import Zoom from "./toolbarButtons/Zoom";

export default function Toolbar() {
  return (
    <div className="fixed px-7 right-0 top-13 flex gap-5 scrollbar-hide overflow-scroll w-full py-1 z-10 backdrop-blur-2xl bg-transparent">
      <AddSection />
      <UndoRedo />
      <Zoom />
      <FontSelector />
      <FontSize />
      <TextFormatting />
      <BulletPoint />
      <Hyperlink />
    </div>
  );
}
