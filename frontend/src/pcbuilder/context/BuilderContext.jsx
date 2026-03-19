import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useMemo,
} from "react";

/* =========================================================
   INITIAL STATE
========================================================= */
const initialState = {
    selected: {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        cabinet: null,
    },

    history: [],
    future: [],

    compatibility: {
        issues: [],
        warnings: [],
        score: 100,
    },

    totals: {
        price: 0,
        wattage: 0,
    },

    performance: {
        gaming: 0,
        workstation: 0,
        efficiency: 0,
    },

    ui: {
        notifications: [],
        lastAction: null,
    },
};

/* =========================================================
   HELPERS
========================================================= */

// ✅ Safe number (fixes weird decimal bug)
const num = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : Math.floor(n); // remove decimals
};

// ✅ Deep clone (for undo/redo safety)
const clone = (obj) => JSON.parse(JSON.stringify(obj));

/* ================================
   PRICE CALCULATION (FIXED)
================================ */
const calculatePrice = (selected) => {
    return Object.values(selected).reduce((sum, item) => {
        return sum + num(item?.price);
    }, 0);
};

/* ================================
   WATTAGE CALCULATION
================================ */
const calculateWattage = (selected) => {
    let watt = 0;

    watt += num(selected.cpu?.wattage || 65);
    watt += num(selected.gpu?.wattage || 150);
    watt += selected.ram ? 10 : 0;
    watt += selected.storage ? 10 : 0;

    return watt;
};

/* ================================
   PERFORMANCE ENGINE (ADVANCED)
================================ */
const calculatePerformance = (selected) => {
    let gaming = 0;
    let workstation = 0;
    let efficiency = 100;

    if (selected.gpu) gaming += 60;
    if (selected.cpu) workstation += 50;
    if (selected.ram) workstation += 25;
    if (selected.storage) efficiency += 10;

    return {
        gaming: Math.min(gaming, 100),
        workstation: Math.min(workstation, 100),
        efficiency: Math.min(efficiency, 100),
    };
};

/* ================================
   COMPATIBILITY ENGINE
================================ */
const checkCompatibility = (selected) => {
    let issues = [];
    let warnings = [];

    const cpu = selected.cpu;
    const motherboard = selected.motherboard;
    const ram = selected.ram;
    const psu = selected.psu;

    const safe = (v) =>
        v === null || v === undefined || v === ""
            ? null
            : String(v).toLowerCase();

    /* CPU ↔ Motherboard */
    if (cpu && motherboard) {
        if (safe(cpu.socket) && safe(motherboard.socket)) {
            if (safe(cpu.socket) !== safe(motherboard.socket)) {
                issues.push("CPU socket does not match motherboard");
            }
        }
    }

    /* RAM */
    if (ram && motherboard) {
        if (safe(ram.ram_type) && safe(motherboard.ram_type)) {
            if (safe(ram.ram_type) !== safe(motherboard.ram_type)) {
                issues.push("RAM type mismatch");
            }
        }
    }

    /* PSU */
    const watt = calculateWattage(selected);
    if (psu && num(psu.wattage) < watt) {
        warnings.push("PSU wattage may be insufficient");
    }

    return {
        issues,
        warnings,
        score: Math.max(0, 100 - issues.length * 30 - warnings.length * 10),
    };
};

/* ================================
   LOCAL STORAGE
================================ */
const persist = (state) => {
    localStorage.setItem("pc_builder_state", JSON.stringify(state));
};

const load = () => {
    try {
        const data = localStorage.getItem("pc_builder_state");
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};

/* =========================================================
   ACTIONS
========================================================= */
const ACTIONS = {
    SELECT: "SELECT",
    REMOVE: "REMOVE",
    RESET: "RESET",
    UNDO: "UNDO",
    REDO: "REDO",
    LOAD: "LOAD",
    NOTIFY: "NOTIFY",
    REMOVE_NOTIFY: "REMOVE_NOTIFY",
};

/* =========================================================
   REDUCER
========================================================= */
const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SELECT: {
            const newSelected = {
                ...state.selected,
                [action.payload.type]: action.payload.part,
            };

            return {
                ...state,
                selected: newSelected,
                history: [...state.history, clone(state.selected)],
                future: [],
                ui: { ...state.ui, lastAction: "SELECT" },
            };
        }

        case ACTIONS.REMOVE: {
            const newSelected = {
                ...state.selected,
                [action.payload]: null,
            };

            return {
                ...state,
                selected: newSelected,
                history: [...state.history, clone(state.selected)],
            };
        }

        case ACTIONS.RESET:
            return initialState;

        case ACTIONS.UNDO: {
            if (!state.history.length) return state;

            const prev = state.history[state.history.length - 1];

            return {
                ...state,
                selected: prev,
                history: state.history.slice(0, -1),
                future: [clone(state.selected), ...state.future],
            };
        }

        case ACTIONS.REDO: {
            if (!state.future.length) return state;

            const next = state.future[0];

            return {
                ...state,
                selected: next,
                future: state.future.slice(1),
                history: [...state.history, clone(state.selected)],
            };
        }

        case ACTIONS.LOAD:
            return action.payload;

        case ACTIONS.NOTIFY:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    notifications: [...state.ui.notifications, action.payload],
                },
            };

        case ACTIONS.REMOVE_NOTIFY:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    notifications: state.ui.notifications.filter(
                        (n) => n.id !== action.payload
                    ),
                },
            };

        default:
            return state;
    }
};

/* =========================================================
   CONTEXT
========================================================= */
const BuilderContext = createContext();

/* =========================================================
   PROVIDER
========================================================= */
export const BuilderProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    /* LOAD */
    useEffect(() => {
        const saved = load();
        if (saved) dispatch({ type: ACTIONS.LOAD, payload: saved });
    }, []);

    /* DERIVED */
    const totals = useMemo(() => ({
        price: calculatePrice(state.selected),
        wattage: calculateWattage(state.selected),
    }), [state.selected]);

    const compatibility = useMemo(() => {
        return checkCompatibility(state.selected);
    }, [state.selected]);

    const performance = useMemo(() => {
        return calculatePerformance(state.selected);
    }, [state.selected]);

    /* SAVE */
    useEffect(() => {
        persist({
            ...state,
            totals,
            compatibility,
            performance,
        });
    }, [state.selected, totals, compatibility, performance]);

    /* ================================
       ACTIONS
    ================================= */
    const selectPart = (type, part) => {
        dispatch({ type: ACTIONS.SELECT, payload: { type, part } });

        addNotification(`Added ${part?.name || type}`);
    };

    const removePart = (type) => {
        dispatch({ type: ACTIONS.REMOVE, payload: type });

        addNotification(`Removed ${type}`);
    };

    const resetBuild = () => {
        dispatch({ type: ACTIONS.RESET });
        addNotification("Build reset");
    };

    const undo = () => dispatch({ type: ACTIONS.UNDO });
    const redo = () => dispatch({ type: ACTIONS.REDO });

    /* ================================
       NOTIFICATIONS (AUTO REMOVE)
    ================================= */
    const addNotification = (message) => {
        const id = Date.now();

        dispatch({
            type: ACTIONS.NOTIFY,
            payload: { id, message },
        });

        setTimeout(() => {
            dispatch({ type: ACTIONS.REMOVE_NOTIFY, payload: id });
        }, 3000);
    };

    /* ================================
       FUTURE 3D HOOK
    ================================= */
    const syncWith3D = () => {
        // reserved for future
    };

    /* ================================
       CONTEXT VALUE
    ================================= */
    const value = {
        selected: state.selected,
        totals,
        compatibility,
        performance,
        ui: state.ui, // ✅ IMPORTANT FIX

        selectPart,
        removePart,
        resetBuild,
        undo,
        redo,

        addNotification,
        syncWith3D,
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};

/* =========================================================
   HOOK
========================================================= */
export const useBuilder = () => {
    const ctx = useContext(BuilderContext);
    if (!ctx)
        throw new Error("useBuilder must be used inside BuilderProvider");
    return ctx;
};