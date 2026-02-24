"use client";

export default function HoverItem({
  label,
  onHover,
  children,
}: {
  label: string;
  onHover: (label: string) => void;
  children: React.ReactNode;
}) {
  return (
    <span
      className="cursor-pointer hover:opacity-50 transition-opacity inline-flex items-center gap-1"
      onMouseEnter={() => onHover(label)}
    >
      {children}
    </span>
  );
}
