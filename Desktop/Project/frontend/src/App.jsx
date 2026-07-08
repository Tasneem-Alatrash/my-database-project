import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Classify from "./pages/Classify";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/classify" element={<Classify />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/listings/:id" element={<ListingDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
