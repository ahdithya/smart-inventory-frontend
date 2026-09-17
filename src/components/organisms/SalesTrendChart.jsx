import { useState, useMemo } from 'react';
import { PeriodToggle } from '../molecules/PeriodToggle';
import { Skeleton } from '../atoms/Skeleton';

function formatRupiahShort(value) {
  const num = Number(value) || 0;
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}jt`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}rb`;
  }
  return String(num);
}

function formatRupiahFull(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatDateLabel(dateStr, period) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  if (period === 'weekly') {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[date.getDay()];
  }

  // Monthly: 14/09
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export function SalesTrendChart({
  points = [],
  period = 'weekly',
  onPeriodChange,
  isLoading = false,
  className = '',
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartData = useMemo(() => {
    if (!points || points.length === 0) {
      return { coordinates: [], maxVal: 100, yTicks: [0, 50, 100] };
    }

    const values = points.map((p) => Number(p.total) || 0);
    const rawMax = Math.max(...values, 100_000);
    // Round up max to nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const maxVal = Math.ceil(rawMax / magnitude) * magnitude;

    const width = 700;
    const height = 240;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const usableWidth = width - paddingLeft - paddingRight;
    const usableHeight = height - paddingTop - paddingBottom;

    const stepX = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth;

    const coordinates = points.map((p, idx) => {
      const val = Number(p.total) || 0;
      const x = paddingLeft + idx * stepX;
      const y = paddingTop + usableHeight - (val / maxVal) * usableHeight;
      return {
        ...p,
        x,
        y,
        val,
      };
    });

    const yTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

    return {
      coordinates,
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
  }, [points]);

  if (isLoading) {
    return (
      <div className={`border border-[#e5e5e5] rounded-[8px] p-5 sm:p-6 bg-white flex flex-col ${className}`}>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-7 w-28" />
        </div>
        <Skeleton className="h-[280px] w-full" />
      </div>
    );
  }

  const { coordinates, yTicks, width, height, paddingLeft, paddingRight, paddingTop, usableHeight } = chartData;

  const polylinePoints = coordinates.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPoints = coordinates.length > 0
    ? `${coordinates[0].x},${paddingTop + usableHeight} ${polylinePoints} ${
        coordinates[coordinates.length - 1].x
      },${paddingTop + usableHeight}`
    : '';

  return (
    <div
      className={`border border-[#e5e5e5] rounded-[8px] p-5 sm:p-6 bg-white flex flex-col ${className}`}
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-[17px] font-bold text-[#1a1c1c] tracking-[-0.02em]">
            Tren Penjualan ({period === 'weekly' ? '7 Hari Terakhir' : '30 Hari Terakhir'})
          </h2>
          <p className="text-[12px] text-[#7b7486] mt-0.5">
            Grafik omzet penjualan produk UMKM
          </p>
        </div>

        {onPeriodChange && (
          <PeriodToggle period={period} onChange={onPeriodChange} />
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[280px] flex items-center justify-center">
        {coordinates.length === 0 ? (
          <div className="text-center text-[13px] text-[#7b7486]">
            Belum ada riwayat penjualan pada rentang waktu ini.
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible select-none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {yTicks.map((tickVal, idx) => {
              const y = paddingTop + usableHeight - (tickVal / chartData.maxVal) * usableHeight;
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#eeeeee"
                    strokeWidth="1"
                    strokeDasharray={idx === 0 ? 'none' : '3 3'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#7b7486"
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                  >
                    {formatRupiahShort(tickVal)}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Under Curve */}
            {areaPoints && (
              <polygon points={areaPoints} fill="url(#purpleGradient)" />
            )}

            {/* Polyline */}
            {polylinePoints && (
              <polyline
                fill="none"
                stroke="#6d28d9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />
            )}

            {/* Interactive Data Points */}
            {coordinates.map((pt, idx) => {
              const isHovered = hoveredPoint?.date === pt.date;
              return (
                <g
                  key={idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Invisible larger target for easy hovering */}
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                  {/* Visual Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3.5}
                    fill="#ffffff"
                    stroke="#6d28d9"
                    strokeWidth={isHovered ? 2.5 : 1.75}
                    className="transition-all duration-150"
                  />

                  {/* X Axis Date Label */}
                  <text
                    x={pt.x}
                    y={height - 8}
                    textAnchor="middle"
                    fill={isHovered ? '#1a1c1c' : '#7b7486'}
                    fontSize="11"
                    fontWeight={isHovered ? '600' : '400'}
                    fontFamily="Inter, sans-serif"
                  >
                    {formatDateLabel(pt.date, period)}
                  </text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-2 right-4 bg-white border border-[#e5e5e5] rounded-[6px] p-2.5 shadow-sm text-left pointer-events-none z-10 min-w-[140px]"
          >
            <div className="text-[11px] font-semibold text-[#5f5e5e] uppercase tracking-wider">
              {new Date(hoveredPoint.date).toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div className="text-[14px] font-bold text-[#6d28d9] mt-0.5">
              {formatRupiahFull(hoveredPoint.total)}
            </div>
            <div className="text-[11px] text-[#7b7486]">
              {hoveredPoint.qty} item terjual
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
