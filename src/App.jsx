import { useState, useEffect } from "react";
 
const MOVIES = [
  { id: 1, title: "Interstellar Reborn", genre: "Sci-Fi", rating: 9.1, duration: "2h 49m", language: "Hindi / English", poster: "🚀", description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", price: 220 },
  { id: 2, title: "Phantom Shadows", genre: "Thriller", rating: 8.7, duration: "2h 12m", language: "Hindi", poster: "👁️", description: "A detective uncovers a conspiracy that blurs the line between reality and illusion.", price: 180 },
  { id: 3, title: "Zara & Rohan", genre: "Romance", rating: 8.2, duration: "2h 05m", language: "Hindi", poster: "💞", description: "Two strangers meet on a train journey and discover love is the greatest adventure.", price: 160 },
  { id: 4, title: "Iron Samurai", genre: "Action", rating: 8.9, duration: "2h 28m", language: "Telugu / Hindi", poster: "⚔️", description: "A lone warrior battles an ancient evil threatening to consume the modern world.", price: 200 },
  { id: 5, title: "Jungle Protocol", genre: "Adventure", rating: 8.4, duration: "1h 58m", language: "English / Hindi", poster: "🌿", description: "A scientist discovers a hidden civilization deep in the Amazon rainforest.", price: 190 },
  { id: 6, title: "Karma: The Return", genre: "Drama", rating: 8.6, duration: "2h 35m", language: "Hindi", poster: "🎭", description: "A powerful story of redemption, loss, and the courage to start again.", price: 150 },
];
 
const THEATRES = [
  { id: 1, name: "PVR Cinemas, Connaught Place", city: "Delhi" },
  { id: 2, name: "INOX Mega, Nehru Place", city: "Delhi" },
  { id: 3, name: "Cinepolis, DLF Mall", city: "Delhi" },
];
 
const SHOWTIMES = ["9:30 AM", "12:00 PM", "3:00 PM", "6:30 PM", "9:45 PM"];
 
const generateSeats = (bookedSeats = []) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = 10;
  return rows.map((row) =>
    Array.from({ length: cols }, (_, i) => ({
      id: `${row}${i + 1}`,
      row,
      col: i + 1,
      type: row === "A" || row === "B" ? "vip" : row === "G" || row === "H" ? "economy" : "standard",
      booked: bookedSeats.includes(`${row}${i + 1}`) || Math.random() < 0.25,
    }))
  );
};
 
const seatPrice = { vip: 1.6, standard: 1.0, economy: 0.75 };
 
export default function MovieBookingApp() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([{ name: "Demo User", email: "demo@mail.com", password: "demo123" }]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", name: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payStep, setPayStep] = useState(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [toast, setToast] = useState(null);
  const [filterGenre, setFilterGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [adminTab, setAdminTab] = useState("movies");
 
  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split("T")[0];
  });
 
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
 
  const handleLogin = () => {
    const found = users.find((u) => u.email === loginForm.email && u.password === loginForm.password);
    if (found) {
      setUser(found);
      setPage("home");
      setLoginError("");
    } else {
      setLoginError("Invalid email or password.");
    }
  };
 
  const handleRegister = () => {
    if (!loginForm.name || !loginForm.email || !loginForm.password) {
      setLoginError("All fields required.");
      return;
    }
    if (users.find((u) => u.email === loginForm.email)) {
      setLoginError("Email already registered.");
      return;
    }
    const newUser = { name: loginForm.name, email: loginForm.email, password: loginForm.password };
    setUsers([...users, newUser]);
    setUser(newUser);
    setPage("home");
    setLoginError("");
  };
 
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setSelectedTheatre(null);
    setSelectedDate("");
    setSelectedShow(null);
    setSelectedSeats([]);
    setPage("select-show");
  };
 
  const handleSelectShow = () => {
    if (!selectedTheatre || !selectedDate || !selectedShow) {
      showToast("Please select theatre, date, and show time.", "error");
      return;
    }
    const bookedKey = `${selectedMovie.id}-${selectedTheatre.id}-${selectedDate}-${selectedShow}`;
    const bookedSeats = bookings
      .filter((b) => b.key === bookedKey)
      .flatMap((b) => b.seats.map((s) => s.id));
    setSeats(generateSeats(bookedSeats));
    setSelectedSeats([]);
    setPage("seats");
  };
 
  const toggleSeat = (seat) => {
    if (seat.booked) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : prev.length < 8
        ? [...prev, seat]
        : prev
    );
  };
 
  const totalAmount = selectedSeats.reduce(
    (sum, s) => sum + Math.round(selectedMovie?.price * seatPrice[s.type]),
    0
  );
 
const confirmBooking = async () => {
  const booking = {
    movie: selectedMovie,
    theatre: selectedTheatre,
    date: selectedDate,
    show: selectedShow,
    seats: selectedSeats,
    total: totalAmount,
  };

  try {
    console.log("FETCH START");

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    console.log("FETCH DONE");

    const data = await res.json();

    console.log("Saved:", data);

    setBookings((prev) => [data, ...prev]);

    showToast("🎉 Booking Saved!");
    setPage("confirmation");
  } catch (err) {
    console.log("ERROR:", err);
  }
};
 
  const genres = ["All", ...Array.from(new Set(MOVIES.map((m) => m.genre)))];
  const filteredMovies = MOVIES.filter(
    (m) =>
      (filterGenre === "All" || m.genre === filterGenre) &&
      m.title.toLowerCase().includes(search.toLowerCase())
  );
 
  const seatTypeColor = { vip: "#f5a623", standard: "#4a90e2", economy: "#7ed321" };
 
  const styles = {
    app: { fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0", position: "relative" },
    header: { background: "linear-gradient(90deg, #1a0a2e 0%, #0d0d0d 100%)", borderBottom: "1px solid #2a1a4a", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: 22, fontWeight: 700, color: "#e040fb", letterSpacing: 1 },
    nav: { display: "flex", gap: 8, alignItems: "center" },
    navBtn: { background: "transparent", border: "none", color: "#ccc", cursor: "pointer", padding: "6px 14px", borderRadius: 20, fontSize: 14, transition: "all 0.2s" },
    navBtnActive: { background: "#e040fb22", color: "#e040fb" },
    main: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" },
    card: { background: "#1a1a2e", border: "1px solid #2a1a4a", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" },
    movieGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 },
    poster: { height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, background: "linear-gradient(135deg, #1a0a2e 0%, #2a1a4e 100%)" },
    badge: { display: "inline-block", fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 600 },
    btn: { padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s" },
    btnPrimary: { background: "#e040fb", color: "#fff" },
    btnSecondary: { background: "#2a1a4a", color: "#ccc", border: "1px solid #3a2a5a" },
    btnSuccess: { background: "#4caf50", color: "#fff" },
    input: { width: "100%", padding: "10px 14px", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#f0f0f0", fontSize: 14, outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "10px 14px", background: "#111", border: "1px solid #333", borderRadius: 8, color: "#f0f0f0", fontSize: 14, cursor: "pointer" },
    label: { fontSize: 13, color: "#999", marginBottom: 4, display: "block" },
    seatGrid: { display: "flex", flexDirection: "column", gap: 6, alignItems: "center" },
    toast: { position: "fixed", bottom: 30, right: 30, padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 9999, animation: "fadeIn 0.3s ease" },
    screen: { width: "85%", height: 8, background: "linear-gradient(90deg, transparent, #e040fb44, #e040fb88, #e040fb44, transparent)", borderRadius: 50, margin: "0 auto 24px", position: "relative" },
  };
 
  const PageHeader = ({ title, onBack }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
      {onBack && (
        <button style={{ ...styles.btn, ...styles.btnSecondary, padding: "8px 14px" }} onClick={onBack}>← Back</button>
      )}
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>{title}</h1>
    </div>
  );
 
  if (page === "login") return (
    <div style={{ ...styles.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 380, background: "#1a1a2e", border: "1px solid #3a2a5a", borderRadius: 18, padding: "2.5rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48 }}>🎬</div>
          <h1 style={{ margin: "8px 0 4px", fontSize: 26, color: "#e040fb" }}>CineBook</h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Your premium movie booking experience</p>
        </div>
        <div style={{ display: "flex", marginBottom: 20, background: "#111", borderRadius: 8, padding: 4 }}>
          {["Login", "Register"].map((t, i) => (
            <button key={t} onClick={() => { setIsRegister(i === 1); setLoginError(""); }}
              style={{ flex: 1, padding: "8px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14, background: (i === 1) === isRegister ? "#e040fb" : "transparent", color: (i === 1) === isRegister ? "#fff" : "#888", transition: "all 0.2s" }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {isRegister && (
            <div>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} placeholder="Rahul Kumar" value={loginForm.name} onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })} />
            </div>
          )}
          <div>
            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="demo@mail.com" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input type="password" style={styles.input} placeholder="••••••••" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
          </div>
          {loginError && <div style={{ color: "#f44336", fontSize: 13 }}>{loginError}</div>}
          <button style={{ ...styles.btn, ...styles.btnPrimary, marginTop: 8 }} onClick={isRegister ? handleRegister : handleLogin}>
            {isRegister ? "Create Account" : "Login"} →
          </button>
          {!isRegister && (
            <div style={{ textAlign: "center", fontSize: 12, color: "#666", marginTop: 8 }}>
              Demo: demo@mail.com / demo123
            </div>
          )}
        </div>
      </div>
    </div>
  );
 
  return (
    <div style={styles.app}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
        .movie-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px #e040fb33 !important; }
        .seat-btn:hover:not(.booked) { transform: scale(1.1); }
        .btn-hover:hover { opacity: 0.85; transform: scale(0.99); }
        .show-btn:hover { background: #e040fb !important; color: #fff !important; }
        .genre-pill:hover { background: #e040fb22 !important; }
        ::-webkit-scrollbar { width: 6px } ::-webkit-scrollbar-track { background: #111 } ::-webkit-scrollbar-thumb { background: #3a2a5a; border-radius: 3px }
      `}</style>
 
      <div style={styles.header}>
        <div style={styles.logo} onClick={() => setPage("home")} className="btn-hover" role="button">🎬 CineBook</div>
        <div style={styles.nav}>
          {["home", "bookings", user?.email === "demo@mail.com" && "admin"].filter(Boolean).map((p) => (
            <button key={p} className="btn-hover" style={{ ...styles.navBtn, ...(page === p ? styles.navBtnActive : {}) }} onClick={() => setPage(p)}>
              {p === "home" ? "🎥 Movies" : p === "bookings" ? "🎟 My Bookings" : "⚙️ Admin"}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: "#333", margin: "0 6px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => { setUser(null); setPage("login"); }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e040fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: "#ccc" }}>Logout</span>
          </div>
        </div>
      </div>
 
      <div style={styles.main}>
        {page === "home" && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: "0 0 6px", fontSize: 28 }}>Now Showing 🍿</h1>
              <p style={{ color: "#888", margin: 0 }}>Book your favourite movie in seconds</p>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input style={{ ...styles.input, maxWidth: 260 }} placeholder="🔍 Search movies..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {genres.map((g) => (
                  <button key={g} className="genre-pill" onClick={() => setFilterGenre(g)}
                    style={{ ...styles.btn, padding: "8px 16px", background: filterGenre === g ? "#e040fb" : "#1a1a2e", color: filterGenre === g ? "#fff" : "#aaa", border: "1px solid " + (filterGenre === g ? "#e040fb" : "#333"), fontSize: 13 }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.movieGrid}>
              {filteredMovies.map((m) => (
                <div key={m.id} className="movie-card" style={styles.card} onClick={() => handleSelectMovie(m)}>
                  <div style={styles.poster}>{m.poster}</div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <span style={{ ...styles.badge, background: "#e040fb22", color: "#e040fb" }}>{m.genre}</span>
                      <span style={{ ...styles.badge, background: "#f5a62322", color: "#f5a623" }}>⭐ {m.rating}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>🕐 {m.duration} · {m.language}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#e040fb", fontWeight: 700, fontSize: 15 }}>₹{m.price}</span>
                      <button style={{ ...styles.btn, ...styles.btnPrimary, padding: "6px 14px", fontSize: 12 }}>Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
 
        {page === "select-show" && selectedMovie && (
          <>
            <PageHeader title="Select Show" onBack={() => setPage("home")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
              <div style={{ ...styles.card, cursor: "default" }}>
                <div style={{ ...styles.poster, height: 160, fontSize: 64 }}>{selectedMovie.poster}</div>
                <div style={{ padding: "16px" }}>
                  <h2 style={{ margin: "0 0 8px" }}>{selectedMovie.title}</h2>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <span style={{ ...styles.badge, background: "#e040fb22", color: "#e040fb" }}>{selectedMovie.genre}</span>
                    <span style={{ ...styles.badge, background: "#f5a62322", color: "#f5a623" }}>⭐ {selectedMovie.rating}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6, margin: "0 0 10px" }}>{selectedMovie.description}</p>
                  <div style={{ fontSize: 12, color: "#888" }}>🕐 {selectedMovie.duration} · {selectedMovie.language}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={styles.label}>Select Theatre</label>
                  <select style={styles.select} value={selectedTheatre?.id || ""} onChange={(e) => setSelectedTheatre(THEATRES.find((t) => t.id === +e.target.value))}>
                    <option value="">-- Choose Theatre --</option>
                    {THEATRES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Select Date</label>
                  <select style={styles.select} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                    <option value="">-- Choose Date --</option>
                    {dateOptions.map((d) => <option key={d} value={d}>{new Date(d).toDateString()}</option>)}
                  </select>
                </div>
                {selectedDate && selectedTheatre && (
                  <div>
                    <label style={styles.label}>Select Show Time</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {SHOWTIMES.map((s) => (
                        <button key={s} className="show-btn"
                          style={{ ...styles.btn, background: selectedShow === s ? "#e040fb" : "#1a1a2e", color: selectedShow === s ? "#fff" : "#ccc", border: "1px solid " + (selectedShow === s ? "#e040fb" : "#333") }}
                          onClick={() => setSelectedShow(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <button style={{ ...styles.btn, ...styles.btnPrimary, width: "100%", padding: "13px" }} onClick={handleSelectShow}>
                    Proceed to Seat Selection →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
 
        {page === "seats" && (
          <>
            <PageHeader title="Select Seats" onBack={() => setPage("select-show")} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
              <div>
                <div style={{ textAlign: "center", marginBottom: 8 }}>
                  <div style={styles.screen} />
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 24 }}>SCREEN</div>
                </div>
                {["A", "B"].map((row, ri) => (
                  <div key={row} style={{ ...styles.seatGrid, marginBottom: 4 }}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#f5a623", width: 16 }}>{row}</span>
                      <span style={{ fontSize: 10, color: "#f5a623", marginRight: 4 }}>VIP</span>
                      {seats[ri]?.map((seat) => (
                        <button key={seat.id} className="seat-btn"
                          style={{ width: 28, height: 28, borderRadius: 4, border: "none", cursor: seat.booked ? "not-allowed" : "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.15s",
                            background: seat.booked ? "#333" : selectedSeats.find((s) => s.id === seat.id) ? "#e040fb" : "#f5a62344",
                            color: seat.booked ? "#555" : "#f5a623" }}>
                          {seat.booked ? "✕" : seat.col}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {["C", "D", "E", "F"].map((row, ri) => (
                  <div key={row} style={styles.seatGrid}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#4a90e2", width: 16 }}>{row}</span>
                      <span style={{ fontSize: 10, color: "#4a90e2", marginRight: 4 }}>STD</span>
                      {seats[ri + 2]?.map((seat) => (
                        <button key={seat.id} className="seat-btn" onClick={() => toggleSeat(seat)}
                          style={{ width: 28, height: 28, borderRadius: 4, border: "none", cursor: seat.booked ? "not-allowed" : "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.15s",
                            background: seat.booked ? "#333" : selectedSeats.find((s) => s.id === seat.id) ? "#e040fb" : "#4a90e222",
                            color: seat.booked ? "#555" : "#4a90e2" }}>
                          {seat.booked ? "✕" : seat.col}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {["G", "H"].map((row, ri) => (
                  <div key={row} style={styles.seatGrid}>
                    <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#7ed321", width: 16 }}>{row}</span>
                      <span style={{ fontSize: 10, color: "#7ed321", marginRight: 4 }}>ECO</span>
                      {seats[ri + 6]?.map((seat) => (
                        <button key={seat.id} className="seat-btn" onClick={() => toggleSeat(seat)}
                          style={{ width: 28, height: 28, borderRadius: 4, border: "none", cursor: seat.booked ? "not-allowed" : "pointer", fontSize: 10, fontWeight: 600, transition: "all 0.15s",
                            background: seat.booked ? "#333" : selectedSeats.find((s) => s.id === seat.id) ? "#e040fb" : "#7ed32122",
                            color: seat.booked ? "#555" : "#7ed321" }}>
                          {seat.booked ? "✕" : seat.col}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 20, marginTop: 24, justifyContent: "center" }}>
                  {[["VIP", "#f5a623"], ["Standard", "#4a90e2"], ["Economy", "#7ed321"], ["Selected", "#e040fb"], ["Booked", "#333"]].map(([label, color]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#999" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: color }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ ...styles.card, padding: "20px", cursor: "default", height: "fit-content" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Booking Summary</h3>
                <div style={{ fontSize: 14, color: "#aaa", marginBottom: 16 }}>
                  <div style={{ marginBottom: 6 }}>🎬 {selectedMovie.title}</div>
                  <div style={{ marginBottom: 6 }}>🏛 {selectedTheatre.name}</div>
                  <div style={{ marginBottom: 6 }}>📅 {new Date(selectedDate).toDateString()}</div>
                  <div>🕐 {selectedShow}</div>
                </div>
                <div style={{ borderTop: "1px solid #2a2a4a", paddingTop: 16, marginBottom: 16 }}>
                  {selectedSeats.length === 0 ? (
                    <div style={{ color: "#666", fontSize: 13 }}>No seats selected (max 8)</div>
                  ) : (
                    selectedSeats.map((s) => (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: seatTypeColor[s.type] }}>Seat {s.id} ({s.type})</span>
                        <span>₹{Math.round(selectedMovie.price * seatPrice[s.type])}</span>
                      </div>
                    ))
                  )}
                </div>
                {selectedSeats.length > 0 && (
                  <>
                    <div style={{ borderTop: "1px solid #2a2a4a", paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
                      <span>Total</span><span style={{ color: "#e040fb" }}>₹{totalAmount}</span>
                    </div>
                    <button style={{ ...styles.btn, ...styles.btnPrimary, width: "100%", padding: "12px" }} onClick={() => setPayStep("method")}>
                      Proceed to Pay
                    </button>
                  </>
                )}
              </div>
            </div>
 
            {payStep === "method" && (
              <div style={{ position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                <div style={{ background: "#1a1a2e", border: "1px solid #3a2a5a", borderRadius: 16, padding: "2rem", width: 380 }}>
                  <h2 style={{ margin: "0 0 20px", textAlign: "center" }}>💳 Payment</h2>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 20, textAlign: "center" }}>
                    Amount: <span style={{ color: "#e040fb", fontSize: 22, fontWeight: 700 }}>₹{totalAmount}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {[["upi", "📱 UPI / Google Pay"], ["card", "💳 Credit / Debit Card"], ["netbanking", "🏦 Net Banking"], ["wallet", "👛 Paytm Wallet"]].map(([key, label]) => (
                      <button key={key} onClick={() => setPayMethod(key)}
                        style={{ ...styles.btn, textAlign: "left", background: payMethod === key ? "#e040fb22" : "#111", color: payMethod === key ? "#e040fb" : "#ccc", border: "1px solid " + (payMethod === key ? "#e040fb" : "#333"), padding: "12px 16px" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {payMethod === "upi" && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={styles.label}>UPI ID</label>
                      <input style={styles.input} placeholder="yourname@upi" defaultValue="demo@okaxis" />
                    </div>
                  )}
                  {payMethod === "card" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                      <input style={styles.input} placeholder="Card Number" defaultValue="4111 1111 1111 1111" />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input style={styles.input} placeholder="MM/YY" defaultValue="12/27" />
                        <input style={styles.input} placeholder="CVV" defaultValue="123" type="password" />
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ ...styles.btn, ...styles.btnSecondary, flex: 1 }} onClick={() => setPayStep(null)}>Cancel</button>
                    <button
  style={{ ...styles.btn, ...styles.btnSuccess, flex: 1 }}
  onClick={async () => await confirmBooking()}
>
  Pay ₹{totalAmount}
</button>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 12 }}>🔒 Secure dummy payment — no real transaction</div>
                </div>
              </div>
            )}
          </>
        )}
 
        {page === "confirmation" && bookings[0] && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <h1 style={{ color: "#4caf50", margin: "0 0 8px" }}>Booking Confirmed!</h1>
              <p style={{ color: "#aaa" }}>Your tickets have been booked successfully</p>
            </div>
            <div style={{ ...styles.card, maxWidth: 500, margin: "0 auto", padding: "24px", cursor: "default", border: "1px solid #4caf5044" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{bookings[0].movie.poster}</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{bookings[0].movie.title}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#888" }}>Booking ID</div>
                  <div style={{ fontWeight: 700, color: "#e040fb", fontSize: 13 }}>#{bookings[0].id.toString().slice(-8)}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[["🏛 Theatre", bookings[0].theatre.name], ["📅 Date", new Date(bookings[0].date).toDateString()], ["🕐 Show", bookings[0].show], ["🎟 Seats", bookings[0].seats.map((s) => s.id).join(", ")]].map(([label, value]) => (
                  <div key={label} style={{ background: "#111", borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #2a2a4a", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
                <span>Total Paid</span>
                <span style={{ color: "#4caf50" }}>₹{bookings[0].total}</span>
              </div>
              <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#666" }}>via {bookings[0].payMethod.toUpperCase()}</div>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setPage("home")}>Book Another Movie</button>
              <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={() => setPage("bookings")}>My Bookings</button>
            </div>
          </>
        )}
 
        {page === "bookings" && (
          <>
            <PageHeader title="My Bookings 🎟" />
            {bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🍿</div>
                <div style={{ fontSize: 18, marginBottom: 8 }}>No bookings yet!</div>
                <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={() => setPage("home")}>Browse Movies</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {bookings.map((b) => (
                  <div key={b.id} style={{ ...styles.card, padding: "18px", cursor: "default", display: "grid", gridTemplateColumns: "auto 1fr auto" }}>
                    <div style={{ fontSize: 36, marginRight: 16 }}>{b.movie.poster}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{b.movie.title}</div>
                      <div style={{ fontSize: 13, color: "#aaa" }}>🏛 {b.theatre.name}</div>
                      <div style={{ fontSize: 13, color: "#aaa" }}>📅 {new Date(b.date).toDateString()} · 🕐 {b.show}</div>
                      <div style={{ fontSize: 13, color: "#aaa" }}>🎟 {b.seats.map((s) => s.id).join(", ")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#e040fb", fontWeight: 700, fontSize: 20 }}>₹{b.total}</div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>#{b.id.toString().slice(-8)}</div>
                      <span style={{ ...styles.badge, background: "#4caf5022", color: "#4caf50", marginTop: 8, display: "inline-block" }}>✓ Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
 
        {page === "admin" && (
          <>
            <PageHeader title="⚙️ Admin Panel" />
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {["movies", "bookings", "analytics"].map((t) => (
                <button key={t} onClick={() => setAdminTab(t)}
                  style={{ ...styles.btn, background: adminTab === t ? "#e040fb" : "#1a1a2e", color: adminTab === t ? "#fff" : "#aaa", border: "1px solid " + (adminTab === t ? "#e040fb" : "#333"), textTransform: "capitalize" }}>
                  {t}
                </button>
              ))}
            </div>
            {adminTab === "movies" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {MOVIES.map((m) => (
                  <div key={m.id} style={{ ...styles.card, display: "flex", alignItems: "center", padding: "14px 18px", gap: 16, cursor: "default" }}>
                    <div style={{ fontSize: 28 }}>{m.poster}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{m.title}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>{m.genre} · {m.duration} · ⭐{m.rating}</div>
                    </div>
                    <div style={{ color: "#e040fb", fontWeight: 700 }}>₹{m.price}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ ...styles.btn, ...styles.btnSecondary, padding: "6px 14px", fontSize: 13 }}>Edit</button>
                      <button style={{ ...styles.btn, background: "#f4433622", color: "#f44336", border: "1px solid #f4433644", padding: "6px 14px", fontSize: 13 }}>Delete</button>
                    </div>
                  </div>
                ))}
                <button style={{ ...styles.btn, ...styles.btnPrimary, alignSelf: "flex-start", marginTop: 8 }} onClick={() => showToast("Add movie form would open here")}>
                  + Add New Movie
                </button>
              </div>
            )}
            {adminTab === "bookings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {bookings.length === 0 ? <div style={{ color: "#666" }}>No bookings yet across all users.</div> : bookings.map((b) => (
                  <div key={b.id} style={{ ...styles.card, padding: "14px 18px", cursor: "default" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div><span style={{ fontWeight: 700 }}>{b.movie.title}</span> · {b.seats.length} seat(s) · {new Date(b.date).toDateString()}</div>
                      <div style={{ color: "#e040fb", fontWeight: 700 }}>₹{b.total}</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Booking ID: #{b.id.toString().slice(-8)} · Booked at: {b.bookedAt}</div>
                  </div>
                ))}
              </div>
            )}
            {adminTab === "analytics" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 16 }}>
                {[["Total Movies", MOVIES.length, "#e040fb"], ["Total Bookings", bookings.length, "#4caf50"], ["Tickets Sold", bookings.reduce((s, b) => s + b.seats.length, 0), "#f5a623"], ["Revenue", "₹" + bookings.reduce((s, b) => s + b.total, 0), "#4a90e2"]].map(([label, val, color]) => (
                  <div key={label} style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
 
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#f44336" : "#4caf50" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}