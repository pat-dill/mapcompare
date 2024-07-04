export function round(x: number, nearest: number) {
    return Math.round(x / nearest) * nearest;
}
