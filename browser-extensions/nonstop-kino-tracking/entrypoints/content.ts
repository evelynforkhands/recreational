import { copyToClipboard } from "@/utils/clipboard-utils";

type MovieStats = {
    title: string;
    location: string;
    cost: string;
    date: string;
    time: string;
    duration: string;
};

export default defineContentScript({
    matches: ["*://nonstopkino.at/*"],



    main() {
        browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
            if (message?.type !== "EXTRACT_AND_COPY_MOVIE_STATS") return;

            try {
                const stats = extractMovieStatsFromDom();
                const transformed = transformMovieStats(stats);

                copyToClipboard(Object.values(transformed).join("\t"));

                sendResponse({ ok: true });
            } catch (e) {
                console.error("[movie-stats] failed to extract/transform", e);
                sendResponse({ ok: false, error: String(e) });
            }
            return true;
        });
    },
});

function extractMovieStatsFromDom(): MovieStats {
    const findVisibleText = (selector: string, fallback: string) => {
        const elems = Array.from(document.querySelectorAll<HTMLElement>(selector));
        for (const el of elems) {
            if (el.getAttribute("aria-hidden") === "true") continue;
            if (el.closest('[aria-hidden="true"]')) continue;
            const txt = el.textContent?.trim();
            if (txt) return txt;
        }
        return fallback;
    };

    return {
        title: findVisibleText(".content h1", "No title found"),
        location: findVisibleText(".content div.meta div.location", "No location found"),
        cost: "10",
        date: findVisibleText(".content div.meta div.date div.normal", "No date found"),
        time: "",
        duration: findVisibleText(".content p.duration span.value", "No duration found"),
    };
}

function transformMovieStats(stats: MovieStats) {
    const bundeslaenderRegex =
        /\s*,?\s*(Wien|Burgenland|Nieder(?:ö|oe)sterreich|Ober(?:ö|oe)sterreich|Steiermark|K(?:ä|ae)rnten|Salzburg|Tirol|Vorarlberg)\s*$/i;
    const year = new Date().getFullYear();
    const datePattern = /(\d{1,2}\.\d{1,2})(?!\.\d{2,4})/;
    const timePattern = /(\d{1,2}:\d{2})/;

    const dateMatch = stats.date.match(datePattern);
    const timeMatch = stats.date.match(timePattern);

    const result = {
        ...stats,
        location: stats.location.replace(bundeslaenderRegex, "").trim(),
        date: dateMatch ? `=DATE(${year},${dateMatch[1].replace(".", ",")})` : stats.date.trim(),
        time: timeMatch ? `${timeMatch[1]}` : stats.date.trim(),
        duration: stats.duration.replace("min.", "").trim(),

    };
    return result;

}
