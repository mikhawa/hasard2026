'use strict';

/**
 * Chart.js utilities for Hasard 2026
 * Replaces JpGraph server-side charts with client-side interactive charts
 */

/**
 * Create a pie chart
 * @param {string} canvasId - The ID of the canvas element
 * @param {Object} data - The chart data { labels, data, colors }
 */
function createPieChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas element with id "${canvasId}" not found`);
        return null;
    }

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.raw;
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create a bar chart
 * @param {string} canvasId - The ID of the canvas element
 * @param {Object} data - The chart data { title, labels, data }
 */
function createBarChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas element with id "${canvasId}" not found`);
        return null;
    }

    // Generate gradient colors based on data values
    const maxValue = Math.max(...data.data);
    const colors = data.data.map(value => {
        const intensity = maxValue > 0 ? value / maxValue : 0;
        const hue = 200 + (intensity * 60); // Blue to purple gradient
        return `hsla(${hue}, 70%, 50%, 0.7)`;
    });

    const borderColors = data.data.map(value => {
        const intensity = maxValue > 0 ? value / maxValue : 0;
        const hue = 200 + (intensity * 60);
        return `hsl(${hue}, 70%, 40%)`;
    });

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: data.title,
                data: data.data,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: data.title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

/**
 * Fetch and create a pie chart from API
 * @param {string} canvasId - The ID of the canvas element
 * @param {number} classeId - The class ID
 * @param {string} temps - The time filter
 */
async function loadPieChartFromApi(canvasId, classeId, temps = 'tous') {
    try {
        const response = await fetch(`/api/chart/pie/${classeId}?temps=${temps}`);
        if (!response.ok) {
            throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        return createPieChart(canvasId, data);
    } catch (error) {
        console.error('Error loading pie chart:', error);
        return null;
    }
}

/**
 * Fetch and create a bar chart from API
 * @param {string} canvasId - The ID of the canvas element
 * @param {number} classeId - The class ID
 * @param {string} type - The type ('points' or 'sorties')
 * @param {string} temps - The time filter
 */
async function loadBarChartFromApi(canvasId, classeId, type = 'points', temps = 'tous') {
    try {
        const response = await fetch(`/api/chart/bar/${classeId}?type=${type}&temps=${temps}`);
        if (!response.ok) {
            throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        return createBarChart(canvasId, data);
    } catch (error) {
        console.error('Error loading bar chart:', error);
        return null;
    }
}
