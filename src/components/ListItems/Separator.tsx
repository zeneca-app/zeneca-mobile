export type SeparatorProps = {
  className?: string;
};

const Separator = ({ className = "" }) => (
  <div className={`h-separator ${className}`} />
);

Separator.displayName = "Separator";

export default Separator;
