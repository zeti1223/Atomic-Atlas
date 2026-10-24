const $ = id => document.getElementById(id);

const COLORS = {
    "Alkali metal" : "#ff6b6b",
    "Alkaline earth" : "#ffa94d",
    "Transition metal" : "#4dabf7",
    "Post-transition" : "#22b8cf",
    "Metalloid" : "#b197fc",
    "Nonmetal" : "#51cf66",
    "Halogen" : "#ffd43b",
    "Noble gas" : "#f06595",
    "Lanthanide" : "#7ce0ff",
    "Actinide" : "#ff9ff3"
};

const pos = n => 
    n === 1 ? [1, 1] : n === 2 ? [1, 18] :
    n <= 10 ? [2, n < 5 ? n - 2 : n + 8] :
    n <= 18 ? [3, n < 13 ? n - 10 : n] :
    n <= 36 ? [4, n - 18] :
    n <= 54 ? [5, n - 36] :
    n <= 56 ? [6, n - 54] :
    n <= 71 ? [9, n - 54] :
    n <= 86 ? [6, n - 68] :
    n <= 88 ? [7, n - 86] :
    n <= 103 ? [10, n - 86] : [7, n - 100];

    fetch ("elements.json")
        .then(r => { if (!r.ok) throw new Error(r.status); return r.json();})
        .then(build)
        .catch(() => {
            $("table").innerHTML = `<p class="loaderr">Could not load <b>elements.json</b>.<br>
                Open this folder through a local server, e.g. <code>python3 -m http.server</code>,
                then visit <code>localhost:8000</code>.</p>`;
        });

        function build(DATA) {
            DATA.forEach(d => {
                const [row, col] = pos(d.number);
                const cell = document.createElement("button");
                cell.className = "el";
                cell.style.cssText = `grid-area:${row}/${col};--c:${COLORS[d.category]};--i:${d.number - 1};--r:${((d.number * 37) % 7 - 3) * 0.9}deg`;
                cell.title = d.name;
                cell.innerHTML = `<span class="num">${d.number}</span><b>${d.symbol}</b><span class="nm">${d.name}</span>`;
                cell.onclick = () => openCard(d);
                $("table").append(cell);
            });

            $("table").insertAdjacentHTML("beforeend",
                `<div class="ghost" style="grid-area:6/3">57–71</div>
                <div class="ghost" style="grid-area:7/3">89–103</div>`
            );

            $("legend").innerHTML = Object.entries(COLORS).map(
                ([name, c]) => `<span class="lg"><i style="background:${c}"></i>${name}</span>`
            ).join("");
        }

        const dlg = $("dlg"), card = dlg.querySelector(".card");
        function openCard(d) {
            card.style.setProperty("--c", COLORS[d.category]);
            $("mNum").textContent = d.number;
            $("mSym").textContent = d.symbol;
            $("mName").textContent = d.name;
            $("mCat").textContent = d.category;
            $("sMass").textContent = d.mass;
            $("sPeriod").textContent = d.period;
            $("sGroup").textContent = d.group ?? "f-block";
            $("sBlock").textContent = d.block;
            $("mFact").textContent = d.fact;
            dlg.showModal();
        }

        $("close").onclick = () => dlg.close();
        dlg.onclick = e => {
            if (e.target === dlg) dlg.close();
        };