import { useState, useMemo } from 'react';
import { Skeleton } from '../atoms/Skeleton';

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ForecastChart({
  historyPoints = [],
  forecastPoints = [],
  horizon = 7,
  isLoading = false,
  unit = 'unit',
  className = '',
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Ambil maksimal 14 hari riwayat terakhir agar grafik proporsional & nyaman dibaca bersama forecast 7/14 hari
  const recentHistory = useMemo(() => {
    if (!historyPoints || historyPoints.length === 0) return [];
    return historyPoints.slice(-14).map((p) => ({
      date: p.date,
      qty: Number(p.qty) || 0,
      type: 'history',
    }));
  }, [historyPoints]);

  const normalizedForecast = useMemo(() => {
    if (!forecastPoints || forecastPoints.length === 0) return [];
    return forecastPoints.map((p) => ({
      date: p.date,
      qty: Number(p.qty) || 0,
      type: 'forecast',
    }));
  }, [forecastPoints]);

  // Gabungkan seluruh data kronologis untuk kalkulasi skala SVG
  const allPoints = useMemo(() => {
    return [...recentHistory, ...normalizedForecast];
  }, [recentHistory, normalizedForecast]);

  const chartLayout = useMemo(() => {
    if (allPoints.length === 0) {
      return { coordinates: [], maxVal: 10, yTicks: [0, 5, 10] };
    }

    const maxRaw = Math.max(...allPoints.map((p) => p.qty), 5);
    const maxVal = Math.ceil(maxRaw * 1.25); // Beri ruang atas 25%

    const width = 780;
    const height = 260;
    const paddingLeft = 45;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 40;

    const usableWidth = width - paddingLeft - paddingRight;
    const usableHeight = height - paddingTop - paddingBottom;

    const stepX = allPoints.length > 1 ? usableWidth / (allPoints.length - 1) : usableWidth;

    const coordinates = allPoints.map((p, idx) => {
      const x = paddingLeft + idx * stepX;
      const y = paddingTop + usableHeight - (p.qty / maxVal) * usableHeight;
      return {
        ...p,
        idx,
        x,
        y,
      };
    });

    const yTicks = [
      0,
      Math.round(maxVal * 0.25),
      Math.round(maxVal * 0.5),
      Math.round(maxVal * 0.75),
      maxVal,
    ];

    // Pisahkan koordinat history vs forecast untuk pembuatan path SVG
    const historyCoords = coordinates.filter((c) => c.type === 'history');
    const forecastCoords = coordinates.filter((c) => c.type === 'forecast');

    // Sambungan dari titik riwayat terakhir ke titik peramalan pertama
    let transitionPath = '';
    if (historyCoords.length > 0 && forecastCoords.length > 0) {
      const lastHist = historyCoords[historyCoords.length - 1];
      const firstFore = forecastCoords[0];
      transitionPath = `M ${lastHist.x} ${lastHist.y} L ${firstFore.x} ${firstFore.y}`;
    }

    // Path untuk Riwayat (Solid Line)
    const historyLinePath =
      historyCoords.length > 0
        ? historyCoords.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
        : '';

    // Path untuk Prediksi (Dashed Line)
    const forecastLinePath =
      forecastCoords.length > 0
        ? forecastCoords.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
        : '';

    return {
      coordinates,
      historyCoords,
      forecastCoords,
      historyLinePath,
      forecastLinePath,
      transitionPath,
      maxVal,
      yTicks,
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      usableHeight,
    };
  }, [allPoints]);

  if (isLoading) {
    return (
      <div className={`bg-white border border-[#e5e5e5] rounded-[6px] p-5 shadow-xs ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-[260px] w-full rounded-[4px]" />
      </div>
    );
  }

  return (
    <div className={`bg-white border border-[#e5e5e5] rounded-[6px] p-5 shadow-xs ${className}`}>
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#f4f3f3]">
        <div>
          <h3 className="text-[15px] font-bold text-[#1a1c1c]">
            Perbandingan Riwayat Penjualan vs Proyeksi Permintaan
          </h3>
          <p className="text-[12px] text-[#7b7486]">
            Visualisasi tren aktual ({recentHistory.length} hari terakhir) bersambung ke peramalan AI ({horizon} hari ke depan).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[12px]">
          <div className="flex items-center gap-1.5 text-[#475569]">
            <span className="w-3.5 h-[3px] bg-[#475569] rounded-full inline-block" />
            <span className="font-medium">Riwayat Aktual</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6d28d9]">
            <span className="w-4 h-0 border-t-2 border-dashed border-[#8b5cf6] inline-block" />
            <span className="font-semibold">Prediksi AI ({horizon} Hari)</span>
          </div>
        </div>
      </div>

      {allPoints.length === 0 ? (
        <div className="h-[240px] flex flex-col items-center justify-center text-[#7b7486]">
          <p className="text-[13px] font-medium">Tidak ada data untuk ditampilkan pada grafik ini.</p>
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto select-none">
          <svg
            viewBox={`0 0 ${chartLayout.width} ${chartLayout.height}`}
            className="w-full h-auto min-w-[640px]"
          >
            <defs>
              {/* Shading Area untuk Riwayat */}
              <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
              </linearGradient>

              {/* Shading Area untuk Prediksi */}
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {chartLayout.yTicks.map((tickVal, idx) => {
              const yPos =
                chartLayout.paddingTop +
                chartLayout.usableHeight -
                (tickVal / chartLayout.maxVal) * chartLayout.usableHeight;
              return (
                <g key={`ytick-${idx}`}>
                  <line
                    x1={chartLayout.paddingLeft}
                    y1={yPos}
                    x2={chartLayout.width - chartLayout.paddingRight}
                    y2={yPos}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={idx === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={chartLayout.paddingLeft - 8}
                    y={yPos + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                    fontWeight="500"
                  >
                    {tickVal}
                  </text>
                </g>
              );
            })}

            {/* Garis Transisi Pivot dari Riwayat ke Prediksi */}
            {chartLayout.transitionPath && (
              <path
                d={chartLayout.transitionPath}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            )}

            {/* Garis Riwayat Aktual (Solid Slate) */}
            {chartLayout.historyLinePath && (
              <path
                d={chartLayout.historyLinePath}
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Garis Prediksi AI (Dashed Purple) */}
            {chartLayout.forecastLinePath && (
              <path
                d={chartLayout.forecastLinePath}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* X-Axis Separator Divider */}
            {chartLayout.historyCoords.length > 0 && chartLayout.forecastCoords.length > 0 && (
              <line
                x1={chartLayout.historyCoords[chartLayout.historyCoords.length - 1].x}
                y1={chartLayout.paddingTop}
                x2={chartLayout.historyCoords[chartLayout.historyCoords.length - 1].x}
                y2={chartLayout.height - chartLayout.paddingBottom}
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )}

            {/* Interactive Points (Dots) */}
            {chartLayout.coordinates.map((pt) => {
              const isHovered = hoveredPoint?.idx === pt.idx;
              const isForecast = pt.type === 'forecast';

              return (
                <g key={`pt-${pt.idx}`}>
                  {/* Invisible Hit Area */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={12}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Visual Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : isForecast ? 4.5 : 3.5}
                    fill={isForecast ? '#8b5cf6' : '#475569'}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all duration-150 pointer-events-none"
                  />

                  {/* X-Axis Date Labels */}
                  {(pt.idx % Math.ceil(chartLayout.coordinates.length / 10) === 0 ||
                    pt.idx === chartLayout.coordinates.length - 1) && (
                    <text
                      x={pt.x}
                      y={chartLayout.height - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isForecast ? '#6d28d9' : '#64748b'}
                      fontWeight={isForecast ? '600' : '500'}
                    >
                      {formatDateShort(pt.date)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#1e293b] text-white text-[11px] rounded-[6px] px-3 py-2 shadow-lg z-30 transition-all duration-75"
              style={{
                left: `${(hoveredPoint.x / chartLayout.width) * 100}%`,
                top: `${(hoveredPoint.y / chartLayout.height) * 100}%`,
                marginTop: '-10px',
              }}
            >
              <div className="text-[10px] text-[#94a3b8] font-medium border-b border-[#334155] pb-1 mb-1">
                {formatDateLong(hoveredPoint.date)}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    hoveredPoint.type === 'forecast' ? 'bg-[#a78bfa]' : 'bg-[#94a3b8]'
                  }`}
                />
                <span className="font-medium text-[#e2e8f0]">
                  {hoveredPoint.type === 'forecast' ? 'Prediksi Permintaan:' : 'Penjualan Aktual:'}
                </span>
                <span className="font-bold text-white">
                  {hoveredPoint.qty} {unit}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
