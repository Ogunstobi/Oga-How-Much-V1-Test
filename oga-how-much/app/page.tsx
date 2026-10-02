"use client";

import { useMemo, useState } from "react";

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatNaira(value: number) {
  return naira.format(value).replace("NGN", "₦");
}

function parseAmount(value: string) {
  return Number(value.replace(/,/g, ""));
}

const ogaGreeResponses = [
  { threshold: 5, text: "Small win, but no wahala — the bargain still sweet." },
  { threshold: 10, text: "Nice one, you chopped a little off and still got the deal moving." },
  { threshold: 15, text: "That’s a fair bargain. Oga gree, and the savings still look good." },
  { threshold: 20, text: "Sharp move! You saved a decent amount and still closed confidently." },
  { threshold: 25, text: "This one strong! You negotiate like a boss and the price is looking better." },
  { threshold: 30, text: "Very nice! Oga gree with style — that discount is proper." },
  { threshold: 35, text: "Big respect! You squeezed out a serious bargain without stress." },
  { threshold: 40, text: "This is a clean win. Oga gree, and your savings are getting juicy." },
  { threshold: 50, text: "Boss move! You nearly knocked it down by half. That’s a legendary deal." },
  { threshold: Infinity, text: "Pure negotiation magic! Oga gree full vibes — you saved big and still landed it." },
];

const ogaNoGreeResponses = [
  { threshold: 5, text: "No gree this time, but the offer is still respectful and smart." },
  { threshold: 10, text: "Seller no gree, but you still made a fair, bold move." },
  { threshold: 15, text: "No gree today, yet you still put up a respectable bargain." },
  { threshold: 20, text: "No deal this round, but that was a strong negotiation attempt." },
  { threshold: 25, text: "Oga no gree, but your offer was serious and well thought out." },
  { threshold: 30, text: "No gree this time, but you were very close and still negotiating well." },
  { threshold: 35, text: "The seller no gree, but you still showed strong bargaining energy." },
  { threshold: 40, text: "No gree for now, but that’s a very solid offer and a smart push." },
  { threshold: 50, text: "Oga no gree, but your bargain was strong enough to make them think twice." },
  { threshold: Infinity, text: "No gree this time, but your numbers were serious — try a little more push and you’ll land it." },
];

function getBargainResponse(percentageOff: number, status: "accepted" | "rejected") {
  const responses = status === "accepted" ? ogaGreeResponses : ogaNoGreeResponses;
  return responses.find((response) => percentageOff <= response.threshold)?.text ?? responses[responses.length - 1].text;
}

export default function Home() {
  const [askingPrice, setAskingPrice] = useState("");
  const [buyerPrice, setBuyerPrice] = useState("");
  const [dealStatus, setDealStatus] = useState<"pending" | "accepted" | "rejected">("pending");

  const result = useMemo(() => {
    const asking = parseAmount(askingPrice);
    const offer = parseAmount(buyerPrice);

    if (!Number.isFinite(asking) || asking <= 0 || !Number.isFinite(offer) || offer <= 0) {
      return null;
    }

    const difference = asking - offer;
    const percentageOff = (difference / asking) * 100;
    return { asking, offer, difference, percentageOff };
  }, [askingPrice, buyerPrice]);

  const error = useMemo(() => {
    if (!buyerPrice || !askingPrice) return "";
    if (result && result.difference < 0) return "Omo, your offer pass the asking price 😭";
    return "";
  }, [askingPrice, buyerPrice, result]);

  function handleCalculate() {
    if (!result || result.difference < 0) return;
    setDealStatus("pending");
    document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetOffer() {
    setBuyerPrice("");
    setDealStatus("pending");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="brand-mark" aria-hidden="true">₦</div>
        <p className="eyebrow">Nigerian bargaining calculator</p>
        <h1 id="page-title">Oga, How Much?</h1>
        <p className="hero-copy">Know your bargain before you face the seller.</p>
      </section>

      <section className="calculator-card" aria-label="Bargaining calculator">
        <div className="field-group">
          <label htmlFor="asking-price">How much you dem call am?</label>
          <div className="money-input">
            <span>₦</span>
            <input
              id="asking-price"
              inputMode="numeric"
              min="1"
              placeholder="50,000"
              value={askingPrice}
              onChange={(event) => {
                setAskingPrice(event.target.value.replace(/[^0-9]/g, ""));
                setDealStatus("pending");
              }}
              aria-describedby="asking-hint"
            />
          </div>
          <p id="asking-hint" className="hint">The seller&apos;s asking price.</p>
        </div>

        <div className="field-group">
          <label htmlFor="buyer-price">How much dey your hand?</label>
          <div className="money-input">
            <span>₦</span>
            <input
              id="buyer-price"
              inputMode="numeric"
              min="1"
              placeholder="40,000"
              value={buyerPrice}
              onChange={(event) => {
                setBuyerPrice(event.target.value.replace(/[^0-9]/g, ""));
                setDealStatus("pending");
              }}
              aria-describedby="buyer-hint"
            />
          </div>
          <p id="buyer-hint" className="hint">The most you&apos;re willing to pay.</p>
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        <button className="primary-button" type="button" onClick={handleCalculate} disabled={!result || result.difference < 0}>
          Check my bargain
        </button>
      </section>

      {result && result.difference >= 0 && (
        <section id="result" className="result-card" aria-live="polite">
          <div className="result-topline">
            <span>Your bargain</span>
            <span className="percentage">-{Math.round(result.percentageOff)}%</span>
          </div>

          <div className="price-row">
            <div>
              <p className="result-label">Seller called</p>
              <strong>{formatNaira(result.asking)}</strong>
            </div>
            <div className="arrow" aria-hidden="true">→</div>
            <div className="offer-price">
              <p className="result-label">You offered</p>
              <strong>{formatNaira(result.offer)}</strong>
            </div>
          </div>

          <div className="saving-box">
            <span>{dealStatus === "accepted" ? "Actual savings" : "Potential saving"}</span>
            <strong>{formatNaira(result.difference)}</strong>
          </div>

          <p className="reaction">
            {result.difference === 0
              ? "No bargaining today 😂 Same price, no wahala."
              : dealStatus === "accepted"
                ? `🎉 ${getBargainResponse(result.percentageOff, "accepted")}`
                : dealStatus === "rejected"
                  ? `💪 ${getBargainResponse(result.percentageOff, "rejected")}`
                  : result.percentageOff >= 30
                    ? "Omooo, you wan collect am almost half price 😂"
                    : result.percentageOff >= 15
                      ? "Oga, abeg make una reason am."
                      : "Small knock-off, but every naira counts. 😌"}
          </p>

          {dealStatus === "pending" && result.difference > 0 && (
            <div className="agreement">
              <p>Oga gree?</p>
              <div className="agreement-buttons">
                <button className="accept-button" type="button" onClick={() => setDealStatus("accepted")}>
                  Oga Gree
                </button>
                <button className="reject-button" type="button" onClick={() => setDealStatus("rejected")}>
                  Oga No Gree
                </button>
              </div>
            </div>
          )}

          {dealStatus === "rejected" && (
            <button className="secondary-button" type="button" onClick={resetOffer}>
              Try another price
            </button>
          )}

          {dealStatus === "accepted" && (
            <button className="secondary-button" type="button" onClick={resetOffer}>
              Bargain another item
            </button>
          )}
        </section>
      )}

      <footer>Simple. Local. No market-price database. Just your bargain.</footer>
    </main>
  );
}
