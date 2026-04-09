import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const THEMES = {
  alpine: {
    name: "Alpine",
    accent: "#1a9fd4",
    accentDark: "#0d6e96",
    accentLight: "#e8f6fc",
    rangeColor: "#b3e3f5",
    emoji: "🏔️",
    gradient: "linear-gradient(135deg, #1a9fd4 0%, #0d6e96 60%, #064d6e 100%)",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
  },
  forest: {
    name: "Forest",
    accent: "#2d8a4e",
    accentDark: "#1a5c33",
    accentLight: "#e6f5eb",
    rangeColor: "#b3e0c2",
    emoji: "🌲",
    gradient: "linear-gradient(135deg, #2d8a4e 0%, #1a5c33 60%, #0e3d22 100%)",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80",
  },
  desert: {
    name: "Desert",
    accent: "#e07b39",
    accentDark: "#b85c1e",
    accentLight: "#fdf0e6",
    rangeColor: "#f5cfae",
    emoji: "🏜️",
    gradient: "linear-gradient(135deg, #e07b39 0%, #b85c1e 60%, #7a3c10 100%)",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80",
  },
  ocean: {
    name: "Ocean",
    accent: "#2b5be0",
    accentDark: "#1a3baa",
    accentLight: "#eaeffd",
    rangeColor: "#b3c3f8",
    emoji: "🌊",
    gradient: "linear-gradient(135deg, #2b5be0 0%, #1a3baa 60%, #0d2270 100%)",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=80",
  },
};

const HOLIDAYS = {
  "1-1": "New Year's Day 🎉",
  "2-14": "Valentine's Day 💝",
  "3-8": "Women's Day 🌸",
  "4-1": "April Fools' 🤡",
  "5-1": "Labour Day 🛠️",
  "6-21": "Summer Solstice ☀️",
  "10-31": "Halloween 🎃",
  "12-25": "Christmas 🎄",
  "12-31": "New Year's Eve 🥂",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  // 0=Sun → convert to Mon-based (0=Mon)
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function dateKey(y, m, d) { return `${y}-${m}-${d}`; }
function isSameDay(a, b) { return a && b && a.y===b.y && a.m===b.m && a.d===b.d; }
function compareDates(a, b) {
  if (!a || !b) return 0;
  return (a.y*10000+a.m*100+a.d) - (b.y*10000+b.m*100+b.d);
}
function inRange(cell, start, end) {
  if (!start || !end) return false;
  const [s, e] = compareDates(start, end) <= 0 ? [start, end] : [end, start];
  return compareDates(cell, s) > 0 && compareDates(cell, e) < 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function RingBinder() {
  return (
    <div style={{display:"flex",justifyContent:"center",gap:"14px",padding:"10px 0 0",zIndex:10,position:"relative"}}>
      {Array.from({length:12}).map((_,i)=>(
        <div key={i} style={{
          width:"18px",height:"26px",borderRadius:"50%/60% 60% 40% 40%",
          border:"2.5px solid #9aa3af",background:"linear-gradient(180deg,#d4d8dd 0%,#b0b6be 50%,#8a9099 100%)",
          boxShadow:"inset 0 1px 2px rgba(255,255,255,0.5),0 2px 4px rgba(0,0,0,0.25)",
          position:"relative",
        }}>
          <div style={{
            position:"absolute",top:"3px",left:"50%",transform:"translateX(-50%)",
            width:"8px",height:"20px",borderRadius:"50%",
            border:"2px solid #7a8089",background:"transparent",
          }}/>
        </div>
      ))}
    </div>
  );
}

function HeroImage({ theme, month, year, isFlipping }) {
  const t = THEMES[theme];
  return (
    <div style={{
      position:"relative",overflow:"hidden",borderRadius:"4px 4px 0 0",
      height:"clamp(180px,28vw,280px)",
      transform: isFlipping ? "rotateX(-15deg)" : "rotateX(0deg)",
      transition:"transform 0.4s ease",
      transformOrigin:"bottom center",
    }}>
      <img
        src={t.image}
        alt={t.name}
        style={{width:"100%",height:"100%",objectFit:"cover",display:"block",
          filter:"brightness(0.82) saturate(1.1)",
          transition:"opacity 0.5s ease",
        }}
        onError={e=>{e.target.style.display="none";}}
      />
      {/* Diagonal cut overlay */}
      <div style={{
        position:"absolute",bottom:0,left:0,right:0,height:"70px",
        background:`linear-gradient(to bottom right, transparent 49.5%, white 50%)`,
        zIndex:2,
      }}/>
      <div style={{
        position:"absolute",bottom:0,right:0,
        background:t.gradient,
        clipPath:"polygon(30% 100%, 100% 0%, 100% 100%)",
        width:"55%",height:"75px",
        zIndex:1,
      }}/>
      {/* Month/Year badge */}
      <div style={{
        position:"absolute",bottom:"12px",right:"16px",
        color:"white",textAlign:"right",zIndex:3,
        fontFamily:"'Playfair Display',Georgia,serif",
        textShadow:"0 1px 3px rgba(0,0,0,0.3)",
      }}>
        <div style={{fontSize:"clamp(13px,2vw,16px)",fontWeight:400,letterSpacing:"3px",opacity:0.9}}>{year}</div>
        <div style={{fontSize:"clamp(22px,3.5vw,32px)",fontWeight:700,letterSpacing:"1px",lineHeight:1}}>{MONTHS[month].toUpperCase()}</div>
      </div>
    </div>
  );
}

function CalendarGrid({ year, month, theme, rangeStart, rangeEnd, hoverDate, onDayClick, onDayHover }) {
  const t = THEMES[theme];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrev = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const prevMonth = month - 1 < 0 ? 11 : month - 1;
  const prevYear = month - 1 < 0 ? year - 1 : year;
  const nextMonth = month + 1 > 11 ? 0 : month + 1;
  const nextYear = month + 1 > 11 ? year + 1 : year;

  // Effective end for hover preview
  const effectiveEnd = rangeStart && !rangeEnd ? hoverDate : rangeEnd;
  const cells = [];

  // Prev month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    cells.push({ d, m: prevMonth, y: prevYear, dim: true });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ d, m: month, y: year, dim: false });
  }
  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ d, m: nextMonth, y: nextYear, dim: true });
  }

  return (
    <div style={{padding:"0 16px 12px"}}>
      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px",marginBottom:"4px"}}>
        {DAYS_SHORT.map((day, i) => (
          <div key={day} style={{
            textAlign:"center",fontSize:"10px",fontWeight:700,
            letterSpacing:"0.5px",padding:"6px 0",
            color: i>=5 ? t.accent : "#888",
            fontFamily:"'DM Mono',monospace",
          }}>{day}</div>
        ))}
      </div>
      {/* Date cells */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px"}}>
        {cells.map((cell, idx) => {
          const cellObj = { y: cell.y, m: cell.m, d: cell.d };
          const isStart = isSameDay(cellObj, rangeStart);
          const isEnd = isSameDay(cellObj, effectiveEnd);
          const isInRange = inRange(cellObj, rangeStart, effectiveEnd);
          const isToday = cell.d === new Date().getDate() && cell.m === new Date().getMonth() && cell.y === new Date().getFullYear();
          const holidayKey = `${cell.m+1}-${cell.d}`;
          const holiday = !cell.dim && HOLIDAYS[holidayKey];
          const isWeekend = idx % 7 >= 5;

          let bg = "transparent";
          let color = cell.dim ? "#ccc" : (isWeekend ? t.accent : "#333");
          let borderRadius = "6px";
          let fontWeight = "400";
          let boxShadow = "none";

          if (isStart || isEnd) {
            bg = t.accent;
            color = "white";
            fontWeight = "700";
            boxShadow = `0 2px 8px ${t.accent}66`;
          } else if (isInRange) {
            bg = t.rangeColor;
            color = t.accentDark;
          } else if (isToday && !cell.dim) {
            bg = t.accentLight;
            color = t.accentDark;
            fontWeight = "700";
          }

          // Range border radius
          if (isInRange) {
            const col = idx % 7;
            borderRadius = "0";
            if (isStart || (isSameDay({y:cell.y,m:cell.m,d:cell.d}, rangeStart) )) borderRadius = "6px 0 0 6px";
            if (isEnd) borderRadius = "0 6px 6px 0";
          }

          return (
            <div
              key={idx}
              title={holiday || ""}
              onClick={() => !cell.dim && onDayClick(cellObj)}
              onMouseEnter={() => !cell.dim && onDayHover(cellObj)}
              onMouseLeave={() => onDayHover(null)}
              style={{
                position:"relative",
                textAlign:"center",
                padding:"5px 2px",
                cursor: cell.dim ? "default" : "pointer",
                borderRadius,
                background: bg,
                color,
                fontWeight,
                fontSize:"clamp(11px,1.5vw,13px)",
                fontFamily:"'DM Mono',monospace",
                boxShadow,
                transition:"all 0.15s ease",
                userSelect:"none",
                minHeight:"30px",
                display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                gap:"1px",
              }}
            >
              <span>{cell.d}</span>
              {holiday && (
                <span style={{fontSize:"8px",lineHeight:1}}>{holiday.split(" ").pop()}</span>
              )}
              {isToday && !cell.dim && !isStart && !isEnd && (
                <div style={{
                  position:"absolute",bottom:"2px",left:"50%",transform:"translateX(-50%)",
                  width:"4px",height:"4px",borderRadius:"50%",background:t.accent,
                }}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotesPanel({ notes, onNotesChange, rangeStart, rangeEnd, theme, year, month }) {
  const t = THEMES[theme];
  const textareaRef = useRef(null);

  const formatDate = (obj) => {
    if (!obj) return "";
    return `${obj.d} ${MONTHS[obj.m].slice(0,3)} ${obj.y}`;
  };

  const rangeLabel = rangeStart
    ? (rangeEnd && !isSameDay(rangeStart, rangeEnd)
        ? `${formatDate(rangeStart)} → ${formatDate(rangeEnd)}`
        : formatDate(rangeStart))
    : "No date selected";

  return (
    <div style={{
      padding:"14px 16px 16px",
      borderTop:"1px solid #f0f0f0",
      background:"#fafafa",
      borderRadius:"0 0 4px 4px",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
        <div style={{
          width:"8px",height:"8px",borderRadius:"50%",
          background:rangeStart ? t.accent : "#ccc",
          flexShrink:0,
        }}/>
        <span style={{
          fontSize:"10px",fontWeight:600,letterSpacing:"1.5px",
          color: rangeStart ? t.accentDark : "#aaa",
          fontFamily:"'DM Mono',monospace",
          textTransform:"uppercase",
        }}>
          {rangeLabel}
        </span>
      </div>
      <div style={{
        fontFamily:"'Playfair Display',Georgia,serif",
        fontSize:"11px",color:"#999",marginBottom:"6px",letterSpacing:"0.5px",
      }}>Notes</div>
      <textarea
        ref={textareaRef}
        value={notes}
        onChange={e => onNotesChange(e.target.value)}
        placeholder="Jot down anything for this month..."
        style={{
          width:"100%",
          minHeight:"70px",resize:"vertical",
          border:"none",
          borderBottom:`2px solid ${t.accent}44`,
          background:"transparent",
          fontFamily:"'Playfair Display',Georgia,serif",
          fontSize:"12px",color:"#444",
          lineHeight:"22px",
          outline:"none",
          padding:"4px 0",
          backgroundImage:`repeating-linear-gradient(transparent, transparent 21px, #e8e8e8 21px, #e8e8e8 22px)`,
          boxSizing:"border-box",
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [theme, setTheme] = useState("alpine");
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [notes, setNotes] = useState({});
  const [showThemePicker, setShowThemePicker] = useState(false);

  const noteKey = `${year}-${month}`;
  const currentNotes = notes[noteKey] || "";

  const updateNotes = (val) => setNotes(prev => ({...prev, [noteKey]: val}));

  const navigate = useCallback((dir) => {
    setIsFlipping(true);
    setTimeout(() => {
      setMonth(m => {
        const nm = m + dir;
        if (nm < 0) { setYear(y => y - 1); return 11; }
        if (nm > 11) { setYear(y => y + 1); return 0; }
        return nm;
      });
      setIsFlipping(false);
    }, 300);
  }, []);

  const handleDayClick = (cell) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(cell);
      setRangeEnd(null);
    } else {
      if (isSameDay(cell, rangeStart)) {
        setRangeStart(null);
        setRangeEnd(null);
      } else {
        setRangeEnd(cell);
      }
    }
  };

  const clearSelection = () => { setRangeStart(null); setRangeEnd(null); };

  const t = THEMES[theme];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #e8eaed; min-height: 100vh; }
        .calendar-wrapper {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          min-height: 100vh;
          padding: 32px 16px;
          background: linear-gradient(160deg, #dfe3e8 0%, #c8cdd4 100%);
        }
        .calendar-card {
          background: white;
          border-radius: 4px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1), 2px 0 0 #ccc inset, -2px 0 0 #ccc inset;
          position: relative;
          perspective: 800px;
        }
        .nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 16px;
          color: #666;
          transition: background 0.15s, color 0.15s;
        }
        .nav-btn:hover { background: #f0f0f0; color: #333; }
        .theme-dot {
          width: 24px; height: 24px; border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s;
        }
        .theme-dot:hover { transform: scale(1.15); }
        .theme-dot.active { border-color: #333; }
        .clear-btn {
          background: none; border: none; cursor: pointer;
          font-size: 10px; font-family: 'DM Mono', monospace;
          color: #aaa; letter-spacing: 1px;
          text-transform: uppercase; padding: 2px 6px;
          border-radius: 3px; transition: all 0.15s;
        }
        .clear-btn:hover { background: #f5f5f5; color: #666; }
        @media (min-width: 700px) {
          .calendar-wrapper { padding: 48px 24px; }
          .calendar-card { max-width: 800px; display: grid; grid-template-columns: 1fr 1fr; }
          .calendar-hero { grid-column: 1; grid-row: 1; border-radius: 4px 0 0 4px; }
          .calendar-body { grid-column: 2; display: flex; flex-direction: column; }
          .calendar-hero-img { height: 100% !important; min-height: 450px; border-radius: 4px 0 0 4px !important; }
          .calendar-hero-img .diagonal-cut { display: none; }
          .notes-panel { flex: 1; }
        }
      `}</style>
      <div className="calendar-wrapper">
        <div className="calendar-card">
          {/* Binder rings */}
          <div style={{
            position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",
            display:"flex",gap:"14px",zIndex:20,
          }}>
            {Array.from({length:10}).map((_,i)=>(
              <div key={i} style={{
                width:"14px",height:"22px",borderRadius:"40% 40% 50% 50% / 30% 30% 60% 60%",
                background:"linear-gradient(180deg,#bec4cc,#8e96a0)",
                boxShadow:"0 2px 4px rgba(0,0,0,0.2)",
                position:"relative",
              }}>
                <div style={{
                  position:"absolute",top:"2px",left:"50%",transform:"translateX(-50%)",
                  width:"6px",height:"16px",borderRadius:"50%",
                  border:"2px solid #7a8089",
                }}/>
              </div>
            ))}
          </div>

          {/* Hero image */}
          <div className="calendar-hero" style={{position:"relative"}}>
            <HeroImage theme={theme} month={month} year={year} isFlipping={isFlipping}/>
          </div>

          {/* Calendar body */}
          <div className="calendar-body">
            {/* Navigation + controls */}
            <div style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"12px 16px 4px",
              borderBottom:"1px solid #f5f5f5",
            }}>
              <button className="nav-btn" onClick={()=>navigate(-1)}>‹</button>
              <div style={{
                fontFamily:"'Playfair Display',Georgia,serif",
                fontSize:"15px",fontWeight:700,color:"#333",letterSpacing:"0.5px",
              }}>
                {MONTHS[month]} {year}
              </div>
              <button className="nav-btn" onClick={()=>navigate(1)}>›</button>
            </div>

            {/* Theme picker */}
            <div style={{
              display:"flex",alignItems:"center",gap:"8px",
              padding:"8px 16px 4px",
              justifyContent:"space-between",
            }}>
              <div style={{display:"flex",gap:"6px"}}>
                {Object.entries(THEMES).map(([key, th])=>(
                  <button
                    key={key}
                    title={th.name}
                    className={`theme-dot ${theme===key?"active":""}`}
                    style={{background:th.accent}}
                    onClick={()=>setTheme(key)}
                  />
                ))}
              </div>
              {(rangeStart || rangeEnd) && (
                <button className="clear-btn" onClick={clearSelection}>✕ Clear</button>
              )}
            </div>

            {/* Grid */}
            <CalendarGrid
              year={year} month={month} theme={theme}
              rangeStart={rangeStart} rangeEnd={rangeEnd}
              hoverDate={hoverDate}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
            />

            {/* Notes */}
            <NotesPanel
              notes={currentNotes}
              onNotesChange={updateNotes}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              theme={theme}
              year={year}
              month={month}
            />
          </div>
        </div>
      </div>
    </>
  );
}
