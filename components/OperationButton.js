import { ACTIONS } from "../pages/index";
import styles from "../styles/Home.module.css";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      className={`${styles.btnSize} ${styles.downBtnRowColor}`}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
