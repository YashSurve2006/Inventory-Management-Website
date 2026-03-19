function findComponent(components, category) {
    return components.find(c => c.category === category);
}

function checkCPUMotherboard(cpu, motherboard, warnings) {

    if (!cpu || !motherboard) return;

    if (cpu.cpu_socket && motherboard.supported_socket) {

        if (cpu.cpu_socket !== motherboard.supported_socket) {

            warnings.push({
                type: "CPU_SOCKET_MISMATCH",
                message: `CPU socket ${cpu.cpu_socket} is not compatible with motherboard socket ${motherboard.supported_socket}`
            });

        }

    }

}

function checkRAMMotherboard(ram, motherboard, warnings) {

    if (!ram || !motherboard) return;

    if (ram.ram_type && motherboard.supported_ram) {

        if (ram.ram_type !== motherboard.supported_ram) {

            warnings.push({
                type: "RAM_TYPE_MISMATCH",
                message: `RAM type ${ram.ram_type} not supported by motherboard (${motherboard.supported_ram})`
            });

        }

    }

}

function checkPSUGPU(psu, gpu, warnings) {

    if (!psu || !gpu) return;

    if (gpu.gpu_power && psu.psu_wattage) {

        if (psu.psu_wattage < gpu.gpu_power + 150) {

            warnings.push({
                type: "PSU_INSUFFICIENT",
                message: `PSU wattage (${psu.psu_wattage}W) may be insufficient for GPU (${gpu.gpu_power}W)`
            });

        }

    }

}

function estimateTotalPower(components) {

    let total = 0;

    components.forEach(c => {

        if (c.category === "GPU" && c.gpu_power) total += c.gpu_power;
        if (c.category === "CPU") total += 120;
        if (c.category === "Motherboard") total += 60;
        if (c.category === "RAM") total += 15;
        if (c.category === "Storage") total += 10;
        if (c.category === "Cooling") total += 10;

    });

    return total;

}

function checkOverallPower(psu, components, warnings) {

    if (!psu) return;

    const required = estimateTotalPower(components);

    if (psu.psu_wattage && psu.psu_wattage < required + 100) {

        warnings.push({
            type: "TOTAL_POWER_LOW",
            message: `Estimated power usage ${required}W exceeds safe PSU capacity`
        });

    }

}

function estimatePerformanceScore(components) {

    let score = 0;

    const cpu = findComponent(components, "CPU");
    const gpu = findComponent(components, "GPU");
    const ram = findComponent(components, "RAM");

    if (cpu) score += 40;
    if (gpu) score += 40;
    if (ram) score += 20;

    return score;

}

export const checkCompatibility = (components) => {

    const warnings = [];

    const cpu = findComponent(components, "CPU");
    const motherboard = findComponent(components, "Motherboard");
    const ram = findComponent(components, "RAM");
    const gpu = findComponent(components, "GPU");
    const psu = findComponent(components, "PSU");

    checkCPUMotherboard(cpu, motherboard, warnings);
    checkRAMMotherboard(ram, motherboard, warnings);
    checkPSUGPU(psu, gpu, warnings);
    checkOverallPower(psu, components, warnings);

    const performanceScore = estimatePerformanceScore(components);

    return {
        compatible: warnings.length === 0,
        warnings,
        performanceScore
    };

};