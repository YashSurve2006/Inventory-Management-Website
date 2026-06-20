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
        status: "Compatible"
    },

    totals: {
        price: 0,
        wattage: 0,
        safeWattage: 0
    },

    performance: {
        gaming: 0,
        workstation: 0,
        efficiency: 0,
        tier: "Entry"
    },

    ui: {
        notifications: [],
        lastAction: null,
    },

};

/* =========================================================
   HELPERS
========================================================= */

const num = (v) => {

    const n = Number(v);

    return isNaN(n)
        ? 0
        : Math.floor(n);

};

const clone = (obj) =>
    JSON.parse(JSON.stringify(obj));

const safe = (v) => {

    if (
        v === null ||
        v === undefined ||
        v === ""
    )
        return null;

    return String(v)
        .toLowerCase()
        .trim();

};

/* =========================================================
   PRICE
========================================================= */

const calculatePrice = (selected) => {

    return Object
        .values(selected)
        .reduce((sum, item) => {

            return sum +
                num(item?.price);

        }, 0);

};

/* =========================================================
   WATTAGE
========================================================= */

const calculateWattage = (selected) => {

    let watt = 0;

    watt += num(
        selected.cpu?.wattage || 65
    );

    watt += num(
        selected.gpu?.wattage || 150
    );

    if (selected.ram)
        watt += 10;

    if (selected.storage)
        watt += 10;

    if (selected.motherboard)
        watt += 50;

    return watt;

};

const calculateSafeWattage =
    (watt) =>
        Math.ceil(watt * 1.25);

/* =========================================================
   PERFORMANCE ENGINE
========================================================= */

const calculatePerformance =
    (selected) => {

        let gaming = 0;
        let workstation = 0;
        let efficiency = 80;

        if (selected.gpu)
            gaming += 60;

        if (selected.cpu)
            workstation += 50;

        if (selected.ram)
            workstation += 25;

        if (selected.storage)
            efficiency += 10;

        gaming =
            Math.min(gaming, 100);

        workstation =
            Math.min(workstation, 100);

        efficiency =
            Math.min(efficiency, 100);

        let tier = "Entry";

        if (gaming >= 90)
            tier = "High-End";

        else if (gaming >= 70)
            tier = "Gaming";

        else if (gaming >= 50)
            tier = "Balanced";

        return {
            gaming,
            workstation,
            efficiency,
            tier
        };

    };

/* =========================================================
   COMPATIBILITY ENGINE (MAX STRICT)
========================================================= */

const checkCompatibility =
    (selected) => {

        let issues = [];
        let warnings = [];

        const cpu =
            selected.cpu;

        const motherboard =
            selected.motherboard;

        const ram =
            selected.ram;

        const psu =
            selected.psu;

        const watt =
            calculateWattage(
                selected
            );

        const safeWatt =
            calculateSafeWattage(
                watt
            );

        /* REQUIRED COMPONENTS */

        if (!cpu)
            issues.push(
                "CPU not selected"
            );

        if (!motherboard)
            issues.push(
                "Motherboard not selected"
            );

        if (!ram)
            warnings.push(
                "RAM not selected"
            );

        if (!psu)
            warnings.push(
                "PSU not selected"
            );

        /* =========================================================
           CPU ↔ MOTHERBOARD SOCKET CHECK (STRICT)
        ========================================================= */

        if (cpu && motherboard) {

            const cpuSocket =
                safe(cpu.socket);

            const boardSocket =
                safe(motherboard.socket);

            if (
                cpuSocket &&
                boardSocket &&
                cpuSocket !== boardSocket
            ) {

                issues.push(
                    `CPU socket mismatch: ${cpu.socket} is not compatible with ${motherboard.socket}`
                );

            }

        }

        /* =========================================================
           RAM TYPE CHECK (STRICT)
        ========================================================= */

        if (
            ram &&
            motherboard
        ) {

            const ramType =
                safe(ram.ram_type);

            const boardRam =
                safe(
                    motherboard.ram_type
                );

            if (
                ramType &&
                boardRam &&
                ramType !== boardRam
            ) {

                issues.push(
                    `RAM type mismatch: ${ram.ram_type} not supported by motherboard (${motherboard.ram_type})`
                );

            }

        }

        /* =========================================================
           PSU POWER CHECK (STRICT)
        ========================================================= */

        if (
            psu &&
            num(psu.wattage) <
                safeWatt
        ) {

            issues.push(
                `PSU wattage too low. Required ${safeWatt}W`
            );

        }

        /* =========================================================
           SCORE CALCULATION (STRICT)
        ========================================================= */

        let score = 100;

        if (issues.length > 0) {

            score -=
                issues.length * 40;

        }

        if (warnings.length > 0) {

            score -=
                warnings.length * 10;

        }

        score =
            Math.max(score, 0);

        /* =========================================================
           STATUS LOGIC (FORCE NOT COMPATIBLE)
        ========================================================= */

        let status =
            "Compatible";

        if (issues.length > 0) {

            status =
                "Not Compatible";

            /* HARD LIMIT */

            if (score > 50)
                score = 50;

        }

        else if (
            warnings.length > 0
        ) {

            status =
                "Minor Issues";

        }

        return {

            issues,
            warnings,
            score,
            status

        };

    };

/* =========================================================
   STORAGE
========================================================= */

const persist =
    (state) => {

        localStorage.setItem(
            "pc_builder_state",
            JSON.stringify(state)
        );

    };

const load =
    () => {

        try {

            const data =
                localStorage.getItem(
                    "pc_builder_state"
                );

            return data
                ? JSON.parse(data)
                : null;

        }

        catch {

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
    REMOVE_NOTIFY:
        "REMOVE_NOTIFY",

};

/* =========================================================
   REDUCER
========================================================= */

const reducer =
    (state, action) => {

        switch (action.type) {

            case ACTIONS.SELECT: {

                const newSelected = {

                    ...state.selected,

                    [
                        action.payload.type
                    ]:
                        action.payload.part,

                };

                return {

                    ...state,

                    selected:
                        newSelected,

                    history: [
                        ...state.history,
                        clone(
                            state.selected
                        ),
                    ],

                    future: [],

                    ui: {

                        ...state.ui,

                        lastAction:
                            "SELECT",

                    },

                };

            }

            case ACTIONS.REMOVE: {

                const newSelected = {

                    ...state.selected,

                    [
                        action.payload
                    ]: null,

                };

                return {

                    ...state,

                    selected:
                        newSelected,

                    history: [
                        ...state.history,
                        clone(
                            state.selected
                        ),
                    ],

                };

            }

            case ACTIONS.RESET:

                return initialState;

            case ACTIONS.UNDO: {

                if (
                    !state.history
                        .length
                )
                    return state;

                const prev =
                    state.history[
                        state.history
                            .length -
                            1
                    ];

                return {

                    ...state,

                    selected:
                        prev,

                    history:
                        state.history.slice(
                            0,
                            -1
                        ),

                    future: [
                        clone(
                            state.selected
                        ),
                        ...state.future,
                    ],

                };

            }

            case ACTIONS.REDO: {

                if (
                    !state.future
                        .length
                )
                    return state;

                const next =
                    state.future[0];

                return {

                    ...state,

                    selected:
                        next,

                    future:
                        state.future.slice(
                            1
                        ),

                    history: [
                        ...state.history,
                        clone(
                            state.selected
                        ),
                    ],

                };

            }

            case ACTIONS.LOAD:

                return action.payload;

            case ACTIONS.NOTIFY:

                return {

                    ...state,

                    ui: {

                        ...state.ui,

                        notifications: [

                            ...state.ui
                                .notifications,

                            action.payload,

                        ],

                    },

                };

            case ACTIONS.REMOVE_NOTIFY:

                return {

                    ...state,

                    ui: {

                        ...state.ui,

                        notifications:
                            state.ui.notifications.filter(
                                (n) =>
                                    n.id !==
                                    action.payload
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

const BuilderContext =
    createContext();

/* =========================================================
   PROVIDER
========================================================= */

export const BuilderProvider =
    ({ children }) => {

        const [state, dispatch] =
            useReducer(
                reducer,
                initialState
            );

        useEffect(() => {

            const saved =
                load();

            if (saved)

                dispatch({

                    type: ACTIONS.LOAD,

                    payload: saved,

                });

        }, []);

        const totals =
            useMemo(() => {

                const watt =
                    calculateWattage(
                        state.selected
                    );

                return {

                    price:
                        calculatePrice(
                            state.selected
                        ),

                    wattage: watt,

                    safeWattage:
                        calculateSafeWattage(
                            watt
                        ),

                };

            }, [state.selected]);

        const compatibility =
            useMemo(() => {

                return checkCompatibility(
                    state.selected
                );

            }, [state.selected]);

        const performance =
            useMemo(() => {

                return calculatePerformance(
                    state.selected
                );

            }, [state.selected]);

        useEffect(() => {

            persist({

                ...state,

                totals,

                compatibility,

                performance,

            });

        }, [
            state.selected,
            totals,
            compatibility,
            performance,
        ]);

        const addNotification =
            (message) => {

                const id =
                    Date.now();

                dispatch({

                    type: ACTIONS.NOTIFY,

                    payload: {
                        id,
                        message,
                    },

                });

                setTimeout(() => {

                    dispatch({

                        type:
                            ACTIONS.REMOVE_NOTIFY,

                        payload: id,

                    });

                }, 3000);

            };

        const selectPart =
            (type, part) => {

                dispatch({

                    type:
                        ACTIONS.SELECT,

                    payload: {
                        type,
                        part,
                    },

                });

                addNotification(
                    `Added ${part?.name || type}`
                );

            };

        const removePart =
            (type) => {

                dispatch({

                    type:
                        ACTIONS.REMOVE,

                    payload: type,

                });

                addNotification(
                    `Removed ${type}`
                );

            };

        const resetBuild =
            () => {

                dispatch({
                    type:
                        ACTIONS.RESET,
                });

                addNotification(
                    "Build reset"
                );

            };

        const undo =
            () =>
                dispatch({
                    type:
                        ACTIONS.UNDO,
                });

        const redo =
            () =>
                dispatch({
                    type:
                        ACTIONS.REDO,
                });

        const value = {

            selected:
                state.selected,

            totals,

            compatibility,

            performance,

            ui: state.ui,

            selectPart,

            removePart,

            resetBuild,

            undo,

            redo,

            addNotification,

        };

        return (

            <BuilderContext.Provider value={value}>

                {children}

            </BuilderContext.Provider>

        );

    };

export const useBuilder =
    () => {

        const ctx =
            useContext(
                BuilderContext
            );

        if (!ctx)

            throw new Error(
                "useBuilder must be used inside BuilderProvider"
            );

        return ctx;

    };