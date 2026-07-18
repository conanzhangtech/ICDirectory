/* ICDirectory — client-side search + filters over the volunteer grid.
 * Cards carry data-name/-role/-org/-skills/-projects; this filters in place.
 * Zero dependencies. Swapping the JSON for an API later doesn't change this.
 */
(function () {
  "use strict";

  var search = document.getElementById("dir-search");
  var grid = document.getElementById("dir-grid");
  if (!search || !grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll(".dir-item"));
  var chips = Array.prototype.slice.call(document.querySelectorAll(".dir-chip"));
  var count = document.getElementById("dir-count");
  var empty = document.getElementById("dir-empty");

  // active filters: { role: Set, skills: Set, org: Set }
  var active = {};

  function cardMatches(card, q) {
    var hay = [
      card.dataset.name,
      card.dataset.role,
      card.dataset.org,
      card.dataset.skills,
      card.dataset.projects
    ].join(" ");

    if (q && hay.indexOf(q) === -1) return false;

    for (var key in active) {
      if (!active[key].size) continue;
      var field = (card.dataset[key] || "").split(",");
      var hit = false;
      active[key].forEach(function (v) {
        if (key === "role" || key === "org") {
          if (card.dataset[key] === v) hit = true;
        } else if (field.indexOf(v) !== -1) {
          hit = true;
        }
      });
      if (!hit) return false;
    }
    return true;
  }

  function apply() {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (item) {
      var card = item.querySelector(".volunteer-card");
      var ok = cardMatches(card, q);
      item.hidden = !ok;
      if (ok) shown++;
    });
    if (count) count.textContent = shown + " contributor" + (shown === 1 ? "" : "s");
    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var key = chip.dataset.filter;
      var value = chip.dataset.value;
      active[key] = active[key] || new Set();
      if (active[key].has(value)) {
        active[key].delete(value);
        chip.classList.remove("on");
      } else {
        active[key].add(value);
        chip.classList.add("on");
      }
      apply();
    });
  });

  search.addEventListener("input", apply);
})();
