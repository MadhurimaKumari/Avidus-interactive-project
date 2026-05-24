const MetricCard = ({ label, value }) => {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
};

export default MetricCard;
