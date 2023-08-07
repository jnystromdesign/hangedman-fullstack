export const DisplayAttemptLeft = (props: {
  failstack: string[];
  show: boolean;
}) =>
  props.show ? (
    <div>
      Remaining attempts:{" "}
      {Array(8 - props.failstack.length)
        .fill("❤️")
        .map((life) => life)}
    </div>
  ) : null;
