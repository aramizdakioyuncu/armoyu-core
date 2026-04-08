/**
 * ARMOYU API Console App - Core Logic
 */

// --- Mock Data Store ---
const mocks = {
    auth: {
        login: { user: { id: 1, username: "admin" }, session: { token: "ey...secret" } },
        me: { user: { id: 1, username: "admin", email: "admin@armoyu.com" } }
    },
    users: {
        search: [{ id: 2, username: "berkay", display_name: "Berkay" }],
        getProfile: { id: 2, username: "berkay", bio: "Developer" }
    },
    social: {
        feed: [{ id: 101, content: "Merhaba ARMOYU!", author: "admin" }]
    },
    blog: {
        news: [{ id: 1, title: "ARMOYU v2 Yayınlandı", date: "2026-04-08" }]
    },
    shop: {
        getProducts: [{ id: 1, name: "Premium Membership", price: 100 }]
    },
    forum: {
        getCategories: [{ id: 1, name: "Genel Tartışma" }]
    },
    support: {
        getMyTickets: [{ id: "T-1", subject: "Destek Talebi", status: "open" }]
    }
};

// --- App State ---
let currentTarget = "auth";
let mockMode = false;

// --- DOM Elements ---
const sideNav = document.getElementById("side-nav");
const actionPanel = document.getElementById("action-panel");
const consoleOutput = document.getElementById("console-output");
const panelTitle = document.getElementById("panel-title");
const toggleMockBtn = document.getElementById("toggle-mock");
const clearConsoleBtn = document.getElementById("clear-console");
const socketStatus = document.getElementById("socket-status");
const globalApiKeyInput = document.getElementById("global-api-key");
const globalBearerTokenInput = document.getElementById("global-bearer-token");

const icons = {
    auth: "🔐", users: "👥", social: "💬", blog: "📰", shop: "🛒", forum: "⚖️", support: "🎫", socket: "🔌"
};

// --- Service Configuration ---
const config = {
    auth: {
        title: "Authentication Services", base: "/auth",
        actions: [
            { id: "login", name: "Login", method: "POST", endpoint: "/login", desc: "Authenticate user", inputs: ["username", "password"] },
            { id: "me", name: "Get Me", method: "GET", endpoint: "/me", desc: "Fetch current user", inputs: [] }
        ]
    },
    users: {
        title: "User Management", base: "/users",
        actions: [
            { id: "search", name: "Search Users", method: "GET", endpoint: "/search", desc: "Find players", inputs: ["query"] },
            { id: "getProfile", name: "Profile", method: "GET", endpoint: "/{username}", desc: "User details", inputs: ["username"] }
        ]
    },
    social: {
        title: "Social Interactions", base: "/social",
        actions: [
            { id: "getFeed", name: "News Feed", method: "GET", endpoint: "/feed", desc: "Latest posts", inputs: ["page"] }
        ]
    },
    blog: {
        title: "Content Services", base: "/content",
        actions: [
            { id: "getNews", name: "Get News", method: "GET", endpoint: "/news", desc: "Fetch news", inputs: [] }
        ]
    },
    shop: {
        title: "Shop Services", base: "/shop",
        actions: [
            { id: "getProducts", name: "Products", method: "GET", endpoint: "/products", desc: "Browse items", inputs: [] }
        ]
    },
    forum: {
        title: "Forum Services", base: "/community/forums",
        actions: [
            { id: "getCategories", name: "Categories", method: "GET", endpoint: "/categories", desc: "List categories", inputs: [] }
        ]
    },
    support: {
        title: "Support Desk", base: "/social/support",
        actions: [
            { id: "getMyTickets", name: "My Tickets", method: "GET", endpoint: "/my-tickets", desc: "History", inputs: [] }
        ]
    },
    socket: {
        title: "Socket Console", base: "socket.armoyu.com",
        actions: [
            { id: "connect", name: "Connect", method: "WS", endpoint: "/", desc: "Establish link", inputs: [] },
            { id: "disconnect", name: "Disconnect", method: "WS", endpoint: "/", desc: "Close link", inputs: [] }
        ]
    }
};

// --- Core Helper Functions ---

function log(type, msg, data = null, meta = null) {
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString();

    let metaHtml = "";
    if (meta) {
        if (meta.method) metaHtml += `<span class="badge badge-${meta.method}">${meta.method}</span> `;
        if (meta.status) {
            const statusClass = meta.status >= 200 && meta.status < 300 ? 'status-2xx' : (meta.status >= 400 ? 'status-4xx' : '');
            metaHtml += `<span class="badge ${statusClass}">${meta.status} ${meta.statusText || ''}</span> `;
        }
        if (meta.url) metaHtml += `<span class="url">${meta.url}</span>`;
    } else {
        metaHtml = `<span class="msg">${msg}</span>`;
    }

    entry.innerHTML = `
        <div class="log-header">
            <span class="time">[${time}]</span>
            ${metaHtml}
        </div>
        ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ""}
    `;
    consoleOutput.prepend(entry);
}

function renderSidebar() {
    sideNav.innerHTML = "";
    Object.keys(config).forEach(key => {
        const item = document.createElement("div");
        item.className = `nav-item ${key === currentTarget ? 'active' : ''}`;
        item.innerHTML = `<span class="icon">${icons[key] || "📦"}</span> ${key.charAt(0).toUpperCase() + key.slice(1)}Service`;
        
        item.onclick = () => {
            document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
            item.classList.add("active");
            renderPanel(key);
        };
        sideNav.appendChild(item);
    });
}

function renderPanel(target) {
    currentTarget = target;
    const panelConfig = config[target];
    panelTitle.innerText = panelConfig.title;
    actionPanel.innerHTML = "";

    panelConfig.actions.forEach(action => {
        const card = document.createElement("div");
        card.className = "action-card";
        const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
        const methodOptions = methods.map(m => `<option value="${m}" ${m === action.method ? 'selected' : ''}>${m}</option>`).join("");
        
        const defaultPath = `${config[target].base}${action.endpoint}`;

        card.innerHTML = `
            <div class="card-header">
                <h3>${action.name}</h3>
                <select id="method-${action.id}" class="method-select">${methodOptions}</select>
            </div>
            
            <div class="endpoint-bar">
                <span class="host-label">PATH:</span>
                <input type="text" id="path-${action.id}" class="endpoint-input" value="${defaultPath}">
            </div>

            <p class="action-desc">${action.desc}</p>

            <div class="card-inputs">
                ${action.inputs.map(i => `
                    <div class="input-group">
                        <label>${i}</label>
                        <input type="text" id="input-${action.id}-${i}" placeholder="Enter ${i}...">
                    </div>
                `).join("")}
            </div>
            <div class="advanced-section">
                <label>Custom JSON Body / Extra Params</label>
                <textarea id="custom-json-${action.id}" placeholder='{"extra": "data"}'></textarea>
            </div>
            <button class="btn btn-secondary" style="margin-top:1rem; width:100%" onclick="execute('${action.id}')">Execute Request</button>
        `;
        actionPanel.appendChild(card);
    });
}

window.execute = async (actionId) => {
    const actionConfig = config[currentTarget].actions.find(a => a.id === actionId);
    if (!actionConfig) return;

    // Get Method & Path from UI
    const method = document.getElementById(`method-${actionId}`).value;
    let path = document.getElementById(`path-${actionId}`).value;

    const params = {};
    actionConfig.inputs.forEach(i => params[i] = document.getElementById(`input-${actionId}-${i}`).value);

    // Get Custom JSON
    const customJsonRaw = document.getElementById(`custom-json-${actionId}`).value;
    let customData = {};
    if (customJsonRaw.trim()) {
        try {
            customData = JSON.parse(customJsonRaw);
        } catch (e) {
            log('error', "Invalid Custom JSON: " + e.message);
            return;
        }
    }

    // Merge Params
    const bodyData = { ...params, ...customData };

    if (method === "WS") return handleSocketAction(actionId, bodyData);

    // Replace URL path params if they exist in the manually edited path
    Object.entries(bodyData).forEach(([k, v]) => {
        if (path.includes(`{${k}}`)) {
            path = path.replace(`{${k}}`, v || `{${k}}`);
            delete bodyData[k];
        }
    });

    const apiKey = globalApiKeyInput.value;
    const bearer = globalBearerTokenInput.value;
    const headers = { 
        "Content-Type": "application/json",
        "X-API-KEY": apiKey, 
        "Authorization": "Bearer " + bearer 
    };

    const urlDisplay = `https://api.armoyu.com...${path}`;
    log('request', `Calling ${actionId}`, { method, headers, url: path, body: bodyData }, { method, url: urlDisplay });

    if (mockMode) {
        setTimeout(() => {
            log('response', `Response for ${actionId}`, mocks[currentTarget]?.[actionId] || { success: true }, {
                status: 200, statusText: "OK (Mock)"
            });
        }, 600);
    } else {
        try {
            const fetchOptions = {
                method: method,
                headers: headers
            };
            if (method !== "GET" && method !== "HEAD") {
                fetchOptions.body = JSON.stringify(bodyData);
            }

            const response = await fetch(`/proxy/${apiKey}${path}`, fetchOptions);
            const data = await response.json();
            log('response', `Response for ${actionId}`, data, {
                status: response.status,
                statusText: response.statusText,
                url: response.url
            });
        } catch (error) {
            log('error', "Real API Error: " + error.message);
        }
    }
};

function handleSocketAction(id, p) {
    if (id === 'connect') {
        socketStatus.className = "status-indicator connecting";
        log('system', "Attempting socket connection...");
        setTimeout(() => {
            socketStatus.className = "status-indicator online";
            log('system', "Connected to socket.armoyu.com!");
        }, 1200);
    } else if (id === 'disconnect') {
        socketStatus.className = "status-indicator offline";
        log('system', "Socket disconnected.");
    }
}

// --- Persistence & Initialization ---

globalApiKeyInput.value = localStorage.getItem("armoyu_api_key") || "";
globalBearerTokenInput.value = localStorage.getItem("armoyu_bearer_token") || "";

globalApiKeyInput.oninput = (e) => localStorage.setItem("armoyu_api_key", e.target.value);
globalBearerTokenInput.oninput = (e) => localStorage.setItem("armoyu_bearer_token", e.target.value);

toggleMockBtn.onclick = () => {
    mockMode = !mockMode;
    toggleMockBtn.innerText = `Mock Mode: ${mockMode ? 'ON' : 'OFF'}`;
};
clearConsoleBtn.onclick = () => consoleOutput.innerHTML = "";

renderSidebar();
renderPanel("auth");
setTimeout(() => handleSocketAction('connect'), 800);
