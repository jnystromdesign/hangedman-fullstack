export const DisplayStatus = (props: {
  progress: string;
  loading: boolean;
  show: boolean;
}) => {
  if (!props.show) return null;
  if (props.loading) return <h1>Finding a tricky word. 🤔</h1>;
  return <h1>{props.progress}</h1>;
};
