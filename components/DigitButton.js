import { ACTIONS } from "../pages/index";
import styles from "../styles/Home.module.css";

export default function DigitButton({ dispatch, digit }) {
  return (
    <button
      className={`${styles.btnSize} ${styles.downBtnRowColor}`}
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
}
