"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCustomRangeData = exports.generateLast12MothsData = void 0;
async function generateLast12MothsData(model) {
    const last12Months = [];
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    for (let i = 11; i >= 0; i--) {
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 28);
        const monthYear = endDate.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        last12Months.push({ month: monthYear, count });
    }
    return { last12Months };
}
exports.generateLast12MothsData = generateLast12MothsData;
// Generate analytics data for custom date range
async function generateCustomRangeData(model, startDate, endDate, groupBy = 'day') {
    const data = [];
    let totalRevenue = 0;
    // Adjust endDate to include the entire day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);
    if (groupBy === 'day') {
        const currentDate = new Date(startDate);
        while (currentDate <= adjustedEndDate) {
            const nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
            const dateStr = currentDate.toLocaleString("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
            const docs = await model.find({
                createdAt: {
                    $gte: currentDate,
                    $lt: nextDate,
                },
            });
            const count = docs.length;
            // Calculate revenue if it's an order model
            if (docs.length > 0 && 'price' in docs[0]) {
                const dayRevenue = docs.reduce((sum, doc) => sum + (doc.price || 0), 0);
                totalRevenue += dayRevenue;
            }
            data.push({ month: dateStr, count });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    else if (groupBy === 'month') {
        const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const endMonth = new Date(adjustedEndDate.getFullYear(), adjustedEndDate.getMonth(), 1);
        while (currentDate <= endMonth) {
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const monthStr = currentDate.toLocaleString("default", {
                month: "short",
                year: "numeric",
            });
            const docs = await model.find({
                createdAt: {
                    $gte: currentDate,
                    $lt: nextMonth,
                },
            });
            const count = docs.length;
            if (docs.length > 0 && 'price' in docs[0]) {
                const monthRevenue = docs.reduce((sum, doc) => sum + (doc.price || 0), 0);
                totalRevenue += monthRevenue;
            }
            data.push({ month: monthStr, count });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }
    else if (groupBy === 'year') {
        const currentYear = startDate.getFullYear();
        const endYear = adjustedEndDate.getFullYear();
        for (let year = currentYear; year <= endYear; year++) {
            const yearStart = new Date(year, 0, 1);
            const yearEnd = new Date(year + 1, 0, 1);
            const docs = await model.find({
                createdAt: {
                    $gte: yearStart,
                    $lt: yearEnd,
                },
            });
            const count = docs.length;
            if (docs.length > 0 && 'price' in docs[0]) {
                const yearRevenue = docs.reduce((sum, doc) => sum + (doc.price || 0), 0);
                totalRevenue += yearRevenue;
            }
            data.push({ month: year.toString(), count });
        }
    }
    return { data, totalRevenue };
}
exports.generateCustomRangeData = generateCustomRangeData;
