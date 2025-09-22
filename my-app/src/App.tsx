import { useEffect, useState } from "react";
import "./App.css";

export default function BlankPage() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id); // cleanup on hot-reload/unmount
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div>
      <h1>This is a test</h1>
      <p>
        Elapsed: {mm}:{ss}
      </p>
    </div>
  );
}
// A blank page with a timer to show hot-reload is working
