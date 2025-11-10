export default function LayoutReyzumes({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full px-3 sm:px-8 lg:px-12 py-5 flex flex-col">
      <main className=" h-full">{children}</main>
    </div>
  );
}
