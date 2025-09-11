import React, { useState } from 'react';
import '../styles/TimeTable.css';

function TimeTable({ onClose, onConfirm }) {
  const [time, setTime] = useState('');

  const handleConfirm = () => {
    if (!time) return;
    onConfirm([time]); // siempre devuelve array
    onClose();
  };

  return (
    <div className="time-table-overlay">
      <div className="time-table-container">
        <div className="time-table-header">
          <h2>Seleccionar Hora</h2>
          <button className="time-table-close" onClick={onClose}>✕</button>
        </div>

        <div className="time-picker">
          <label>⏰ Hora</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} required />
        </div>

        <div className="time-table-actions">
          <button className="time-table-cancel" onClick={onClose}>Cancelar</button>
          <button className="time-table-confirm" onClick={handleConfirm} disabled={!time}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default TimeTable;
