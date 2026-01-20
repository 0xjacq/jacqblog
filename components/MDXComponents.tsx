import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Image, { ImageProps } from "next/image";
import Link from "next/link";

function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href;

  if (href?.startsWith("/")) {
    return <Link href={href} {...props} />;
  }

  if (href?.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function CustomImage(props: ImageProps) {
  return <Image {...props} alt={props.alt || ""} />;
}

function Callout({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "error";
}) {
  const styles = {
    info: "border-accent bg-accent/10",
    warning: "border-yellow-500 bg-yellow-500/10",
    error: "border-red-500 bg-red-500/10",
  };

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      {children}
    </div>
  );
}

const components = {
  a: CustomLink,
  Image: CustomImage,
  Callout,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={components as MDXRemoteProps["components"]}
      />
    </div>
  );
}

export { components as mdxComponents };
