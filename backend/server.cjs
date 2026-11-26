const express = require("express");
const dotenv = require("dotenv");
const path = require("node:path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.disable("x-powered-by");

const API_BASE_URL = "https://oracleapex.com/ords/bakerydatabase/";
class ServiceError extends Error {}

const PORT = Number(process.env.PORT || 3001);

async function fetchCollection(resource) {
    const items = [];
    let offset = 0;

    for (let page = 0; page < 100; page++) {
        // Read-only demonstration endpoints are public; no OAuth request is needed.
        const response = await fetch(`${API_BASE_URL}api/${resource}/?offset=${offset}&limit=100`, {
            redirect: "error",
            signal: AbortSignal.timeout(10000),
            headers: { Accept: "application/json" },
        });
        if (resource === "orders" && response.status === 404) {
            throw new ServiceError("Orders are not available yet. Please try again later.");
        }
        if (resource === "customers" && response.status === 404) {
            throw new ServiceError("Customers are not available yet. Please try again later.");
        }
        if (!response.ok) {
            throw new ServiceError(`Could not load ${resource} (HTTP ${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data.items)) {
            throw new ServiceError(`Unexpected ${resource} response.`);
        }

        items.push(...data.items);

        if (!data.hasMore) return { items };

        if (data.items.length === 0) {
            throw new ServiceError("The service could not load the next page.");
        }

        offset += data.items.length;
    }

    throw new ServiceError("There are too many records to load.");
}

app.use("/api", (_request, response, next) => {
    response.set("Cache-Control", "no-store");
    next();
});

for (const resource of ["categories", "products", "audit-logs", "orders", "employees", "customers"]) {
    app.get(`/api/${resource}`, async (_request, response) => {
        try {
            response.json(await fetchCollection(resource));
        } catch (error) {
            const message = error instanceof ServiceError ? error.message : "Unable to load records. Please try again.";

            response.status(502).json({ error: message });
        }
    });
}

if (!process.env.VERCEL) {
    app.listen(PORT, "127.0.0.1", () => {
        console.log(`Backend running at http://127.0.0.1:${PORT}`);
    });
}

module.exports = app;
