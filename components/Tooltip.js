import styles from "../styles/Tooltip.module.css";

export default function Tooltip({ children, text }) {
  return (
    <div className={styles.tooltipWrapper}>
      {children}
      <div className={styles.tooltipText}>{text}</div>
    </div>
  );
}
