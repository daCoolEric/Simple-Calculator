import Head from "next/head";
import Image from "next/image";
import { useReducer } from "react";
import DigitButton from "../components/DigitButton";
import OperationButton from "../components/OperationButton";
import styles from "../styles/Home.module.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

export default function Home() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.calcContainer}>
          <div className={styles.calcScreen}>
            <div className={styles.calcScreenTheme}>Theme Switch</div>
            <div className={styles.calcScreenSecondary}>
              {formatOperand(previousOperand)} {operation}
            </div>
            <div className={styles.calcScreenPrimary}>
              {formatOperand(currentOperand)}
            </div>
          </div>
          <div className={styles.calcKeypad}>
            <div className={styles.keysContainer}>
              <div className={styles.leftKeysContainer}>
                <div className={styles.topKeys}>
                  <button
                    className={`${styles.btnSize} ${styles.downBtnRowColor}`}
                    onClick={() => dispatch({ type: ACTIONS.CLEAR })}
                  >
                    AC
                  </button>
                  <button
                    className={`${styles.btnSize} ${styles.downBtnRowColor}`}
                    onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
                  >
                    DEL
                  </button>
                  <button
                    className={`${styles.btnSize} ${styles.downBtnRowColor}`}
                    onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
                  >
                    DEL
                  </button>
                </div>
                <div className={styles.downKeys}>
                  <div className={styles.downKeysRow1}>
                    <DigitButton digit="1" dispatch={dispatch} />
                    <DigitButton digit="2" dispatch={dispatch} />
                    <DigitButton digit="3" dispatch={dispatch} />
                  </div>

                  <div className={styles.downKeysRow2}>
                    <DigitButton digit="4" dispatch={dispatch} />
                    <DigitButton digit="5" dispatch={dispatch} />
                    <DigitButton digit="6" dispatch={dispatch} />
                  </div>
                  <div className={styles.downKeysRow3}>
                    <DigitButton digit="7" dispatch={dispatch} />
                    <DigitButton digit="8" dispatch={dispatch} />
                    <DigitButton digit="9" dispatch={dispatch} />
                  </div>
                  <div className={styles.downKeysRow4}>
                    <DigitButton digit="." dispatch={dispatch} />
                    <DigitButton digit="0" dispatch={dispatch} />
                    <DigitButton digit="0" dispatch={dispatch} />
                  </div>
                </div>
              </div>
              <div className={styles.rightKeysContainer}>
                <OperationButton operation="*" dispatch={dispatch} />
                <OperationButton operation="+" dispatch={dispatch} />
                <OperationButton operation="-" dispatch={dispatch} />
                <OperationButton operation="÷" dispatch={dispatch} />
                <button
                  className={`${styles.btnSize} ${styles.downBtnRowColor}`}
                  onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
                >
                  =
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>Developed by Dacooleric</footer>
    </div>
  );
}
