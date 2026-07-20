const counterElement = document.getElementById("counter");
let previousValue = null;

function render(value) {
  counterElement.textContent = value;

  if (previousValue !== null && value !== previousValue) {
    counterElement.classList.remove("bump");
    void counterElement.offsetWidth;
    counterElement.classList.add("bump");
  }

  previousValue = value;
}

fetch("/api/counter")
  .then(response => response.json())
  .then(data => render(data.counter))
  .catch(console.error);

const events = new EventSource("/events");

events.onmessage = event => {
  const data = JSON.parse(event.data);
  render(data.counter);
};

events.onerror = () => {
  console.warn("Counter connection interrupted; reconnecting automatically.");
};