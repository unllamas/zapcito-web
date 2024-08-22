export const Container = (props: any) => {
  const { children } = props;

  return (
    <div {...props} className="flex flex-col w-full max-w-[768px] mx-auto px-4">
      {children}
    </div>
  );
};
