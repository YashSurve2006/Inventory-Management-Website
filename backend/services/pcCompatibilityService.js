/* =====================================================
   ULTRA ADVANCED COMPATIBILITY ENGINE
   FULLY COMPATIBLE WITH YOUR CURRENT TABLE
===================================================== */

function findComponent(components, category) {
    return components.find(
        c => c.category === category
    );
}

function pushWarning(
    warnings,
    type,
    message,
    severity = "error"
) {
    warnings.push({
        type,
        message,
        severity
    });
}

function normalize(value) {
    if (!value) return [];
    return value
        .toString()
        .split(",")
        .map(v => v.trim().toUpperCase());
}

/* =====================================================
   REQUIRED COMPONENT CHECK
===================================================== */

function checkRequiredComponents(
    components,
    warnings
) {

    const required = [
        "CPU",
        "Motherboard",
        "RAM",
        "Storage",
        "PSU"
    ];

    required.forEach(cat => {

        if (
            !findComponent(
                components,
                cat
            )
        ) {

            pushWarning(
                warnings,
                "MISSING_COMPONENT",
                `${cat} is required`
            );

        }

    });

}

/* =====================================================
   DUPLICATE CATEGORY CHECK
===================================================== */

function checkDuplicates(
    components,
    warnings
) {

    const seen = new Set();

    components.forEach(c => {

        if (
            seen.has(c.category)
        ) {

            pushWarning(
                warnings,
                "DUPLICATE_COMPONENT",
                `Multiple ${c.category} selected`
            );

        }

        seen.add(c.category);

    });

}

/* =====================================================
   CPU ↔ MOTHERBOARD
===================================================== */

function checkCPUMotherboard(
    cpu,
    motherboard,
    warnings
) {

    if (!cpu || !motherboard) return;

    const cpuBrand =
        cpu.brand?.toUpperCase();

    const mbBrand =
        motherboard.brand?.toUpperCase();

    if (
        cpuBrand &&
        mbBrand &&
        cpuBrand !== mbBrand
    ) {

        pushWarning(
            warnings,
            "CPU_BRAND_MISMATCH",
            `CPU (${cpu.brand}) incompatible with motherboard (${motherboard.brand})`
        );

    }

    const cpuSockets =
        normalize(cpu.socket);

    const mbSockets =
        normalize(motherboard.socket);

    const compatible =
        cpuSockets.some(s =>
            mbSockets.includes(s)
        );

    if (!compatible) {

        pushWarning(
            warnings,
            "CPU_SOCKET_MISMATCH",
            `CPU socket not supported`
        );

    }

}

/* =====================================================
   RAM ↔ MOTHERBOARD
===================================================== */

function checkRAMMotherboard(
    ram,
    motherboard,
    warnings
) {

    if (!ram || !motherboard) return;

    const ramTypes =
        normalize(
            ram.ram_type
        );

    const mbTypes =
        normalize(
            motherboard.ram_type
        );

    const compatible =
        ramTypes.some(t =>
            mbTypes.includes(t)
        );

    if (!compatible) {

        pushWarning(
            warnings,
            "RAM_TYPE_MISMATCH",
            `RAM type not supported`
        );

    }

}

/* =====================================================
   STORAGE ↔ MOTHERBOARD
===================================================== */

function checkStorage(
    storage,
    motherboard,
    warnings
) {

    if (!storage || !motherboard) return;

    const storageTypes =
        normalize(
            storage.storage_type
        );

    const mbTypes =
        normalize(
            motherboard.storage_type
        );

    const compatible =
        storageTypes.some(t =>
            mbTypes.includes(t)
        );

    if (!compatible) {

        pushWarning(
            warnings,
            "STORAGE_NOT_SUPPORTED",
            `Storage type not supported`
        );

    }

}

/* =====================================================
   GPU ↔ CABINET SIZE
===================================================== */

function checkGPUCabinet(
    gpu,
    cabinet,
    warnings
) {

    if (!gpu || !cabinet) return;

    const gpuSize =
        parseInt(gpu.size);

    const cabinetSize =
        parseInt(cabinet.size);

    if (
        gpuSize &&
        cabinetSize &&
        gpuSize > cabinetSize
    ) {

        pushWarning(
            warnings,
            "GPU_TOO_LARGE",
            `GPU does not fit in cabinet`
        );

    }

}

/* =====================================================
   POWER ESTIMATION
===================================================== */

function estimatePower(
    components
) {

    let total = 0;

    components.forEach(c => {

        switch (
            c.category
        ) {

            case "GPU":
                total += 250;
                break;

            case "CPU":
                total += 120;
                break;

            case "Motherboard":
                total += 60;
                break;

            case "RAM":
                total += 15;
                break;

            case "Storage":
                total += 10;
                break;

        }

    });

    return total;

}

/* =====================================================
   PSU CHECK
===================================================== */

function checkPSU(
    psu,
    components,
    warnings
) {

    if (!psu) return;

    const required =
        estimatePower(
            components
        );

    const safe =
        Math.ceil(
            required * 1.25
        );

    if (
        psu.wattage &&
        psu.wattage < safe
    ) {

        pushWarning(
            warnings,
            "LOW_POWER",
            `Minimum PSU required ${safe}W`
        );

    }

}

/* =====================================================
   BOTTLENECK DETECTION
===================================================== */

function detectBottleneck(
    cpu,
    gpu,
    warnings
) {

    if (!cpu || !gpu) return;

    if (
        cpu.price &&
        gpu.price
    ) {

        const ratio =
            cpu.price /
            gpu.price;

        if (ratio < 0.4) {

            pushWarning(
                warnings,
                "CPU_BOTTLENECK",
                "CPU may bottleneck GPU",
                "warning"
            );

        }

        if (ratio > 2.5) {

            pushWarning(
                warnings,
                "GPU_BOTTLENECK",
                "GPU may bottleneck CPU",
                "warning"
            );

        }

    }

}

/* =====================================================
   PERFORMANCE SCORE
===================================================== */

function performanceScore(
    components
) {

    let score = 0;

    if (
        findComponent(
            components,
            "CPU"
        )
    )
        score += 40;

    if (
        findComponent(
            components,
            "GPU"
        )
    )
        score += 40;

    if (
        findComponent(
            components,
            "RAM"
        )
    )
        score += 20;

    return score;

}

function performanceTier(
    score
) {

    if (score >= 90)
        return "High-End";

    if (score >= 70)
        return "Gaming";

    if (score >= 50)
        return "Mid-Range";

    return "Entry-Level";

}

/* =====================================================
   MAIN FUNCTION
===================================================== */

export const checkCompatibility =
    (components) => {

        const warnings = [];

        checkRequiredComponents(
            components,
            warnings
        );

        checkDuplicates(
            components,
            warnings
        );

        const cpu =
            findComponent(
                components,
                "CPU"
            );

        const motherboard =
            findComponent(
                components,
                "Motherboard"
            );

        const ram =
            findComponent(
                components,
                "RAM"
            );

        const gpu =
            findComponent(
                components,
                "GPU"
            );

        const psu =
            findComponent(
                components,
                "PSU"
            );

        const storage =
            findComponent(
                components,
                "Storage"
            );

        const cabinet =
            findComponent(
                components,
                "Cabinet"
            );

        checkCPUMotherboard(
            cpu,
            motherboard,
            warnings
        );

        checkRAMMotherboard(
            ram,
            motherboard,
            warnings
        );

        checkStorage(
            storage,
            motherboard,
            warnings
        );

        checkGPUCabinet(
            gpu,
            cabinet,
            warnings
        );

        checkPSU(
            psu,
            components,
            warnings
        );

        detectBottleneck(
            cpu,
            gpu,
            warnings
        );

        const score =
            performanceScore(
                components
            );

        return {

            compatible:
                warnings.filter(
                    w =>
                        w.severity !==
                        "warning"
                ).length === 0,

            warnings,

            performanceScore:
                score,

            performanceTier:
                performanceTier(
                    score
                )

        };

    };