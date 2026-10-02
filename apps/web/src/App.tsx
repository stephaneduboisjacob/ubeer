import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import L, { type LeafletEvent, type Layer } from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet-draw";

type Region = { id: string; name: string; ageGate: number; minimumOrderCents: number; deliveryFeeCents: number; geometry?: unknown; active?: boolean };
type Product = { id: string; name: string; description: string; priceCents: number; stock: number; isTest: boolean };
type User = { id: string; name: string | null; email: string; role: string };
type Catalog = { region: Region; products: Product[] };
type CheckoutResult = { orderId: string; checkoutLink: string; statusToken: string; deliveryCode: string };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const options: RequestInit = {
    ...init,
    credentials: "include",
    headers: { ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...init?.headers },
  };
  let response = await fetch(url, options);
  const authAction = url.split("?")[0];
  const mayRefresh = !["/api/auth/login", "/api/auth/register", "/api/auth/refresh", "/api/auth/logout"].includes(authAction ?? "");
  if (response.status === 401 && mayRefresh) {
    const refreshed = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
    if (refreshed.ok) response = await fetch(url, options);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data as T;
}

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> };

function InstallAppAction() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  useEffect(() => {
    const checkInstalled = () => setInstalled(window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const capture = (event: Event) => { event.preventDefault(); setPromptEvent(event as InstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setPromptEvent(null); };
    checkInstalled();
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", capture); window.removeEventListener("appinstalled", onInstalled); };
  }, []);
  async function install() {
    if (!promptEvent) { setShowGuide(true); return; }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  }
  if (installed) return null;
  return <><button className="install-button" onClick={() => void install()}><span>↓</span> Install app</button>{showGuide && <div className="modal-backdrop" onClick={() => setShowGuide(false)}><div className="install-guide" role="dialog" aria-modal="true" aria-labelledby="install-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowGuide(false)} aria-label="Close">×</button><div className="login-orbit">u<span>.</span></div><div className="eyebrow">UBEER IN YOUR POCKET</div><h2 id="install-title">Add uBeer to your home screen.</h2><p>Get the full ordering and driver app experience with an app icon and its own app window.</p><div className="install-steps"><b>iPhone or iPad</b><span>Open this page in Safari, tap Share, then choose “Add to Home Screen”.</span><b>Android</b><span>Open this page in Chrome and tap “Install app” or “Add to Home screen”.</span></div><button className="button-dark full" onClick={() => setShowGuide(false)}>Got it</button></div></div>}</>;
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="site-header"><Link to="/" className="brand" onClick={closeMenu}><span className="brand-mark">u</span><span>ubeer<span className="brand-dot">.</span></span></Link><button className="mobile-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "×" : "☰"}</button><nav className={menuOpen ? "mobile-menu-open" : ""}><Link to="/account" onClick={closeMenu}>My orders</Link><Link to="/driver" onClick={closeMenu}>Driver app</Link><Link to="/admin" onClick={closeMenu}>Admin</Link><a className="nav-cta" href="/#shop" onClick={closeMenu}>Start an order <span>↗</span></a><InstallAppAction/></nav></header>;
}

function HomePage() {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number; label?: string } | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [checked, setChecked] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [ageVerified, setAgeVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null);
  const catalogQuery = useQuery({ queryKey: ["catalog", region?.id], queryFn: () => api<Catalog>(`/api/catalog?regionId=${region!.id}`), enabled: Boolean(region?.id) });
  const products = catalogQuery.data?.products ?? [];
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotalCents = products.reduce((sum, product) => sum + product.priceCents * (cart[product.id] ?? 0), 0);

  async function lookupAddress(event?: FormEvent) {
    event?.preventDefault();
    if (!address.trim()) return;
    setBusy(true); setError(""); setNotice(""); setChecked(false);
    try {
      const found = await api<{ latitude: number; longitude: number; label: string }>(`/api/geocode?query=${encodeURIComponent(address)}`);
      await checkCoordinate(found.latitude, found.longitude, found.label);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function checkCoordinate(latitude: number, longitude: number, label?: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await api<{ available: boolean; region: Region | null }>(`/api/regions/check?latitude=${latitude}&longitude=${longitude}`);
      setLocation({ latitude, longitude, label }); setRegion(result.region); setChecked(true); setCart({});
      if (!result.available) setNotice("We are not delivering here just yet. Join the waitlist and we’ll let you know when we arrive.");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  function useMyLocation() {
    setError("");
    if (!navigator.geolocation) { setError("Location services are not available in this browser."); return; }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => void checkCoordinate(position.coords.latitude, position.coords.longitude, "Current location"),
      () => { setBusy(false); setError("We could not access your location. Enter an address instead."); },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  async function joinWaitlist(event: FormEvent) {
    event.preventDefault(); setError("");
    try {
      await api("/api/waitlist", { method: "POST", body: JSON.stringify({ email, latitude: location?.latitude, longitude: location?.longitude }) });
      setNotice("You’re on the list. We’ll email you when uBeer reaches your area.");
    } catch (e) { setError((e as Error).message); }
  }

  async function addProduct(product: Product) {
    if (!region || !location) return;
    const nextQuantity = (cart[product.id] ?? 0) + 1;
    if (nextQuantity > 24) return;
    setError(""); setBusy(true);
    try {
      await api("/api/cart/validate", { method: "POST", body: JSON.stringify({ regionId: region.id, latitude: location.latitude, longitude: location.longitude, items: [{ productId: product.id, quantity: nextQuantity }] }) });
      setCart((previous) => ({ ...previous, [product.id]: nextQuantity }));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function startCheckout(event: FormEvent) {
    event.preventDefault(); setError("");
    if (!region || !location) return;
    const items = Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([productId, quantity]) => ({ productId, quantity }));
    if (!items.length) { setError("Add a product to your cart first."); return; }
    if (!ageVerified) { setError(`Please confirm that you are at least ${region.ageGate}.`); return; }
    setBusy(true);
    try {
      const result = await api<CheckoutResult>("/api/checkout", { method: "POST", body: JSON.stringify({ regionId: region.id, latitude: location.latitude, longitude: location.longitude, items, ageVerified, customerEmail: email }) });
      sessionStorage.setItem(`ubeer-order-token:${result.orderId}`, result.statusToken);
      setCheckout(result);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> GOOD TIMES, CLOSE BY</div>
        <h1>Your weekend<br />called. <span>We’re on<br className="mobile-break" /> our way.</span></h1>
        <p className="hero-lede">Thoughtful local delivery for the moments that make the evening. Find out if we’re in your neighbourhood.</p>
        <form className="address-search" onSubmit={lookupAddress}>
          <span className="pin-icon">⌖</span>
          <input aria-label="Address or postal code" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address or postal code" />
          <button disabled={busy} aria-label="Check delivery area">{busy ? "…" : "→"}</button>
        </form>
        <button className="location-link" onClick={useMyLocation}><span>◎</span> Use my current location</button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
      <div className="hero-art" aria-label="Illustration of a cold drink and local delivery bag">
        <div className="sun-orb" /><div className="art-caption"><span>GOOD DRINKS.</span><span>GOOD COMPANY.</span></div>
        <div className="delivery-bag"><div className="bag-handle"/><div className="bag-logo">u<span>.</span></div><div className="bag-label">LOCAL<br/>DELIVERY</div></div>
        <div className="bottle bottle-one"><div className="bottle-cap"/><div className="bottle-neck"/><div className="bottle-body"><div className="bottle-label"><b>HEINEKEN</b><span>EST. 1873</span><i>★</i></div></div></div>
        <div className="bottle bottle-two"><div className="bottle-cap"/><div className="bottle-neck"/><div className="bottle-body"><div className="bottle-label pale"><b>CHEERS</b><span>LOCAL GOOD</span></div></div></div>
        <div className="sparkle sparkle-one">✳</div><div className="sparkle sparkle-two">✦</div><div className="art-sticker">GOOD<br/>EVENING <span>↗</span></div>
        <div className="hero-note"><span className="hero-note-icon">↗</span><span>DELIVERY THAT<br/><b>FEELS NEARBY</b></span></div>
      </div>
    </section>

    <section className="service-ribbon"><div><span>01</span><b>LOCAL FIRST</b><small>Made for your neighbourhood</small></div><div><span>02</span><b>RIGHT ON TIME</b><small>Delivered by a real local driver</small></div><div><span>03</span><b>GOOD TO GO</b><small>Age-checked, every time</small></div></section>

    <section className="shop-section" id="shop">
      <div className="section-heading"><div><div className="eyebrow">THE NEIGHBOURHOOD CHECK</div><h2>What’s in your<br/><span>neck of the woods?</span></h2></div><p>We deliver within the service areas our local drivers know best. Pop in your address and we’ll take a look.</p></div>
      {!checked && <div className="availability-card"><div className="availability-symbol">⌖</div><div><h3>First, let’s find your corner.</h3><p>We’ll check your address against our active delivery areas.</p></div><form onSubmit={lookupAddress}><input aria-label="Address or postal code" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city or postal code"/><button className="button-dark" disabled={busy}>Check my area <span>→</span></button></form></div>}
      {checked && region && <div className="catalog-layout">
        <div className="catalog-main"><div className="available-banner"><span className="available-dot"/><div><b>Good news — we deliver to {region.name}.</b><small>Delivery fee ${((region.deliveryFeeCents ?? 0) / 100).toFixed(2)} · {region.ageGate}+ only</small></div><button onClick={() => { setChecked(false); setRegion(null); setCart({}); }}>Change location</button></div>
          {catalogQuery.isLoading && <div className="loading-card">Loading the neighbourhood list…</div>}
          {products.length > 0 && <div className="product-card"><div className="product-art"><div className="six-pack"><div className="pack-handle"/><div className="pack-cans"><i/><i/><i/><i/><i/><i/></div><div className="pack-front"><b>HEINEKEN</b><span>PURE MALT LAGER</span><i>★</i><small>6-PACK</small></div></div><div className="test-stamp">TEST<br/>LISTING</div></div><div className="product-info"><div className="product-tag">THE CLASSIC</div><h3>{products[0]!.name}</h3><p>{products[0]!.description}</p><div className="product-bottom"><div><b>${(products[0]!.priceCents / 100).toFixed(2)}</b><small>USD · 6 bottles</small></div><div className="quantity-control"><button onClick={() => setCart((prev) => ({ ...prev, [products[0]!.id]: Math.max(0, (prev[products[0]!.id] ?? 0) - 1) }))} aria-label="Remove one">−</button><span>{cart[products[0]!.id] ?? 0}</span><button disabled={busy} onClick={() => void addProduct(products[0]!)} aria-label="Add one">+</button></div></div></div></div>}
          {!catalogQuery.isLoading && products.length === 0 && <div className="loading-card">Nothing on the local menu yet. Check back soon.</div>}
        </div>
        <aside className="cart-card"><div className="cart-header"><span>YOUR BAG</span><span className="cart-count">{itemCount}</span></div><div className="cart-empty" hidden={itemCount > 0}><div className="cart-line-icon">⌁</div><b>A good evening starts somewhere.</b><p>Add something from the local list and we’ll get it moving.</p></div>
          {itemCount > 0 && <><div className="cart-summary"><span>{itemCount} × {products[0]?.name}</span><b>${(subtotalCents / 100).toFixed(2)}</b></div><div className="cart-summary muted"><span>Delivery fee</span><span>${((region.deliveryFeeCents ?? 0) / 100).toFixed(2)}</span></div><div className="cart-total"><span>Estimated total</span><b>${((subtotalCents + (region.deliveryFeeCents ?? 0)) / 100).toFixed(2)}</b></div>
            <form onSubmit={startCheckout} className="checkout-form"><label>Email for your receipt<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"/></label><label className="age-confirm"><input type="checkbox" checked={ageVerified} onChange={(e) => setAgeVerified(e.target.checked)}/><span>I confirm I am at least {region.ageGate} years old.</span></label><button className="button-dark full" disabled={busy || !ageVerified}>{busy ? "Getting checkout ready…" : "Continue to secure checkout ↗"}</button><p className="checkout-footnote">Bitcoin · Lightning · on-chain</p></form>
          </>}
          {error && <p className="form-error">{error}</p>}
        </aside>
      </div>}
      {checked && !region && <div className="waitlist-card"><div className="waitlist-art">✳</div><div><div className="eyebrow">WE’RE NOT THERE YET</div><h3>{notice || "Your neighbourhood is on our list."}</h3><p>Leave your email and we’ll let you know when local delivery reaches you.</p><form onSubmit={joinWaitlist}><input type="email" aria-label="Email for waitlist" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your email address"/><button className="button-dark">Keep me posted <span>→</span></button></form></div></div>}
    </section>
    <section className="responsible-note"><span className="responsible-icon">✓</span><p><b>Good times, responsibly.</b> Alcohol delivery is only available to eligible adults. A valid ID is required at handoff. Please enjoy thoughtfully.</p><span className="note-age">{region?.ageGate ?? "19/21"}+</span></section>
    <footer><Link to="/" className="brand"><span className="brand-mark">u</span><span>ubeer<span className="brand-dot">.</span></span></Link><span>Made for the neighbourhood. © {new Date().getFullYear()} uBeer</span><Link to="/driver">Become a driver ↗</Link></footer>

    {checkout && <div className="modal-backdrop"><div className="checkout-modal"><button className="modal-close" onClick={() => setCheckout(null)} aria-label="Close">×</button><div className="modal-check">✓</div><div className="eyebrow">YOUR ORDER IS READY</div><h2>One last stop.</h2><p>Your order is waiting at BTCPay’s secure checkout. Keep this delivery code for your driver.</p><div className="delivery-code"><span>YOUR HANDOFF CODE</span><b>{checkout.deliveryCode}</b><small>Show this code to your driver when your order arrives.</small></div><a className="button-dark full modal-pay" href={checkout.checkoutLink}>Pay securely with Bitcoin ↗</a><Link className="modal-status" to={`/orders/${checkout.orderId}/status`} onClick={() => setCheckout(null)}>Track this order instead</Link><small className="modal-disclaimer">Payment is handled by BTCPay Server.</small></div></div>}
  </>;
}

function OrderStatusPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token") ?? (id ? sessionStorage.getItem(`ubeer-order-token:${id}`) : null);
  const me = useQuery({ queryKey: ["current-user"], queryFn: () => api<{ user: User }>("/api/auth/me"), enabled: Boolean(id), retry: false });
  const query = useQuery({ queryKey: ["order-status", id, token, me.data?.user.id], queryFn: () => api<{ id: string; status: string; totalCents: number; currency: string; regionName: string; items: Array<{ productName: string; quantity: number; unitPriceCents: number }> }>(`/api/orders/${id}/status${token ? `?token=${encodeURIComponent(token)}` : ""}`), enabled: Boolean(id && (token || me.data?.user)), refetchInterval: 5000 });
  const stages = ["pending_payment", "paid", "accepted", "preparing", "out_for_delivery", "delivered"];
  const activeIndex = stages.indexOf(query.data?.status ?? "pending_payment");
  return <main className="subpage narrow-page"><div className="eyebrow">ORDER TRACKING</div><h1>Your evening,<br/><span>in good hands.</span></h1>{query.isLoading && <div className="loading-card">Finding your order…</div>}{query.error && <div className="alert-error">{(query.error as Error).message}</div>}{query.data && <div className="tracking-card"><div className="tracking-head"><div><span className="eyebrow">ORDER</span><b>#{query.data.id.slice(0, 8).toUpperCase()}</b></div><span className="status-pill">{query.data.status.replaceAll("_", " ")}</span></div><div className="tracking-progress">{stages.map((stage, index) => <div className={`track-step ${index <= activeIndex ? "done" : ""}`} key={stage}><i>{index < activeIndex ? "✓" : index + 1}</i><span>{stage.replaceAll("_", " ")}</span></div>)}</div><div className="receipt-lines">{query.data.items.map((item) => <div key={item.productName}><span>{item.quantity} × {item.productName}</span><b>${((item.quantity * item.unitPriceCents) / 100).toFixed(2)}</b></div>)}</div><div className="tracking-total"><span>Delivering to {query.data.regionName}</span><b>${(query.data.totalCents / 100).toFixed(2)} {query.data.currency}</b></div><p>We refresh your order status automatically.</p></div>}<Link to="/" className="text-link">← Back to uBeer</Link></main>;
}

function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const ordersQuery = useQuery({ queryKey: ["customer-orders"], queryFn: () => api<{ orders: Array<{ id: string; status: string; createdAt: string; totalCents: number; currency: string; region: { name: string }; items: Array<{ productName: string; quantity: number }> }> }>("/api/orders"), enabled: Boolean(user), refetchInterval: 30_000 });
  useEffect(() => { void api<{ user: User }>("/api/auth/me").then((result) => setUser(result.user)).catch(() => undefined); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    const form = new FormData(event.currentTarget);
    const payload = { name: form.get("name"), email: form.get("email"), password: form.get("password") };
    try {
      const result = await api<{ user: User }>(register ? "/api/auth/register" : "/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
      setUser(result.user);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <main className="subpage account-page"><div className="eyebrow">YOUR UBEER ACCOUNT</div><h1>Good to see<br/><span>you again.</span></h1>{!user ? <div className="account-login form-card"><h2>{register ? "Create an account" : "Sign in to your orders"}</h2>{error && <div className="alert-error">{error}</div>}<form onSubmit={submit}>{register && <label>Your name<input name="name" required minLength={2}/></label>}<label>Email<input name="email" type="email" required/></label><label>Password<input name="password" type="password" minLength={12} required/></label><button className="button-dark full" disabled={busy}>{busy ? "One moment…" : register ? "Create account →" : "Sign in →"}</button></form><button className="account-switch" onClick={() => { setRegister((value) => !value); setError(""); }}>{register ? "Already have an account? Sign in" : "New here? Create an account"}</button></div> : <section className="account-orders"><div className="account-heading"><div><span className="eyebrow">SIGNED IN AS</span><b>{user.email}</b></div><button onClick={() => void api("/api/auth/logout", { method: "POST" }).then(() => setUser(null))}>Sign out ↗</button></div><h2>Your orders</h2>{ordersQuery.isLoading && <div className="loading-card">Loading order history…</div>}{ordersQuery.data?.orders.length ? ordersQuery.data.orders.map((order) => <Link className="history-order" to={`/orders/${order.id}/status`} key={order.id}><div><b>#{order.id.slice(0, 8).toUpperCase()}</b><small>{new Date(order.createdAt).toLocaleDateString()} · {order.region.name}</small><small>{order.items.map((item) => `${item.quantity} × ${item.productName}`).join(", ")}</small></div><div><span className="status-pill">{order.status.replaceAll("_", " ")}</span><b>${(order.totalCents / 100).toFixed(2)} {order.currency}</b></div></Link>) : !ordersQuery.isLoading && <div className="loading-card">No orders yet. Find your neighbourhood and start your first order.</div>}</section>}<Link to="/" className="text-link">← Browse uBeer</Link></main>;
}

function DriverPage() {
  const { data: regionData } = useQuery({ queryKey: ["regions"], queryFn: () => api<{ regions: Region[] }>("/api/regions") });
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [online, setOnline] = useState(false);
  const ordersQuery = useQuery({ queryKey: ["driver-orders"], queryFn: () => api<{ orders: Array<Record<string, unknown>> }>("/api/driver/orders"), enabled: Boolean(user), refetchInterval: 10_000 });
  const earningsQuery = useQuery({ queryKey: ["driver-earnings"], queryFn: () => api<{ totalEarningsCents: number; platformFeePercent: number }>("/api/driver/earnings"), enabled: Boolean(user), refetchInterval: 60_000 });
  useEffect(() => { void api<{ user: User }>("/api/auth/me").then((result) => { if (result.user.role === "DRIVER") setUser(result.user); }).catch(() => undefined); }, []);
  useEffect(() => {
    if (!online || !navigator.geolocation) return;
    const ping = () => navigator.geolocation.getCurrentPosition((position) => {
      void api("/api/driver/location", { method: "POST", body: JSON.stringify({ latitude: position.coords.latitude, longitude: position.coords.longitude }) }).catch((e) => setError((e as Error).message));
    }, () => setError("Allow location access while you are online."), { enableHighAccuracy: true, timeout: 10_000 });
    const timer = window.setInterval(ping, 30_000);
    return () => window.clearInterval(timer);
  }, [online]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try { const result = await api<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) }); setUser(result.user); setNotice("You’re signed in. Switch on when you’re ready to drive."); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  async function application(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try { await api("/api/drivers/applications", { method: "POST", body: form }); setNotice("Application received. We’ll review your details and email you after admin review."); (event.currentTarget as HTMLFormElement).reset(); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  async function toggleOnline() {
    setError("");
    try {
      if (!online && navigator.geolocation) await new Promise<void>((resolve, reject) => navigator.geolocation.getCurrentPosition(async (position) => {
        try { await api("/api/driver/location", { method: "POST", body: JSON.stringify({ latitude: position.coords.latitude, longitude: position.coords.longitude }) }); resolve(); } catch (e) { reject(e); }
      }, reject, { enableHighAccuracy: true, timeout: 10_000 }));
      const result = await api<{ online: boolean }>("/api/driver/online", { method: "POST", body: JSON.stringify({ online: !online }) }); setOnline(result.online);
    } catch (e) { setError((e as Error).message); }
  }

  async function orderAction(id: string, status: string) {
    const deliveryCode = status === "delivered" ? window.prompt("Ask the customer for their six-digit delivery code") ?? undefined : undefined;
    try { await api(`/api/driver/orders/${id}/status`, { method: "POST", body: JSON.stringify({ status, deliveryCode }) }); await ordersQuery.refetch(); }
    catch (e) { setError((e as Error).message); }
  }

  async function declineOrder(id: string) {
    try { await api(`/api/driver/orders/${id}/decline`, { method: "POST", body: JSON.stringify({}) }); await ordersQuery.refetch(); }
    catch (e) { setError((e as Error).message); }
  }

  const orderNext: Record<string, string> = { paid: "accepted", accepted: "preparing", preparing: "out_for_delivery", out_for_delivery: "delivered" };
  return <main className="subpage driver-page"><div className="driver-intro"><div className="eyebrow">GOOD PEOPLE, GOOD ROUTES</div><h1>Get paid to<br/><span>know your way.</span></h1><p>Join a local crew delivering great evenings across the neighbourhood.</p></div>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    {user ? <div className="driver-dashboard"><div className="driver-toolbar"><div><span className="eyebrow">DRIVER CONSOLE</span><h2>Hey, {user.name || user.email.split("@")[0]}.</h2></div><div className="driver-toolbar-right"><span className="driver-earnings">EARNED <b>${((earningsQuery.data?.totalEarningsCents ?? 0) / 100).toFixed(2)}</b></span><button className={`online-toggle ${online ? "is-online" : ""}`} onClick={toggleOnline}><i/> {online ? "You’re online" : "Go online"}</button></div></div><div className="driver-section-title"><h3>Your assignments</h3><span>Refreshes every 10 sec</span></div>{ordersQuery.data?.orders.length ? ordersQuery.data.orders.map((order) => { const mapsUrl = `https://www.openstreetmap.org/directions?to=${encodeURIComponent(`${String(order.latitude)},${String(order.longitude)}`)}`; return <div className="driver-order" key={String(order.id)}><div><b>Order #{String(order.id).slice(0, 8).toUpperCase()}</b><small>{String(order.status).replaceAll("_", " ")} · {String(order.customerEmail)}</small><a className="driver-map-link" href={mapsUrl} target="_blank" rel="noreferrer">Open delivery location in maps ↗</a></div><div className="driver-order-actions"><button className="button-dark" onClick={() => void orderAction(String(order.id), orderNext[String(order.status)] ?? "accepted")}>{String(orderNext[String(order.status)] ?? "accepted").replaceAll("_", " ")} →</button>{order.status === "paid" && <button className="decline-order" onClick={() => void declineOrder(String(order.id))}>Decline</button>}</div></div>; }) : <div className="loading-card">No orders assigned yet. Keep your location on while you’re available.</div>}</div> : <div className="driver-forms"><div className="driver-login form-card"><div className="eyebrow">ALREADY ON THE CREW?</div><h2>Driver sign in</h2><form onSubmit={login}><label>Email<input name="email" type="email" required placeholder="you@example.com"/></label><label>Password<input name="password" type="password" required minLength={12} placeholder="Your password"/></label><button className="button-dark full" disabled={busy}>Sign in →</button></form><p>Approved drivers only. Your account starts after admin review.</p></div><div className="driver-application form-card"><div className="eyebrow">COME DRIVE WITH US</div><h2>Apply to drive</h2><form onSubmit={application}><div className="two-fields"><label>Full name<input name="name" required minLength={2}/></label><label>Phone<input name="phone" type="tel" required/></label></div><label>Email<input name="email" type="email" required/></label><div className="two-fields"><label>Vehicle<input name="vehicle" required placeholder="Car, bicycle…"/></label><label>License number<input name="licenseNumber" required/></label></div><label>Preferred region<select name="regionId" required defaultValue=""><option value="" disabled>Select a region</option>{regionData?.regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}</select></label><label>ID document <small className="field-hint">JPEG, PNG or PDF · 5 MB maximum</small><input name="idDocument" type="file" accept="image/jpeg,image/png,application/pdf" required/></label><button className="button-dark full" disabled={busy}>Send application ↗</button></form><p>Your documents are stored securely and can only be accessed by the admin team.</p></div></div>}
  </main>;
}

type GeoJSONGeometry = { type: string; coordinates: unknown };
function DrawControl({ onDrawn }: { onDrawn: (geometry: GeoJSONGeometry) => void }) {
  const map = useMap();
  useEffect(() => {
    const group = new L.FeatureGroup(); map.addLayer(group);
    const DrawClass = (L.Control as unknown as { Draw: new (options: unknown) => L.Control }).Draw;
    const control = new DrawClass({ position: "topright", draw: { polyline: false, circle: false, circlemarker: false, marker: false, polygon: true, rectangle: true }, edit: { featureGroup: group } });
    map.addControl(control);
    const created = (event: LeafletEvent) => {
      const layer = (event as LeafletEvent & { layer: Layer & { toGeoJSON: () => GeoJSON.Feature } }).layer;
      group.addLayer(layer);
      if (layer.toGeoJSON().geometry) onDrawn(layer.toGeoJSON().geometry as unknown as GeoJSONGeometry);
    };
    map.on("draw:created", created);
    return () => { map.off("draw:created", created); map.removeControl(control); map.removeLayer(group); };
  }, [map, onDrawn]);
  return null;
}

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [resourceError, setResourceError] = useState("");
  const [geometry, setGeometry] = useState<GeoJSONGeometry | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [pending, setPending] = useState(false);
  const dashboard = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => api<Record<string, number>>("/api/admin/dashboard"), enabled: Boolean(user) });
  const adminRegions = useQuery({ queryKey: ["admin-regions"], queryFn: () => api<{ regions: Region[] }>("/api/admin/regions"), enabled: Boolean(user && ["regions", "products"].includes(activeTab)) });
  const adminDrivers = useQuery({ queryKey: ["admin-drivers"], queryFn: () => api<{ drivers: Array<Record<string, unknown>> }>("/api/admin/drivers"), enabled: Boolean(user && activeTab === "payouts") });
  const resourceUrl = useMemo(() => ({ regions: "/api/admin/regions", products: "/api/admin/products", orders: "/api/admin/orders", drivers: "/api/admin/drivers", users: "/api/admin/users", payouts: "/api/admin/payouts", audit: "/api/admin/audit-log", settings: "/api/admin/settings" }[activeTab]), [activeTab]);
  const resource = useQuery({ queryKey: ["admin-resource", activeTab], queryFn: () => api<Record<string, unknown>>(resourceUrl ?? "/api/admin/dashboard"), enabled: Boolean(user && resourceUrl) });
  useEffect(() => { void api<{ user: User }>("/api/auth/me").then((result) => { if (result.user.role === "ADMIN") setUser(result.user); }).catch(() => undefined); }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginError("");
    const form = new FormData(event.currentTarget);
    try { const result = await api<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password"), totp: form.get("totp") }) }); setUser(result.user); }
    catch (e) { setLoginError((e as Error).message); }
  }

  async function perform(work: () => Promise<unknown>) {
    setPending(true); setResourceError("");
    try { await work(); await Promise.all([resource.refetch(), dashboard.refetch(), adminRegions.refetch()]); }
    catch (e) { setResourceError((e as Error).message); }
    finally { setPending(false); }
  }

  async function createRegion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!geometry) { setResourceError("Draw a polygon or rectangle on the map first."); return; }
    const form = new FormData(event.currentTarget);
    await perform(() => api("/api/admin/regions", { method: "POST", body: JSON.stringify({ name: form.get("name"), active: form.get("active") === "on", geometry, minimumOrderCents: Math.round(Number(form.get("minimumOrder") || 0) * 100), deliveryFeeCents: Math.round(Number(form.get("deliveryFee") || 0) * 100), ageGate: Number(form.get("ageGate")) }) }));
    setGeometry(null); (event.currentTarget as HTMLFormElement).reset();
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    await perform(() => api("/api/admin/products", { method: "POST", body: JSON.stringify({ name: form.get("name"), description: form.get("description"), priceCents: Math.round(Number(form.get("price") || 0) * 100), currency: "USD", stock: Number(form.get("stock") || 0), isTest: form.get("isTest") === "on", active: true, regionIds: selectedRegion ? [selectedRegion] : [] }) }));
  }

  async function createPayout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    await perform(() => api("/api/admin/payouts", { method: "POST", body: JSON.stringify({ driverProfileId: form.get("driverProfileId"), amountCents: Math.round(Number(form.get("amount") || 0) * 100), note: form.get("note") }) }));
    (event.currentTarget as HTMLFormElement).reset();
  }

  async function applicationAction(item: Record<string, unknown>, status: string) {
    await perform(async () => {
      const result = await api<{ temporaryPassword?: string }>(`/api/admin/drivers/applications/${item.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (result.temporaryPassword) window.alert(`Temporary driver password (shown once):\n${result.temporaryPassword}`);
    });
  }

  if (!user) return <main className="admin-login-page"><div className="login-orbit">u<span>.</span></div><div className="eyebrow">UBeer OPERATIONS</div><h1>Admin sign in</h1><p>Administrator access requires an authenticator code.</p>{loginError && <div className="alert-error">{loginError}</div>}<form className="form-card admin-login-form" onSubmit={signIn}><label>Email<input name="email" type="email" defaultValue="admin@ubeer.local" required/></label><label>Password<input name="password" type="password" required/></label><label>Authenticator code<input name="totp" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} required placeholder="000 000"/></label><button className="button-dark full">Enter operations ↗</button></form><Link to="/" className="text-link">← Return to uBeer</Link></main>;

  const tabs = ["overview", "orders", "regions", "products", "drivers", "users", "payouts", "audit", "settings"];
  const list = (key: string) => {
    const value = resource.data?.[key];
    return Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
  };
  const rows = activeTab === "regions" ? (adminRegions.data?.regions ?? []) as unknown as Array<Record<string, unknown>> : activeTab === "drivers" ? list("applications") : activeTab === "audit" ? list("entries") : activeTab === "settings" ? [] : list(activeTab);

  return <main className="admin-shell"><aside className="admin-sidebar"><Link className="brand admin-brand" to="/"><span className="brand-mark">u</span><span>ubeer<span className="brand-dot">.</span></span></Link><div className="admin-label">OPERATIONS</div><nav>{tabs.map((tab, index) => <button key={tab} className={activeTab === tab ? "selected" : ""} onClick={() => { setActiveTab(tab); setResourceError(""); }}><span className="admin-nav-icon">{["⌂", "▤", "⌖", "◈", "♧", "♙", "$", "≡", "⚙"][index]}</span>{tab === "overview" ? "Dashboard" : tab[0]!.toUpperCase() + tab.slice(1)}</button>)}</nav><div className="sidebar-user"><span>{user.email.slice(0, 1).toUpperCase()}</span><div><b>{user.name || "Administrator"}</b><small>ADMIN</small></div><button title="Sign out" onClick={() => void api("/api/auth/logout", { method: "POST" }).then(() => setUser(null))}>↗</button></div></aside>
    <section className="admin-content"><header className="admin-topbar"><div><div className="eyebrow">UBeer / {activeTab}</div><h1>{activeTab === "overview" ? "A look around." : activeTab[0]!.toUpperCase() + activeTab.slice(1)}</h1></div><div className="admin-live"><i/> SYSTEM LIVE <span>·</span> {new Date().toLocaleDateString()}</div></header>
      {(resourceError || dashboard.error) && <div className="alert-error">{resourceError || (dashboard.error as Error).message}</div>}
      {activeTab === "overview" ? <><div className="metric-grid">{[["Orders today", dashboard.data?.ordersToday ?? "—", "orders"], ["Paid revenue", dashboard.data ? `$${(dashboard.data.revenueCents / 100).toFixed(2)}` : "—", "USD today"], ["Drivers online", dashboard.data?.activeDrivers ?? "—", "approved"], ["Failed payments", dashboard.data?.failedPayments ?? "—", "today"]].map(([label, number, note]) => <div className="metric-card" key={label}><span>{label}</span><b>{number}</b><small>{note}</small></div>)}</div><div className="admin-welcome"><div><div className="eyebrow">YOUR DAILY BRIEF</div><h2>Good operations<br/>make good evenings.</h2><p>Orders, local coverage and driver activity are all in one place.</p></div><div className="welcome-graphic"><span>u</span><i>✳</i></div></div><div className="quick-links"><button onClick={() => setActiveTab("orders")}>Review orders ↗</button><button onClick={() => setActiveTab("regions")}>Manage delivery regions ↗</button><button onClick={() => setActiveTab("drivers")}>Review driver applications ↗</button></div></> : <>
        {activeTab === "regions" && <><div className="manager-layout"><div className="admin-map-wrap"><MapContainer center={[45.55, -73.72]} zoom={9} scrollWheelZoom className="admin-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{rows.filter((row) => row.geometry).map((row) => <GeoJSON key={String(row.id)} data={row.geometry as GeoJSON.GeoJsonObject} style={{ color: row.active ? "#37684b" : "#df8153", weight: 2, fillOpacity: 0.15 }}/>) }<DrawControl onDrawn={setGeometry}/></MapContainer><p>Draw a polygon or rectangle to define a service area. The test region follows the Island of Montréal coastline.</p></div><form className="form-card manager-form" onSubmit={createRegion}><div className="eyebrow">REGION DETAILS</div><h2>Map a neighbourhood.</h2><label>Region name<input name="name" required placeholder="Downtown area"/></label><div className="two-fields"><label>Delivery fee ($)<input name="deliveryFee" type="number" step="0.01" min="0" defaultValue="5" required/></label><label>Age gate<select name="ageGate"><option value="19">19+</option><option value="21">21+</option></select></label></div><label>Minimum order ($)<input name="minimumOrder" type="number" min="0" step="0.01" defaultValue="0" required/></label><label className="checkbox-line"><input name="active" type="checkbox" defaultChecked/> Active after saving</label><div className={geometry ? "geometry-ready" : "geometry-missing"}>{geometry ? "✓ Delivery boundary drawn" : "Draw the boundary on the map"}</div><button className="button-dark full" disabled={pending}>Save region ↗</button></form></div><div className="table-card region-toggle-list"><h2>Existing regions</h2><div className="table-actions">{rows.map((row) => <div key={String(row.id)}><span>{String(row.name)} · {row.active ? "Active" : "Inactive"}</span><button onClick={() => void perform(() => api(`/api/admin/regions/${row.id}`, { method: "PATCH", body: JSON.stringify({ active: !row.active }) }))}>{row.active ? "Deactivate" : "Activate"}</button></div>)}</div></div></>}
        {activeTab === "products" && <div className="manager-layout"><div className="table-card"><h2>Products</h2><DataTable rows={rows} columns={["name", "priceCents", "stock", "active", "isTest"]}/></div><form className="form-card manager-form" onSubmit={createProduct}><div className="eyebrow">CATALOG</div><h2>Add a product.</h2><label>Name<input name="name" required/></label><label>Description<textarea name="description" rows={3}/></label><div className="two-fields"><label>Price ($)<input name="price" type="number" min="0.01" step="0.01" required/></label><label>Stock<input name="stock" type="number" min="0" defaultValue="0" required/></label></div><label>Available in<select required value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}><option value="">Choose region</option>{adminRegions.data?.regions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}</select></label><label className="checkbox-line"><input name="isTest" type="checkbox"/> Mark as test listing</label><button className="button-dark full" disabled={pending || !selectedRegion}>Add to catalog ↗</button></form></div>}
        {activeTab === "products" && <div className="table-actions product-toggle-list">{rows.map((row) => <div key={String(row.id)}><span>{String(row.name)} · {row.active ? "Active" : "Archived"}</span><button onClick={() => void perform(() => api(`/api/admin/products/${row.id}`, { method: "PATCH", body: JSON.stringify({ active: !row.active }) }))}>{row.active ? "Pause" : "Reactivate"}</button></div>)}</div>}
        {activeTab !== "regions" && activeTab !== "products" && <div className="table-card"><div className="table-heading"><h2>{activeTab === "drivers" ? "Applications & drivers" : `${activeTab[0]!.toUpperCase()}${activeTab.slice(1)} records`}</h2><button className="icon-refresh" onClick={() => void resource.refetch()} title="Refresh">↻</button></div>{activeTab === "settings" ? <div className="settings-summary">{resource.data && Object.entries((resource.data as { btcpay: Record<string, unknown> }).btcpay ?? {}).map(([key, value]) => <div key={key}><span>{key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span><b>{String(value ?? "Not configured")}</b></div>)}<p>BTCPay secrets are read from the server environment and are never shown here.</p></div> : <><DataTable rows={rows} columns={rows.length ? Object.keys(rows[0]!).filter((key) => !["geometry", "metadata", "idDocumentPath", "deliveryOtpHash", "statusAccessTokenHash"].includes(key)).slice(0, 7) : []}/>{activeTab === "drivers" && rows.some((row) => row.status === "pending") && <div className="table-actions">{rows.filter((row) => row.status === "pending").map((row) => <div key={String(row.id)}><span>{String(row.name)} · {String(row.email)}</span><button onClick={() => void applicationAction(row, "approved")}>Approve</button><button className="button-subtle" onClick={() => void applicationAction(row, "rejected")}>Reject</button></div>)}</div>}{activeTab === "users" && <div className="table-actions">{rows.map((row) => <div key={String(row.id)}><span>{String(row.email)} · {row.isBanned ? "Banned" : "Active"}</span><button onClick={() => void perform(() => api(`/api/admin/users/${row.id}/ban`, { method: "PATCH", body: JSON.stringify({ isBanned: !row.isBanned }) }))}>{row.isBanned ? "Unban" : "Ban"}</button></div>)}</div>}{activeTab === "orders" && <div className="table-actions">{rows.map((row) => <div key={String(row.id)}><span>#{String(row.id).slice(0, 8)} · {String(row.status)}</span><button onClick={() => { const status = window.prompt("Enter new order status"); const note = status ? window.prompt("Audit note") : null; if (status && note) void perform(() => api(`/api/admin/orders/${row.id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }) })); }}>Change status</button><button className="button-subtle" onClick={() => { const note = window.prompt("Manual refund note"); if (note) void perform(() => api(`/api/admin/orders/${row.id}/refund-note`, { method: "POST", body: JSON.stringify({ note }) })); }}>Refund note</button></div>)}</div>}{activeTab === "payouts" && <div className="table-actions">{rows.filter((row) => !row.paidAt).map((row) => <div key={String(row.id)}><span>Payout #{String(row.id).slice(0, 8)} · ${((Number(row.amountCents) || 0) / 100).toFixed(2)}</span><button onClick={() => void perform(() => api(`/api/admin/payouts/${row.id}/paid`, { method: "PATCH", body: JSON.stringify({}) }))}>Mark paid</button></div>)}</div>}</>}</div>}
        {activeTab === "payouts" && <form className="form-card fee-form" onSubmit={createPayout}><div className="eyebrow">MANUAL PAYOUT</div><h2>Record a driver payout.</h2><label>Driver<select name="driverProfileId" required defaultValue=""><option value="" disabled>Select driver</option>{adminDrivers.data?.drivers.map((driver) => <option key={String(driver.id)} value={String(driver.id)}>{String((driver.user as Record<string, unknown>)?.email ?? driver.id)}</option>)}</select></label><label>Amount ($)<input name="amount" type="number" min="0.01" step="0.01" required/></label><label>Note<input name="note" maxLength={500}/></label><button className="button-dark" disabled={pending}>Create payout ↗</button></form>}
        {activeTab === "settings" && <form className="form-card fee-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void perform(() => api("/api/admin/settings", { method: "PATCH", body: JSON.stringify({ platformFeePercent: Number(form.get("platformFeePercent")) }) })); }}><div className="eyebrow">DRIVER EARNINGS</div><h2>Platform fee</h2><label>Fee percentage<input name="platformFeePercent" type="number" min="0" max="50" step="0.1" defaultValue={Number(resource.data?.platformFeePercent ?? 15)} required/></label><button className="button-dark" disabled={pending}>Save platform fee ↗</button></form>}
      </>}
    </section></main>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  if (!rows.length) return <div className="table-empty">No records here yet.</div>;
  return <div className="table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map((column) => <td key={column}>{row[column] === null || row[column] === undefined ? "—" : typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column])}</td>)}</tr>)}</tbody></table></div>;
}

function NotFound() { return <main className="subpage narrow-page"><div className="eyebrow">404 · OFF THE MAP</div><h1>Wrong turn.<br/><span>Let’s head home.</span></h1><Link className="button-dark" to="/">Back to uBeer</Link></main>; }

export default function App() {
  return <><SiteHeader/><Routes><Route path="/" element={<HomePage/>}/><Route path="/driver" element={<DriverPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/account" element={<AccountPage/>}/><Route path="/orders/:id/status" element={<OrderStatusPage/>}/><Route path="*" element={<NotFound/>}/></Routes></>;
}
