import './Botones.css';

const Botones = params => {
  return (
    <button className={params.name} style={params.style}>
      {params.title}
    </button>
  );
}

export default Botones;