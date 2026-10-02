import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CryptoAcceptanceBanner, LanguagePicker, LocalizationProvider, t, useLocalization } from "./localization";
import SupportChat from "./SupportChat";
import L, { type LeafletEvent, type Layer } from "leaflet";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet-draw";

type Region = { id: string; name: string; languageCode: string; ageGate: number; minimumOrderCents: number; deliveryFeeCents: number; geometry?: unknown; active?: boolean };
type Product = { id: string; name: string; description: string; priceCents: number; stock: number; isTest: boolean };
type User = { id: string; name: string | null; email: string; role: string };
type Catalog = { region: Region; products: Product[] };
type CheckoutResult = { orderId: string; checkoutLink: string; statusToken: string; deliveryCode: string };
type AddressCandidate = { id: string; latitude: number; longitude: number; label: string; precision: "street_address" | "postal_code" };
type SelectedLocation = { latitude: number; longitude: number; label: string; precision: AddressCandidate["precision"] | "current_location" };

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
  if (!response.ok) throw new Error(t(data.error ?? "Something went wrong. Please try again."));
  return data as T;
}

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> };

function InstallAppAction({ hero = false }: { hero?: boolean }) {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const androidBrowser = /Android/i.test(navigator.userAgent) && !navigator.userAgent.includes("uBeerApp");
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
  if (androidBrowser) return <a className={`install-button${hero ? " install-button-hero" : ""}`} href="/downloads/ubeer-android.apk" download="ubeer-android.apk"><span>{t("↓")}</span> {t(hero ? "Download Android app" : "Install Android app")}</a>;
  return <><button className={`install-button${hero ? " install-button-hero" : ""}`} onClick={() => void install()}><span>{t("↓")}</span> {hero ? t("Download the uBeer mobile app") : t("Install app")}</button>{showGuide && <div className="modal-backdrop" onClick={() => setShowGuide(false)}><div className="install-guide" role="dialog" aria-modal="true" aria-labelledby="install-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowGuide(false)} aria-label={t("Close")}>{t("×")}</button><div className="login-orbit">u<span>.</span></div><div className="eyebrow">{t("UBEER IN YOUR POCKET")}</div><h2 id="install-title">{t("Add uBeer to your home screen.")}</h2><p>{t("Get the full ordering and driver app experience with an app icon and its own app window.")}</p><div className="install-steps"><b>{t("iPhone or iPad")}</b><span>{t("Open this page in Safari, tap Share, then choose “Add to Home Screen”.")}</span><b>{t("Android")}</b><span>{t("Open this page in Chrome and tap “Install app” or “Add to Home screen”.")}</span><a className="android-download-link" href="/downloads/ubeer-android.apk" download="ubeer-android.apk">{t("Download Android APK")}</a></div><button className="button-dark full" onClick={() => setShowGuide(false)}>{t("Got it")}</button></div></div>}</>;
}

function SiteHeader() {
  useLocalization();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <header className="site-header"><Link to="/" className="brand" onClick={closeMenu}><span className="brand-mark">u</span><span>ubeer<span className="brand-dot">.</span></span></Link><button className="mobile-menu-toggle" aria-label={menuOpen ? t("Close navigation") : t("Open navigation")} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "×" : "☰"}</button><nav className={menuOpen ? "mobile-menu-open" : ""}><Link to="/account" onClick={closeMenu}>{t("My orders")}</Link><Link to="/driver" onClick={closeMenu}>{t("Driver app")}</Link><Link to="/admin" onClick={closeMenu}>{t("Admin")}</Link><a className="nav-cta" href="/#shop" onClick={closeMenu}>{t("Start an order ")}<span>↗</span></a><LanguagePicker/><InstallAppAction/></nav></header>;
}

function AddressResults({ results, onSelect }: { results: AddressCandidate[]; onSelect: (result: AddressCandidate) => void }) {
  useLocalization();
  if (!results.length) return null;
  return <div id="address-results" className="address-results" role="listbox" aria-label={t("Choose a matching address")}>
    <b>{t("Choose the matching location")}</b>
    {results.map((result) => <button key={result.id} role="option" aria-selected="false" onClick={() => onSelect(result)}>
      <span>{result.label}</span><small>{result.precision === "street_address" ? t("Exact street address") : t("Postal code estimate")}</small>
    </button>)}
  </div>;
}

function HomePage() {
  const { applyRegionLanguage } = useLocalization();
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<SelectedLocation | null>(null);
  const [addressCandidates, setAddressCandidates] = useState<AddressCandidate[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
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

  useEffect(() => {
    if (addressCandidates.length > 1) document.getElementById("address-results")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [addressCandidates]);

  function updateAddress(value: string) {
    setAddress(value);
    setAddressCandidates([]);
    setLocation(null);
    setRegion(null);
    setChecked(false);
    setCart({});
    setDeliveryAddress("");
    setError("");
    setNotice("");
  }

  async function lookupAddress(event?: FormEvent) {
    event?.preventDefault();
    if (!address.trim()) { setError(t("Enter a full street address or Canadian postal code.")); return; }
    setBusy(true); setError(""); setNotice(""); setChecked(false); setRegion(null); setLocation(null); setCart({}); setAddressCandidates([]);
    try {
      const found = await api<{ results: AddressCandidate[] }>("/api/geocode", { method: "POST", body: JSON.stringify({ query: address }) });
      if (found.results.length === 1) await chooseAddress(found.results[0]!);
      else setAddressCandidates(found.results);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function chooseAddress(candidate: AddressCandidate) {
    setAddressCandidates([]);
    setAddress(candidate.label);
    setDeliveryAddress(candidate.precision === "street_address" ? candidate.label : "");
    await checkCoordinate(candidate.latitude, candidate.longitude, candidate.label, candidate.precision);
  }

  async function checkCoordinate(latitude: number, longitude: number, label: string, precision: SelectedLocation["precision"]) {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await api<{ available: boolean; region: Region | null }>("/api/regions/check", { method: "POST", body: JSON.stringify({ latitude, longitude }) });
      if (result.region) applyRegionLanguage(result.region.languageCode);
      setLocation({ latitude, longitude, label, precision }); setRegion(result.region); setChecked(true); setCart({});
      if (!result.available) setNotice(t("We are not delivering here just yet. Join the waitlist and we’ll let you know when we arrive."));
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  function chooseCurrentAddress(candidate: AddressCandidate) {
    void chooseAddress(candidate);
  }

  function useMyLocation() {
    setError("");
    if (!navigator.geolocation) { setError(t("Location services are not available in this browser.")); return; }
    setAddressCandidates([]); setRegion(null); setLocation(null); setChecked(false); setCart({}); setDeliveryAddress(""); setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (position) => void checkCoordinate(position.coords.latitude, position.coords.longitude, "Current location", "current_location"),
      () => { setBusy(false); setError(t("We could not access your location. Enter an address instead.")); },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  async function joinWaitlist(event: FormEvent) {
    event.preventDefault(); setError("");
    try {
      await api("/api/waitlist", { method: "POST", body: JSON.stringify({ email, latitude: location?.latitude, longitude: location?.longitude }) });
      setNotice(t("You’re on the list. We’ll email you when uBeer reaches your area."));
    } catch (e) { setError((e as Error).message); }
  }

  async function addProduct(product: Product) {
    if (!region || !location) return;
    if (location.precision === "postal_code") { setError(t("This postal code only gives an approximate service check. Search your exact street address to order.")); return; }
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
    if (location.precision === "postal_code") { setError(t("Search your exact street address before continuing to checkout.")); return; }
    const items = Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([productId, quantity]) => ({ productId, quantity }));
    if (!items.length) { setError(t("Add a product to your cart first.")); return; }
    if (!ageVerified) { setError(`${t("Please confirm that you are at least")} ${region.ageGate}.`); return; }
    if (deliveryAddress.trim().length < 5) { setError(t("Enter the full street address where the order should be delivered.")); return; }
    setBusy(true);
    try {
      const result = await api<CheckoutResult>("/api/checkout", { method: "POST", body: JSON.stringify({ regionId: region.id, deliveryAddress, latitude: location.latitude, longitude: location.longitude, items, ageVerified, customerEmail: email }) });
      sessionStorage.setItem(`ubeer-order-token:${result.orderId}`, result.statusToken);
      setCheckout(result);
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="hours-promo"><span>✳</span>{t("WE DELIVER 24 HOURS PER DAY")}</div>
        <div className="eyebrow"><span className="eyebrow-dot" /> {t(" GOOD TIMES, CLOSE BY")}</div>
        <h1>{t("Your weekend")}<br />{t("called. ")}<span>{t("We’re on")}<br className="mobile-break" /> {t(" our way.")}</span></h1>
        <p className="hero-lede">{t("Thoughtful local delivery for the moments that make the evening. Find out if we’re in your neighbourhood.")}</p>
        <form className="address-search" onSubmit={lookupAddress}>
          <span className="pin-icon">{t("⌖")}</span>
          <input aria-label={t("Address or postal code")} value={address} onChange={(e) => updateAddress(e.target.value)} placeholder={t("Enter your address or postal code")} />
          <button disabled={busy} aria-label={t("Check delivery area")}>{busy ? "…" : "→"}</button>
        </form>
        <button className="location-link" onClick={useMyLocation}><span>{t("◎")}</span> {t(" Use my current location")}</button>
        <InstallAppAction hero/>
      </div>
      <div className="hero-art"><img className="hero-photo" src="/images/hero-delivery.webp" alt={t("Photo of a local drinks delivery in Montréal")}/></div>
    </section>

    <section className="service-ribbon"><div><span>{t("01")}</span><b>{t("LOCAL FIRST")}</b><small>{t("Made for your neighbourhood")}</small></div><div><span>{t("02")}</span><b>{t("RIGHT ON TIME")}</b><small>{t("Delivered by a real local driver")}</small></div><div><span>{t("03")}</span><b>{t("GOOD TO GO")}</b><small>{t("Age-checked, every time")}</small></div></section>

    <section className="shop-section" id="shop">
      <div className="section-heading"><div><div className="eyebrow">{t("THE NEIGHBOURHOOD CHECK")}</div><h2>{t("What’s in your")}<br/><span>{t("neck of the woods?")}</span></h2></div><p>{t("We deliver within the service areas our local drivers know best. Pop in your address and we’ll take a look.")}</p></div>
      {!checked && <div className="availability-card"><div className="availability-symbol">{t("⌖")}</div><div><h3>{t("First, let’s find your corner.")}</h3><p>{t("We’ll check your address against our active delivery areas.")}</p></div><form onSubmit={lookupAddress}><input aria-label={t("Address or postal code")} value={address} onChange={(e) => updateAddress(e.target.value)} placeholder={t("Street, city or postal code")}/><button className="button-dark" disabled={busy}>{t("Check my area ")}<span>{t("→")}</span></button></form></div>}
      <AddressResults results={addressCandidates} onSelect={chooseCurrentAddress}/>
      {error && !region && <p className="form-error" role="alert">{error}</p>}
      {checked && region && <div className="catalog-layout">
        <div className="catalog-main"><div className="available-banner"><span className="available-dot"/><div><b>{t("Good news — we deliver to ")}{t(region.name)}{t(".")}</b><small>{t("Delivery fee $")}{((region.deliveryFeeCents ?? 0) / 100).toFixed(2)} {t(" · ")}{region.ageGate}{t("+ only")}</small>{location?.precision === "postal_code" && <small className="location-precision-note">{t("Postal code coverage is approximate. Search your exact street address before ordering.")}</small>}</div><button onClick={() => { setChecked(false); setRegion(null); setLocation(null); setCart({}); setDeliveryAddress(""); }}>{t("Change location")}</button></div>
          {catalogQuery.isLoading && <div className="loading-card">{t("Loading the neighbourhood list…")}</div>}
          {products.length > 0 && <div className="product-card"><div className="product-art"><img className="product-photo" src="/images/heineken-six-pack.webp" alt={t("Six-pack of Heineken beer")}/><div className="test-stamp">{t("TEST")}<br/>{t("LISTING")}</div></div><div className="product-info"><div className="product-tag">{t("THE CLASSIC")}</div><h3>{t(products[0]!.name)}</h3><p>{t(products[0]!.description)}</p><div className="product-bottom"><div><b>{t("$")}{(products[0]!.priceCents / 100).toFixed(2)}</b><small>{t("USD · 6 bottles")}</small></div><div className="quantity-control"><button onClick={() => setCart((prev) => ({ ...prev, [products[0]!.id]: Math.max(0, (prev[products[0]!.id] ?? 0) - 1) }))} aria-label={t("Remove one")}>{t("−")}</button><span>{cart[products[0]!.id] ?? 0}</span><button disabled={busy || location?.precision === "postal_code"} onClick={() => void addProduct(products[0]!)} aria-label={t("Add one")}>{t("+")}</button></div></div></div></div>}
          {!catalogQuery.isLoading && products.length === 0 && <div className="loading-card">{t("Nothing on the local menu yet. Check back soon.")}</div>}
        </div>
        <aside className="cart-card"><div className="cart-header"><span>{t("YOUR BAG")}</span><span className="cart-count">{itemCount}</span></div><div className="cart-empty" hidden={itemCount > 0}><div className="cart-line-icon">{t("⌁")}</div><b>{t("A good evening starts somewhere.")}</b><p>{t("Add something from the local list and we’ll get it moving.")}</p></div>
          {itemCount > 0 && <><div className="cart-summary"><span>{itemCount} {t(" × ")}{t(products[0]?.name ?? "")}</span><b>{t("$")}{(subtotalCents / 100).toFixed(2)}</b></div><div className="cart-summary muted"><span>{t("Delivery fee")}</span><span>{t("$")}{((region.deliveryFeeCents ?? 0) / 100).toFixed(2)}</span></div><div className="cart-total"><span>{t("Estimated total")}</span><b>{t("$")}{((subtotalCents + (region.deliveryFeeCents ?? 0)) / 100).toFixed(2)}</b></div>
            <form onSubmit={startCheckout} className="checkout-form"><label>{t("Email for your receipt")}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t("you@example.com")}/></label><label>{t("Delivery address")}<input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} minLength={5} maxLength={300} required placeholder={t("Street number, street, unit")}/></label><label className="age-confirm"><input type="checkbox" checked={ageVerified} onChange={(e) => setAgeVerified(e.target.checked)}/><span>{t("I confirm I am at least ")}{region.ageGate} {t(" years old.")}</span></label><button className="button-dark full" disabled={busy || !ageVerified || !deliveryAddress.trim() || location?.precision === "postal_code"}>{busy ? t("Getting checkout ready…") : t("Continue to secure checkout ↗")}</button><p className="checkout-footnote">{t("2,000+ cryptocurrencies · Bitcoin · Lightning")}</p></form>
          </>}
          {error && <p className="form-error">{error}</p>}
        </aside>
      </div>}
      {checked && !region && <div className="waitlist-card"><img className="waitlist-art-image" src="/images/waitlist-neighbourhood.webp" alt={t("Neighbourhood delivery waitlist illustration")}/><div><div className="eyebrow">{t("WE’RE NOT THERE YET")}</div><h3>{notice || t("Your neighbourhood is on our list.")}</h3><p>{t("Leave your email and we’ll let you know when local delivery reaches you.")}</p><form onSubmit={joinWaitlist}><input type="email" aria-label={t("Email for waitlist")} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t("Your email address")}/><button className="button-dark">{t("Keep me posted ")}<span>{t("→")}</span></button></form></div></div>}
    </section>
    <section className="responsible-note"><span className="responsible-icon">{t("✓")}</span><p><b>{t("Good times, responsibly.")}</b> {t(" Alcohol delivery is only available to eligible adults. A valid ID is required at handoff. Please enjoy thoughtfully.")}</p><span className="note-age">{region?.ageGate ?? "19/21"}{t("+")}</span></section>
    <footer><Link to="/" className="brand"><span className="brand-mark">{t("u")}</span><span>{t("ubeer")}<span className="brand-dot">{t(".")}</span></span></Link><span>{t("Made for the neighbourhood. © ")}{new Date().getFullYear()} {t(" uBeer")}</span><Link to="/driver">{t("Become a driver ↗")}</Link></footer>

    {checkout && <div className="modal-backdrop"><div className="checkout-modal"><button className="modal-close" onClick={() => setCheckout(null)} aria-label={t("Close")}>{t("×")}</button><div className="modal-check">{t("✓")}</div><div className="eyebrow">{t("YOUR ORDER IS READY")}</div><h2>{t("One last stop.")}</h2><p>{t("Your order is waiting at BTCPay’s secure checkout. Keep this delivery code for your driver.")}</p><div className="delivery-code"><span>{t("YOUR HANDOFF CODE")}</span><b>{checkout.deliveryCode}</b><small>{t("Show this code to your driver when your order arrives.")}</small></div><a className="button-dark full modal-pay" href={checkout.checkoutLink}>{t("Pay securely with over 2,000 cryptocurrencies ↗")}</a><Link className="modal-status" to={`/orders/${checkout.orderId}/status`} onClick={() => setCheckout(null)}>{t("Track this order instead")}</Link><small className="modal-disclaimer">{t("Payment is handled by BTCPay Server.")}</small></div></div>}
  </>;
}

function OrderStatusPage() {
  useLocalization();
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token") ?? (id ? sessionStorage.getItem(`ubeer-order-token:${id}`) : null);
  const me = useQuery({ queryKey: ["current-user"], queryFn: () => api<{ user: User }>("/api/auth/me"), enabled: Boolean(id), retry: false });
  const query = useQuery({ queryKey: ["order-status", id, token, me.data?.user.id], queryFn: () => api<{ id: string; status: string; totalCents: number; currency: string; regionName: string; deliveryAddress: string | null; items: Array<{ productName: string; quantity: number; unitPriceCents: number }> }>(`/api/orders/${id}/status${token ? `?token=${encodeURIComponent(token)}` : ""}`), enabled: Boolean(id && (token || me.data?.user)), refetchInterval: 5000 });
  const stages = ["pending_payment", "paid", "accepted", "preparing", "out_for_delivery", "delivered"];
  const activeIndex = stages.indexOf(query.data?.status ?? "pending_payment");
  return <main className="subpage narrow-page"><div className="eyebrow">{t("ORDER TRACKING")}</div><h1>{t("Your evening,")}<br/><span>{t("in good hands.")}</span></h1>{query.isLoading && <div className="loading-card">{t("Finding your order…")}</div>}{query.error && <div className="alert-error">{(query.error as Error).message}</div>}{query.data && <div className="tracking-card">{query.data.status === "delivered" && <img className="delivery-confirmed-art" src="/images/delivery-confirmed.webp" alt={t("Order delivered to the door")}/>}<div className="tracking-head"><div><span className="eyebrow">{t("ORDER")}</span><b>{t("#")}{query.data.id.slice(0, 8).toUpperCase()}</b></div><span className="status-pill">{t(query.data.status.replaceAll("_", " "))}</span></div><div className="tracking-progress">{stages.map((stage, index) => <div className={`track-step ${index <= activeIndex ? "done" : ""}`} key={stage}><i>{index < activeIndex ? "✓" : index + 1}</i><span>{t(stage.replaceAll("_", " "))}</span></div>)}</div><div className="receipt-lines">{query.data.items.map((item) => <div key={item.productName}><span>{item.quantity} {t(" × ")}{t(item.productName)}</span><b>{t("$")}{((item.quantity * item.unitPriceCents) / 100).toFixed(2)}</b></div>)}</div><div className="tracking-total"><span>{t("Delivering to ")}{query.data.deliveryAddress || t(query.data.regionName)}</span><b>{t("$")}{(query.data.totalCents / 100).toFixed(2)} {query.data.currency}</b></div><p>{t("We refresh your order status automatically.")}</p></div>}<Link to="/" className="text-link">{t("← Back to uBeer")}</Link></main>;
}

function AccountPage() {
  useLocalization();
  const { locale } = useLocalization();
  const [user, setUser] = useState<User | null>(null);
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const ordersQuery = useQuery({ queryKey: ["customer-orders"], queryFn: () => api<{ orders: Array<{ id: string; status: string; createdAt: string; totalCents: number; currency: string; deliveryAddress: string | null; region: { name: string }; items: Array<{ productName: string; quantity: number }> }> }>("/api/orders"), enabled: Boolean(user), refetchInterval: 30_000 });
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
  return <main className="subpage account-page"><div className="eyebrow">{t("YOUR UBEER ACCOUNT")}</div><h1>{t("Good to see")}<br/><span>{t("you again.")}</span></h1>{!user ? <div className="account-login form-card"><h2>{register ? t("Create an account") : t("Sign in to your orders")}</h2>{error && <div className="alert-error">{error}</div>}<form onSubmit={submit}>{register && <label>{t("Your name")}<input name="name" required minLength={2}/></label>}<label>{t("Email")}<input name="email" type="email" required/></label><label>{t("Password")}<input name="password" type="password" minLength={12} required/></label><button className="button-dark full" disabled={busy}>{busy ? t("One moment…") : register ? t("Create account →") : t("Sign in →")}</button></form><button className="account-switch" onClick={() => { setRegister((value) => !value); setError(""); }}>{register ? t("Already have an account? Sign in") : t("New here? Create an account")}</button></div> : <section className="account-orders"><div className="account-heading"><div><span className="eyebrow">{t("SIGNED IN AS")}</span><b>{user.email}</b></div><button onClick={() => void api("/api/auth/logout", { method: "POST" }).then(() => setUser(null))}>{t("Sign out ↗")}</button></div><h2>{t("Your orders")}</h2>{ordersQuery.isLoading && <div className="loading-card">{t("Loading order history…")}</div>}{ordersQuery.data?.orders.length ? ordersQuery.data.orders.map((order) => <Link className="history-order" to={`/orders/${order.id}/status`} key={order.id}><div><b>{t("#")}{order.id.slice(0, 8).toUpperCase()}</b><small>{new Date(order.createdAt).toLocaleDateString(locale)} {t(" · ")}{t(order.region.name)}</small><small>{order.deliveryAddress || t("Delivery address unavailable")}</small><small>{order.items.map((item) => `${item.quantity} × ${t(item.productName)}`).join(", ")}</small></div><div><span className="status-pill">{t(order.status.replaceAll("_", " "))}</span><b>{t("$")}{(order.totalCents / 100).toFixed(2)} {order.currency}</b></div></Link>) : !ordersQuery.isLoading && <div className="loading-card">{t("No orders yet. Find your neighbourhood and start your first order.")}</div>}</section>}<Link to="/" className="text-link">{t("← Browse uBeer")}</Link></main>;
}

function DriverPage() {
  useLocalization();
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
    }, () => setError(t("Allow location access while you are online.")), { enableHighAccuracy: true, timeout: 10_000 });
    const timer = window.setInterval(ping, 30_000);
    return () => window.clearInterval(timer);
  }, [online]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try { const result = await api<{ user: User }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) }); setUser(result.user); setNotice(t("You’re signed in. Switch on when you’re ready to drive.")); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  async function application(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try { await api("/api/drivers/applications", { method: "POST", body: form }); setNotice(t("Application received. We’ll review your details and email you after admin review.")); (event.currentTarget as HTMLFormElement).reset(); }
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
    const deliveryCode = status === "delivered" ? window.prompt(t("Ask the customer for their six-digit delivery code")) ?? undefined : undefined;
    try { await api(`/api/driver/orders/${id}/status`, { method: "POST", body: JSON.stringify({ status, deliveryCode }) }); await ordersQuery.refetch(); }
    catch (e) { setError((e as Error).message); }
  }

  async function declineOrder(id: string) {
    try { await api(`/api/driver/orders/${id}/decline`, { method: "POST", body: JSON.stringify({}) }); await ordersQuery.refetch(); }
    catch (e) { setError((e as Error).message); }
  }

  const orderNext: Record<string, string> = { paid: "accepted", accepted: "preparing", preparing: "out_for_delivery", out_for_delivery: "delivered" };
  return <main className="subpage driver-page"><div className="driver-intro"><div className="eyebrow">{t("GOOD PEOPLE, GOOD ROUTES")}</div><h1>{t("Get paid to")}<br/><span>{t("know your way.")}</span></h1><p>{t("Join a local crew delivering great evenings across the neighbourhood.")}</p><img className="driver-intro-art" src="/images/driver-montreal.webp" alt={t("Montreal driver with delivery bag")}/></div>
    {error && <div className="alert-error">{error}</div>}{notice && <div className="alert-success">{notice}</div>}
    {user ? <div className="driver-dashboard"><div className="driver-toolbar"><div><span className="eyebrow">{t("DRIVER CONSOLE")}</span><h2>{t("Hey, ")}{user.name || user.email.split("@")[0]}{t(".")}</h2></div><div className="driver-toolbar-right"><span className="driver-earnings">{t("EARNED ")}<b>{t("$")}{((earningsQuery.data?.totalEarningsCents ?? 0) / 100).toFixed(2)}</b></span><button className={`online-toggle ${online ? "is-online" : ""}`} onClick={toggleOnline}><i/> {online ? t("You’re online") : t("Go online")}</button></div></div><div className="driver-section-title"><h3>{t("Your assignments")}</h3><span>{t("Refreshes every 10 sec")}</span></div>{ordersQuery.data?.orders.length ? ordersQuery.data.orders.map((order) => { const mapsUrl = `https://www.openstreetmap.org/directions?to=${encodeURIComponent(`${String(order.latitude)},${String(order.longitude)}`)}`; return <div className="driver-order" key={String(order.id)}><div><b>{t("Order #")}{String(order.id).slice(0, 8).toUpperCase()}</b><small className="driver-delivery-address">{String(order.deliveryAddress ?? t("Delivery address unavailable"))}</small><small>{t(String(order.status).replaceAll("_", " "))} {t(" · ")}{String(order.customerEmail)}</small><a className="driver-map-link" href={mapsUrl} target="_blank" rel="noreferrer">{t("Open delivery location in maps ↗")}</a></div><div className="driver-order-actions"><button className="button-dark" onClick={() => void orderAction(String(order.id), orderNext[String(order.status)] ?? "accepted")}>{t(String(orderNext[String(order.status)] ?? "accepted").replaceAll("_", " "))} {t(" →")}</button>{order.status === "paid" && <button className="decline-order" onClick={() => void declineOrder(String(order.id))}>{t("Decline")}</button>}</div></div>; }) : <div className="loading-card">{t("No orders assigned yet. Keep your location on while you’re available.")}</div>}</div> : <div className="driver-forms"><div className="driver-login form-card"><div className="eyebrow">{t("ALREADY ON THE CREW?")}</div><h2>{t("Driver sign in")}</h2><form onSubmit={login}><label>{t("Email")}<input name="email" type="email" required placeholder={t("you@example.com")}/></label><label>{t("Password")}<input name="password" type="password" required minLength={12} placeholder={t("Your password")}/></label><button className="button-dark full" disabled={busy}>{t("Sign in →")}</button></form><p>{t("Approved drivers only. Your account starts after admin review.")}</p></div><div className="driver-application form-card"><div className="eyebrow">{t("COME DRIVE WITH US")}</div><h2>{t("Apply to drive")}</h2><form onSubmit={application}><div className="two-fields"><label>{t("Full name")}<input name="name" required minLength={2}/></label><label>{t("Phone")}<input name="phone" type="tel" required/></label></div><label>{t("Email")}<input name="email" type="email" required/></label><div className="two-fields"><label>{t("Vehicle")}<input name="vehicle" required placeholder={t("Car, bicycle…")}/></label><label>{t("License number")}<input name="licenseNumber" required/></label></div><label>{t("Preferred region")}<select name="regionId" required defaultValue=""><option value="" disabled>{t("Select a region")}</option>{regionData?.regions.map((region) => <option key={region.id} value={region.id}>{t(region.name)}</option>)}</select></label><label>{t("ID document ")}<small className="field-hint">{t("JPEG, PNG or PDF · 5 MB maximum")}</small><input name="idDocument" type="file" accept="image/jpeg,image/png,application/pdf" required/></label><button className="button-dark full" disabled={busy}>{t("Send application ↗")}</button></form><p>{t("Your documents are stored securely and can only be accessed by the admin team.")}</p></div></div>}
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
  const { locale } = useLocalization();
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
    await perform(() => api("/api/admin/regions", { method: "POST", body: JSON.stringify({ name: form.get("name"), languageCode: form.get("languageCode"), active: form.get("active") === "on", geometry, minimumOrderCents: Math.round(Number(form.get("minimumOrder") || 0) * 100), deliveryFeeCents: Math.round(Number(form.get("deliveryFee") || 0) * 100), ageGate: Number(form.get("ageGate")) }) }));
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

  if (!user) return <main className="admin-login-page"><div className="login-orbit">{t("u")}<span>{t(".")}</span></div><div className="eyebrow">{t("UBeer OPERATIONS")}</div><h1>{t("Admin sign in")}</h1><p>{t("Administrator access requires an authenticator code.")}</p>{loginError && <div className="alert-error">{loginError}</div>}<form className="form-card admin-login-form" onSubmit={signIn}><label>{t("Email")}<input name="email" type="email" defaultValue="admin@ubeer.local" required/></label><label>{t("Password")}<input name="password" type="password" required/></label><label>{t("Authenticator code")}<input name="totp" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} required placeholder={t("000 000")}/></label><button className="button-dark full">{t("Enter operations ↗")}</button></form><Link to="/" className="text-link">{t("← Return to uBeer")}</Link></main>;

  const tabs = ["overview", "orders", "regions", "products", "drivers", "users", "payouts", "audit", "settings"];
  const list = (key: string) => {
    const value = resource.data?.[key];
    return Array.isArray(value) ? value as Array<Record<string, unknown>> : [];
  };
  const rows = activeTab === "regions" ? (adminRegions.data?.regions ?? []) as unknown as Array<Record<string, unknown>> : activeTab === "drivers" ? list("applications") : activeTab === "audit" ? list("entries") : activeTab === "settings" ? [] : list(activeTab);

  return <main className="admin-shell"><aside className="admin-sidebar"><Link className="brand admin-brand" to="/"><span className="brand-mark">{t("u")}</span><span>{t("ubeer")}<span className="brand-dot">{t(".")}</span></span></Link><div className="admin-label">{t("OPERATIONS")}</div><nav>{tabs.map((tab, index) => <button key={tab} className={activeTab === tab ? "selected" : ""} onClick={() => { setActiveTab(tab); setResourceError(""); }}><span className="admin-nav-icon">{["⌂", "▤", "⌖", "◈", "♧", "♙", "$", "≡", "⚙"][index]}</span>{adminTabLabel(tab)}</button>)}</nav><div className="sidebar-user"><span>{user.email.slice(0, 1).toUpperCase()}</span><div><b>{user.name || "Administrator"}</b><small>{t("ADMIN")}</small></div><button title={t("Sign out")} onClick={() => void api("/api/auth/logout", { method: "POST" }).then(() => setUser(null))}>{t("↗")}</button></div></aside>
    <section className="admin-content"><header className="admin-topbar"><div><div className="eyebrow">{adminTabLabel(activeTab)}</div><h1>{activeTab === "overview" ? t("A look around.") : adminTabLabel(activeTab)}</h1></div><div className="admin-live"><i/> {t(" SYSTEM LIVE ")}<span>{t("·")}</span> {new Date().toLocaleDateString(locale)}</div></header>
      {(resourceError || dashboard.error) && <div className="alert-error">{resourceError || (dashboard.error as Error).message}</div>}
      {activeTab === "overview" ? <><div className="metric-grid">{[["Orders today", dashboard.data?.ordersToday ?? "—", "orders"], ["Paid revenue", dashboard.data ? `$${(dashboard.data.revenueCents / 100).toFixed(2)}` : "—", "USD today"], ["Drivers online", dashboard.data?.activeDrivers ?? "—", "approved"], ["Failed payments", dashboard.data?.failedPayments ?? "—", "today"]].map(([label, number, note]) => <div className="metric-card" key={String(label)}><span>{t(String(label))}</span><b>{number}</b><small>{t(String(note))}</small></div>)}</div><div className="admin-welcome"><div><div className="eyebrow">{t("YOUR DAILY BRIEF")}</div><h2>{t("Good operations")}<br/>{t("make good evenings.")}</h2><p>{t("Orders, local coverage and driver activity are all in one place.")}</p></div><div className="welcome-graphic"><span>{t("u")}</span><i>{t("✳")}</i></div></div><div className="quick-links"><button onClick={() => setActiveTab("orders")}>{t("Review orders ↗")}</button><button onClick={() => setActiveTab("regions")}>{t("Manage delivery regions ↗")}</button><button onClick={() => setActiveTab("drivers")}>{t("Review driver applications ↗")}</button></div></> : <>
        {activeTab === "regions" && <><div className="manager-layout"><div className="admin-map-wrap"><MapContainer center={[45.55, -73.72]} zoom={9} scrollWheelZoom className="admin-map"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{rows.filter((row) => row.geometry).map((row) => <GeoJSON key={String(row.id)} data={row.geometry as GeoJSON.GeoJsonObject} style={{ color: row.active ? "#37684b" : "#df8153", weight: 2, fillOpacity: 0.15 }}/>) }<DrawControl onDrawn={setGeometry}/></MapContainer><p>{t("Draw a polygon or rectangle to define a service area along the Island of Montréal coastline.")}</p></div><form className="form-card manager-form" onSubmit={createRegion}><div className="eyebrow">{t("REGION DETAILS")}</div><h2>{t("Map a neighbourhood.")}</h2><label>{t("Region name")}<input name="name" required placeholder={t("Downtown area")}/></label><label>{t("Customer language")}<select name="languageCode" defaultValue="en"><option value="en">English</option><option value="fr">Français</option><option value="it">Italiano</option><option value="es">Español</option><option value="zh">简体中文</option><option value="ru">Русский</option></select><small className="field-hint">{t("This delivery region sets the default app language.")}</small></label><div className="two-fields"><label>{t("Delivery fee ($)")}<input name="deliveryFee" type="number" step="0.01" min="0" defaultValue="5" required/></label><label>{t("Age gate")}<select name="ageGate"><option value="19">{t("19+")}</option><option value="21">{t("21+")}</option></select></label></div><label>{t("Minimum order ($)")}<input name="minimumOrder" type="number" min="0" step="0.01" defaultValue="0" required/></label><label className="checkbox-line"><input name="active" type="checkbox" defaultChecked/> {t(" Active after saving")}</label><div className={geometry ? "geometry-ready" : "geometry-missing"}>{geometry ? `✓ ${t("Delivery boundary drawn")}` : t("Draw the boundary on the map")}</div><button className="button-dark full" disabled={pending}>{t("Save region ↗")}</button></form></div><div className="table-card region-toggle-list"><h2>{t("Existing regions")}</h2><div className="table-actions">{rows.map((row) => <div key={String(row.id)}><span>{t(String(row.name))} {t(" · ")}{row.active ? t("Active") : t("Inactive")}</span><button onClick={() => void perform(() => api(`/api/admin/regions/${row.id}`, { method: "PATCH", body: JSON.stringify({ active: !row.active }) }))}>{row.active ? t("Deactivate") : t("Activate")}</button></div>)}</div></div></>}
        {activeTab === "products" && <div className="manager-layout"><div className="table-card"><h2>{t("Products")}</h2><DataTable rows={rows} columns={["name", "priceCents", "stock", "active", "isTest"]}/></div><form className="form-card manager-form" onSubmit={createProduct}><div className="eyebrow">{t("CATALOG")}</div><h2>{t("Add a product.")}</h2><label>{t("Name")}<input name="name" required/></label><label>{t("Description")}<textarea name="description" rows={3}/></label><div className="two-fields"><label>{t("Price ($)")}<input name="price" type="number" min="0.01" step="0.01" required/></label><label>{t("Stock")}<input name="stock" type="number" min="0" defaultValue="0" required/></label></div><label>{t("Available in")}<select required value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)}><option value="">{t("Choose region")}</option>{adminRegions.data?.regions.map((region) => <option key={region.id} value={region.id}>{t(region.name)}</option>)}</select></label><label className="checkbox-line"><input name="isTest" type="checkbox"/> {t(" Mark as test listing")}</label><button className="button-dark full" disabled={pending || !selectedRegion}>{t("Add to catalog ↗")}</button></form></div>}
        {activeTab === "products" && <div className="table-actions product-toggle-list">{rows.map((row) => <div key={String(row.id)}><span>{t(String(row.name))} {t(" · ")}{row.active ? t("Active") : t("Archived")}</span><button onClick={() => void perform(() => api(`/api/admin/products/${row.id}`, { method: "PATCH", body: JSON.stringify({ active: !row.active }) }))}>{row.active ? t("Pause") : t("Reactivate")}</button></div>)}</div>}
        {activeTab !== "regions" && activeTab !== "products" && <div className="table-card"><div className="table-heading"><h2>{activeTab === "drivers" ? t("Applications & drivers") : `${t(activeTab[0]!.toUpperCase() + activeTab.slice(1))} ${t("records")}`}</h2><button className="icon-refresh" onClick={() => void resource.refetch()} title={t("Refresh")}>{t("↻")}</button></div>{activeTab === "settings" ? <div className="settings-summary">{resource.data && Object.entries((resource.data as { btcpay: Record<string, unknown> }).btcpay ?? {}).map(([key, value]) => <div key={key}><span>{key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span><b>{t(String(value ?? "Not configured"))}</b></div>)}<p>{t("BTCPay secrets are read from the server environment and are never shown here.")}</p></div> : <><DataTable rows={rows} columns={rows.length ? Object.keys(rows[0]!).filter((key) => !["geometry", "metadata", "idDocumentPath", "deliveryOtpHash", "statusAccessTokenHash"].includes(key)).slice(0, 7) : []}/>{activeTab === "drivers" && rows.some((row) => row.status === "pending") && <div className="table-actions">{rows.filter((row) => row.status === "pending").map((row) => <div key={String(row.id)}><span>{String(row.name)} {t(" · ")}{String(row.email)}</span><button onClick={() => void applicationAction(row, "approved")}>{t("Approve")}</button><button className="button-subtle" onClick={() => void applicationAction(row, "rejected")}>{t("Reject")}</button></div>)}</div>}{activeTab === "users" && <div className="table-actions">{rows.map((row) => <div key={String(row.id)}><span>{String(row.email)} {t(" · ")}{row.isBanned ? t("Banned") : t("Active")}</span><button onClick={() => void perform(() => api(`/api/admin/users/${row.id}/ban`, { method: "PATCH", body: JSON.stringify({ isBanned: !row.isBanned }) }))}>{row.isBanned ? t("Unban") : t("Ban")}</button></div>)}</div>}{activeTab === "orders" && <div className="table-actions">{rows.map((row) => <div key={String(row.id)}><span>{t("#")}{String(row.id).slice(0, 8)} {t(" · ")}{t(String(row.status))}</span><button onClick={() => { const status = window.prompt(t("Enter new order status")); const note = status ? window.prompt(t("Audit note")) : null; if (status && note) void perform(() => api(`/api/admin/orders/${row.id}/status`, { method: "PATCH", body: JSON.stringify({ status, note }) })); }}>{t("Change status")}</button><button className="button-subtle" onClick={() => { const note = window.prompt(t("Manual refund note")); if (note) void perform(() => api(`/api/admin/orders/${row.id}/refund-note`, { method: "POST", body: JSON.stringify({ note }) })); }}>{t("Refund note")}</button></div>)}</div>}{activeTab === "payouts" && <div className="table-actions">{rows.filter((row) => !row.paidAt).map((row) => <div key={String(row.id)}><span>{t("Payout #")}{String(row.id).slice(0, 8)} {t(" · $")}{((Number(row.amountCents) || 0) / 100).toFixed(2)}</span><button onClick={() => void perform(() => api(`/api/admin/payouts/${row.id}/paid`, { method: "PATCH", body: JSON.stringify({}) }))}>{t("Mark paid")}</button></div>)}</div>}</>}</div>}
        {activeTab === "payouts" && <form className="form-card fee-form" onSubmit={createPayout}><div className="eyebrow">{t("MANUAL PAYOUT")}</div><h2>{t("Record a driver payout.")}</h2><label>{t("Driver")}<select name="driverProfileId" required defaultValue=""><option value="" disabled>{t("Select driver")}</option>{adminDrivers.data?.drivers.map((driver) => <option key={String(driver.id)} value={String(driver.id)}>{String((driver.user as Record<string, unknown>)?.email ?? driver.id)}</option>)}</select></label><label>{t("Amount ($)")}<input name="amount" type="number" min="0.01" step="0.01" required/></label><label>{t("Note")}<input name="note" maxLength={500}/></label><button className="button-dark" disabled={pending}>{t("Create payout ↗")}</button></form>}
        {activeTab === "settings" && <form className="form-card fee-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void perform(() => api("/api/admin/settings", { method: "PATCH", body: JSON.stringify({ platformFeePercent: Number(form.get("platformFeePercent")) }) })); }}><div className="eyebrow">{t("DRIVER EARNINGS")}</div><h2>{t("Platform fee")}</h2><label>{t("Fee percentage")}<input name="platformFeePercent" type="number" min="0" max="50" step="0.1" defaultValue={Number(resource.data?.platformFeePercent ?? 15)} required/></label><button className="button-dark" disabled={pending}>{t("Save platform fee ↗")}</button></form>}
      </>}
    </section></main>;
}

function DataTable({ rows, columns }: { rows: Array<Record<string, unknown>>; columns: string[] }) {
  useLocalization();
  if (!rows.length) return <div className="table-empty">{t("No records here yet.")}</div>;
  return <div className="table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{t(column.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`))}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map((column) => <td key={column}>{row[column] === null || row[column] === undefined ? "—" : typeof row[column] === "object" ? JSON.stringify(row[column]) : t(String(row[column]))}</td>)}</tr>)}</tbody></table></div>;
}

function adminTabLabel(tab: string): string {
  const labels: Record<string, string> = { overview: "Dashboard", orders: "Orders", regions: "Regions", products: "Products", drivers: "Drivers", users: "Users", payouts: "Payouts", audit: "Audit log", settings: "Settings" };
  return t(labels[tab] ?? tab);
}

function NotFound() { useLocalization(); return <main className="subpage narrow-page"><div className="eyebrow">{t("404 · OFF THE MAP")}</div><h1>{t("Wrong turn.")}<br/><span>{t("Let’s head home.")}</span></h1><Link className="button-dark" to="/">{t("Back to uBeer")}</Link></main>; }

export default function App() {
  return <LocalizationProvider><SiteHeader/><CryptoAcceptanceBanner/><Routes><Route path="/" element={<HomePage/>}/><Route path="/driver" element={<DriverPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/account" element={<AccountPage/>}/><Route path="/orders/:id/status" element={<OrderStatusPage/>}/><Route path="*" element={<NotFound/>}/></Routes><SupportChat/></LocalizationProvider>;
}
