import styles from "./Feedback.module.css";
export type Feedback = false | "sucess" | "fail";

export const DisplayFeedBack = (props: { feedback: Feedback }) => {
  return (
    <div className={styles.display}>
      {props.feedback && (
        <div className={styles.indicator + " " + "fail"}>
          {props.feedback === "sucess" && "🎉"}
          {props.feedback === "fail" && "💔"}
        </div>
      )}
    </div>
  );
};
